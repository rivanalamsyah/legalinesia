/**
 * Firestore User Profile Service
 *
 * Manages user profile reads and writes for Customer, Professional, and Admin.
 * Professional extended data is stored in /professionals collection.
 *
 * Security:
 * - Users can only read/update their own profile
 * - Role and status fields are protected against user modification
 * - Admin can read/update any user profile
 */

import { Injectable, inject, signal } from '@angular/core';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.app';
import {
  FirestoreUser,
  FirestoreProfessional,
  COLLECTIONS
} from './firestore.types';
import { mapFirebaseError } from './firebase-error.handler';
import { AuthStateService } from '../services/auth-state.service';

export interface ProfileUpdatePayload {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  companyName?: string;
}

export interface ProfessionalProfileUpdatePayload {
  bio?: string;
  title?: string;
  locationCity?: string;
  consultationFee?: number;
  languages?: string[];
  lawFirmName?: string;
  officeAddress?: string;
}

@Injectable({ providedIn: 'root' })
export class FirestoreUserService {
  private readonly db = inject(FIREBASE_FIRESTORE);
  private readonly authState = inject(AuthStateService);

  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _success = signal(false);

  public readonly isSaving = this._saving.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly success = this._success.asReadonly();

  /**
   * Get user document from Firestore.
   * Use for profile display and verification.
   */
  public async getUserProfile(uid: string): Promise<FirestoreUser | null> {
    try {
      const snap = await getDoc(doc(this.db, COLLECTIONS.USERS, uid));
      if (!snap.exists()) return null;
      return snap.data() as FirestoreUser;
    } catch (err) {
      console.error('[UserService] getUserProfile:', err);
      return null;
    }
  }

  /**
   * Get professional extended profile.
   */
  public async getProfessionalProfile(uid: string): Promise<FirestoreProfessional | null> {
    try {
      const snap = await getDoc(doc(this.db, COLLECTIONS.PROFESSIONALS, uid));
      if (!snap.exists()) return null;
      return snap.data() as FirestoreProfessional;
    } catch (err) {
      console.error('[UserService] getProfessionalProfile:', err);
      return null;
    }
  }

  /**
   * Update customer profile.
   * Only allowed fields — role and status are excluded from update payload.
   */
  public async updateCustomerProfile(uid: string, payload: ProfileUpdatePayload): Promise<boolean> {
    const currentUid = this.authState.currentUser()?.id;
    if (currentUid !== uid) {
      this._error.set('Anda hanya dapat mengubah profil sendiri.');
      return false;
    }

    this._saving.set(true);
    this._error.set(null);
    this._success.set(false);

    try {
      // Explicitly exclude role, status, email from update
      const safePayload: Partial<FirestoreUser> = {
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
        city: payload.city,
        companyName: payload.companyName,
        updatedAt: serverTimestamp() as Timestamp,
      };

      // Remove undefined fields
      Object.keys(safePayload).forEach(key => {
        if ((safePayload as any)[key] === undefined) {
          delete (safePayload as any)[key];
        }
      });

      await updateDoc(doc(this.db, COLLECTIONS.USERS, uid), safePayload);
      this._success.set(true);
      setTimeout(() => this._success.set(false), 3000);
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return false;
    } finally {
      this._saving.set(false);
    }
  }

  /**
   * Update professional editable profile fields.
   * Verification status and role cannot be updated by professional.
   */
  public async updateProfessionalProfile(
    uid: string,
    payload: ProfessionalProfileUpdatePayload
  ): Promise<boolean> {
    const currentUid = this.authState.currentUser()?.id;
    if (currentUid !== uid) {
      this._error.set('Anda hanya dapat mengubah profil sendiri.');
      return false;
    }

    this._saving.set(true);
    this._error.set(null);
    this._success.set(false);

    try {
      // Safe professional-editable fields only
      // isVerified, verificationStatus, rating, reviewCount — NOT included
      const safePayload: Partial<FirestoreProfessional> = {
        bio: payload.bio,
        title: payload.title,
        locationCity: payload.locationCity,
        consultationFee: payload.consultationFee,
        languages: payload.languages,
        lawFirmName: payload.lawFirmName,
        officeAddress: payload.officeAddress,
        updatedAt: serverTimestamp() as Timestamp,
      };

      Object.keys(safePayload).forEach(key => {
        if ((safePayload as any)[key] === undefined) {
          delete (safePayload as any)[key];
        }
      });

      await updateDoc(doc(this.db, COLLECTIONS.PROFESSIONALS, uid), safePayload);
      this._success.set(true);
      setTimeout(() => this._success.set(false), 3000);
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return false;
    } finally {
      this._saving.set(false);
    }
  }
}
