/**
 * Firebase Authentication Service
 *
 * Wraps Firebase Auth SDK to provide:
 * - Email/password register & login
 * - Google OAuth Sign-in (signInWithPopup)
 * - Auth state restoration on page reload
 * - User profile resolution from Firestore /users collection
 * - Logout & password reset
 *
 * SECURITY PRINCIPLES:
 * - Role is ALWAYS read from Firestore /users/{uid}.role — never trusted from client payload
 * - Auth state is the single source of truth for the Angular application
 * - Route guards consume this service for navigation (not security enforcement)
 * - Actual security enforcement is in Firestore Security Rules (server-side)
 */

import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from './firebase.app';
import { FirestoreUser, COLLECTIONS, FirestoreUserRole } from './firestore.types';
import { mapFirebaseError } from './firebase-error.handler';
import { UserProfile, CustomerProfile, LegalProfessionalProfile, AdminProfile } from '../models/user.model';
import { UserRole } from '../models/role.enum';
import { AuthStateService } from '../services/auth-state.service';

export interface AuthResult {
  success: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private readonly auth = inject(FIREBASE_AUTH);
  private readonly db = inject(FIREBASE_FIRESTORE);
  private readonly authStateService = inject(AuthStateService);
  private readonly router = inject(Router);

  // Loading state for auth operations
  public readonly isAuthLoading = signal<boolean>(true);
  public readonly authError = signal<string | null>(null);

  constructor() {
    this.initAuthStateListener();
  }

  /**
   * Listen to Firebase Auth state and sync with AuthStateService.
   * Called once on service construction.
   */
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      this.isAuthLoading.set(true);
      try {
        if (firebaseUser) {
          const profile = await this.resolveUserProfile(firebaseUser);
          this.authStateService.setUser(profile);
        } else {
          this.authStateService.setUser(null);
        }
      } catch (err) {
        console.error('[AuthService] Failed to resolve user profile:', err);
        this.authStateService.setUser(null);
      } finally {
        this.isAuthLoading.set(false);
      }
    });
  }

  /**
   * Resolve user profile from Firestore based on Firebase Auth UID.
   * Role is ALWAYS read from Firestore — never from client-provided data.
   */
  private async resolveUserProfile(firebaseUser: FirebaseUser): Promise<UserProfile | null> {
    const userDocRef = doc(this.db, COLLECTIONS.USERS, firebaseUser.uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      console.warn('[AuthService] User document not found for uid:', firebaseUser.uid);
      return null;
    }

    const data = snapshot.data() as FirestoreUser;
    return this.mapFirestoreUserToProfile(data, firebaseUser.uid);
  }

  /**
   * Map Firestore user document to Angular UserProfile interface.
   */
  private mapFirestoreUserToProfile(data: FirestoreUser, uid: string): UserProfile {
    const createdAt = data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : new Date().toISOString();
    const updatedAt = data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : new Date().toISOString();

    const base = {
      id: uid,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      avatarUrl: data.avatarUrl,
      createdAt,
      updatedAt,
      isEmailVerified: data.isEmailVerified ?? false,
      isActive: data.status === 'active',
    };

    if (data.role === 'CUSTOMER') {
      return {
        ...base,
        role: UserRole.CUSTOMER,
        customerType: data.customerType ?? 'INDIVIDUAL',
        companyName: data.companyName,
        city: data.city,
      } as CustomerProfile;
    }

    if (data.role === 'LEGAL_PRO') {
      return {
        ...base,
        role: UserRole.LEGAL_PRO,
        title: '',
        barLicenseNumber: data.barLicenseNumber ?? '',
        specializations: [],
        yearsOfExperience: 0,
        bio: '',
        rating: 0,
        reviewCount: 0,
        consultationFee: 0,
        locationCity: '',
        isVerified: data.verificationStatus === 'VERIFIED',
        education: [],
        languages: [],
      } as LegalProfessionalProfile;
    }

    if (data.role === 'ADMIN') {
      return {
        ...base,
        role: UserRole.ADMIN,
        department: data.department ?? 'Operations',
      } as AdminProfile;
    }

    throw new Error(`[AuthService] Unknown role for uid ${uid}: ${data.role}`);
  }

  /**
   * Login with email and password.
   * Profile is resolved from Firestore after successful login.
   */
  public async login(email: string, password: string): Promise<AuthResult> {
    this.authError.set(null);
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      const uid = this.getCurrentUid();
      if (uid) {
        const profile = await this.resolveUserProfile(this.auth.currentUser!);
        if (profile) {
          this.authStateService.setUser(profile);
          const targetRoute = this.authStateService.getPortalRouteForRole(profile.role);
          this.router.navigate([targetRoute]);
        }
      }
      return { success: true };
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this.authError.set(mapped.userMessage);
      return { success: false, error: mapped.userMessage };
    }
  }

  /**
   * Sign in with Google (OAuth popup).
   * Creates Firestore user profile document if user logs in for the first time.
   */
  public async loginWithGoogle(desiredRole: 'CUSTOMER' | 'LEGAL_PRO' = 'CUSTOMER'): Promise<AuthResult> {
    this.authError.set(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(this.auth, provider);
      const uid = credential.user.uid;
      const email = credential.user.email ?? '';
      const fullName = credential.user.displayName ?? 'Pengguna Google';
      const avatarUrl = credential.user.photoURL ?? undefined;

      const userDocRef = doc(this.db, COLLECTIONS.USERS, uid);
      const snapshot = await getDoc(userDocRef);

      if (!snapshot.exists()) {
        const userDoc: FirestoreUser = {
          uid,
          email,
          fullName,
          avatarUrl,
          role: desiredRole as FirestoreUserRole,
          status: desiredRole === 'LEGAL_PRO' ? 'pending' : 'active',
          isEmailVerified: true,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        };
        await setDoc(userDocRef, userDoc);
      }

      const updatedSnap = await getDoc(userDocRef);
      if (updatedSnap.exists()) {
        const profile = this.mapFirestoreUserToProfile(updatedSnap.data() as FirestoreUser, uid);
        this.authStateService.setUser(profile);
        const targetRoute = this.authStateService.getPortalRouteForRole(profile.role);
        this.router.navigate([targetRoute]);
      }

      return { success: true };
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this.authError.set(mapped.userMessage);
      return { success: false, error: mapped.userMessage };
    }
  }

  /**
   * Register new user with email and password and create Firestore user document.
   */
  public async register(
    fullName: string,
    email: string,
    password: string,
    role: 'CUSTOMER' | 'LEGAL_PRO'
  ): Promise<AuthResult> {
    this.authError.set(null);
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = credential.user.uid;

      await updateProfile(credential.user, { displayName: fullName });

      const userDoc: FirestoreUser = {
        uid,
        email,
        fullName,
        role: role as FirestoreUserRole,
        status: role === 'LEGAL_PRO' ? 'pending' : 'active',
        isEmailVerified: false,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      await setDoc(doc(this.db, COLLECTIONS.USERS, uid), userDoc);

      const profile = this.mapFirestoreUserToProfile(userDoc, uid);
      this.authStateService.setUser(profile);
      const targetRoute = this.authStateService.getPortalRouteForRole(profile.role);
      this.router.navigate([targetRoute]);

      return { success: true };
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this.authError.set(mapped.userMessage);
      return { success: false, error: mapped.userMessage };
    }
  }

  /**
   * Sign out current user and clear application state.
   */
  public async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.authStateService.setUser(null);
      this.router.navigate(['/auth/login']);
    } catch (err) {
      console.error('[AuthService] Logout error:', err);
    }
  }

  /**
   * Send password reset email.
   */
  public async sendPasswordReset(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (err) {
      const mapped = mapFirebaseError(err);
      return { success: false, error: mapped.userMessage };
    }
  }

  /**
   * Get current Firebase Auth user UID synchronously.
   */
  public getCurrentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
