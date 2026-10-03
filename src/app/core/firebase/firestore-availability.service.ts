/**
 * Firestore Availability Service
 *
 * Manages professional availability slots.
 *
 * Data model: /availability/{slotId}
 * Each document represents a recurring weekly availability window.
 *
 * Rules:
 * - Professional can only manage their own availability (professionalId == auth.uid)
 * - Read is public for published/active professionals
 */

import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.app';
import { FirestoreAvailabilitySlot, COLLECTIONS } from './firestore.types';
import { AuthStateService } from '../services/auth-state.service';
import { mapFirebaseError } from './firebase-error.handler';

export interface AvailabilitySlotItem {
  id: string;
  professionalId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string; // "09:00"
  endTime: string;   // "12:00"
  isAvailable: boolean;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private readonly db = inject(FIREBASE_FIRESTORE);
  private readonly authState = inject(AuthStateService);

  private readonly _slots = signal<AvailabilitySlotItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);

  public readonly slots = this._slots.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly saving = this._saving.asReadonly();
  public readonly error = this._error.asReadonly();

  /**
   * Load availability slots for the currently logged in professional.
   */
  public async loadMyAvailability(): Promise<void> {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._slots.set([]);
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      const q = query(
        collection(this.db, COLLECTIONS.AVAILABILITY),
        where('professionalId', '==', uid)
      );

      const snapshot = await getDocs(q);
      const items: AvailabilitySlotItem[] = snapshot.docs.map(d => {
        const data = d.data() as FirestoreAvailabilitySlot;
        return {
          id: d.id,
          professionalId: data.professionalId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          isAvailable: data.isAvailable,
          note: data.note,
        };
      });

      this._slots.set(items);
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Add a new availability slot for the logged-in professional.
   * Enforces professional ownership (professionalId forced to auth.uid).
   */
  public async createSlot(
    dayOfWeek: AvailabilitySlotItem['dayOfWeek'],
    startTime: string,
    endTime: string,
    note?: string
  ): Promise<boolean> {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._error.set('Anda harus login sebagai Legal Professional.');
      return false;
    }

    // Client-side overlap validation check
    const isOverlapping = this._slots().some(slot =>
      slot.dayOfWeek === dayOfWeek &&
      ((startTime >= slot.startTime && startTime < slot.endTime) ||
       (endTime > slot.startTime && endTime <= slot.endTime))
    );

    if (isOverlapping) {
      this._error.set('Slot waktu ini bertabrakan dengan availability yang sudah ada.');
      return false;
    }

    this._saving.set(true);
    this._error.set(null);

    try {
      const ref = await addDoc(collection(this.db, COLLECTIONS.AVAILABILITY), {
        professionalId: uid,       // Always from auth — not from form
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: true,
        note: note || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Optimistic update
      this._slots.update(slots => [...slots, {
        id: ref.id,
        professionalId: uid,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: true,
        note,
      }]);

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
   * Toggle slot availability status.
   */
  public async toggleSlotStatus(slotId: string, isAvailable: boolean): Promise<boolean> {
    this._saving.set(true);
    try {
      await updateDoc(doc(this.db, COLLECTIONS.AVAILABILITY, slotId), {
        isAvailable,
        updatedAt: serverTimestamp(),
      });

      this._slots.update(slots =>
        slots.map(s => s.id === slotId ? { ...s, isAvailable } : s)
      );

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
   * Delete an availability slot.
   */
  public async deleteSlot(slotId: string): Promise<boolean> {
    this._saving.set(true);
    try {
      await deleteDoc(doc(this.db, COLLECTIONS.AVAILABILITY, slotId));
      this._slots.update(slots => slots.filter(s => s.id !== slotId));
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
