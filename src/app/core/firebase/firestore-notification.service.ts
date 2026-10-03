/**
 * Firestore Notification Service
 *
 * Manages in-app notifications for users.
 * Uses real-time listener for instant read/unread state updates.
 *
 * Security:
 * - Users only receive their own notifications (userId == auth.uid in Rules)
 * - Only Admin can CREATE notifications (triggered programmatically)
 * - Users can UPDATE isRead field on their own notifications
 * - Notifications cannot be sent by one user to another via client
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.app';
import { FirestoreNotification, COLLECTIONS } from './firestore.types';
import { CustomerNotificationItem } from '../services/customer-notification.service';
import { mapFirebaseError } from './firebase-error.handler';

@Injectable({ providedIn: 'root' })
export class FirestoreNotificationService {
  private readonly db = inject(FIREBASE_FIRESTORE);

  private readonly _notifications = signal<CustomerNotificationItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private _unsubscribe?: Unsubscribe;

  public readonly notifications = this._notifications.asReadonly();
  public readonly isLoading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  public readonly unreadCount = computed(() =>
    this._notifications().filter(n => !n.isRead).length
  );

  /**
   * Subscribe to real-time notifications for a user.
   * Real-time is appropriate here — notifications should appear instantly.
   */
  public subscribeToUserNotifications(userId: string): void {
    this._unsubscribe?.();
    this._loading.set(true);

    const q = query(
      collection(this.db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    this._unsubscribe = onSnapshot(q, {
      next: (snap) => {
        const items = snap.docs.map(d => this.mapNotification(d.id, d.data() as FirestoreNotification));
        this._notifications.set(items);
        this._loading.set(false);
      },
      error: (err) => {
        const mapped = mapFirebaseError(err);
        this._error.set(mapped.userMessage);
        this._loading.set(false);
      }
    });
  }

  /**
   * Mark a single notification as read.
   * Firestore Rules: userId must match auth.uid.
   */
  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(this.db, COLLECTIONS.NOTIFICATIONS, notificationId), {
        isRead: true,
      });
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
    }
  }

  /**
   * Mark all unread notifications as read via batch write.
   */
  public async markAllAsRead(): Promise<void> {
    const unread = this._notifications().filter(n => !n.isRead);
    if (unread.length === 0) return;

    try {
      const batch = writeBatch(this.db);
      unread.forEach(n => {
        batch.update(doc(this.db, COLLECTIONS.NOTIFICATIONS, n.id), { isRead: true });
      });
      await batch.commit();
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
    }
  }

  /**
   * Cleanup listener on destroy.
   */
  public cleanup(): void {
    this._unsubscribe?.();
  }

  private mapNotification(id: string, data: FirestoreNotification): CustomerNotificationItem {
    return {
      id,
      customerId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type as CustomerNotificationItem['type'],
      isRead: data.isRead,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
      linkUrl: data.relatedRoute,
    };
  }
}
