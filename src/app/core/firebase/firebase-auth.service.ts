/**
 * Firebase Authentication Service
 *
 * Wraps Firebase Auth SDK to provide:
 * - Email/password register & login
 * - Auth state restoration on page reload
 * - User profile resolution from Firestore /users collection
 * - Logout
 * - Password reset request
 *
 * SECURITY PRINCIPLES:
 * - Role is ALWAYS read from Firestore /users/{uid}.role — never from client payload
 * - Auth state is the single source of truth for the Angular application
 * - Route guards consume this service for navigation (not security enforcement)
 * - Actual security enforcement is in Firestore Security Rules (server-side)
 *
 * INTEGRATION:
 * - AuthStateService is updated whenever auth state changes
 * - Components use AuthStateService signals; this service is the writer
 */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
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
    // Subscribe to Firebase Auth state changes
    // This runs on every page load, login, and logout
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
        title: '',               // Loaded from /professionals collection separately
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

    // Fallback — should never happen with proper Firestore rules
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
      return { success: true };
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this.authError.set(mapped.userMessage);
      return { success: false, error: mapped.userMessage };
    }
  }

  /**
   * Register new user and create Firestore user document.
   * Role is set at registration and CANNOT be changed by client subsequently.
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

      // Update Firebase Auth profile display name
      await updateProfile(credential.user, { displayName: fullName });

      // Create user document in Firestore
      // IMPORTANT: role is written here by the client on first registration.
      // For production, consider using Cloud Functions to validate role on write.
      // Security Rules prevent future role changes by non-admin.
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
