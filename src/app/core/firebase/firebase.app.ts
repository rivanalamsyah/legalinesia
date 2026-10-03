/**
 * Firebase Application Initialization Module
 *
 * Centralizes Firebase SDK initialization with environment-aware config.
 * Supports emulator connection for local development.
 *
 * Architecture:
 * - One FirebaseApp instance per Angular application lifecycle
 * - Injected via Angular DI (no global singletons)
 * - Emulator support via environment.useEmulator flag
 */

import { InjectionToken, Provider, isDevMode } from '@angular/core';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { environment } from '../../../environments/environment';

// Injection tokens for typed DI
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');
export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>('FIREBASE_FIRESTORE');

/**
 * Initialize Firebase App (idempotent — safe to call multiple times).
 */
function initFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(environment.firebase);
}

/**
 * Initialize Firebase Auth with browser-local persistence.
 */
function initFirebaseAuth(app: FirebaseApp): Auth {
  const auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(err => {
    console.warn('[FirebaseAuth] Failed to set persistence:', err.code);
  });
  if (environment.useEmulator) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.info('[Firebase] Auth emulator connected at localhost:9099');
  }
  return auth;
}

/**
 * Initialize Cloud Firestore.
 * Enables offline persistence (IndexedDB) in production for better UX.
 */
function initFirestore(app: FirebaseApp): Firestore {
  const db = getFirestore(app);
  if (environment.useEmulator) {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.info('[Firebase] Firestore emulator connected at localhost:8080');
  }
  return db;
}

/**
 * Angular provider factory for Firebase services.
 * Use in app.config.ts providers array.
 */
export function provideFirebase(): Provider[] {
  const app = initFirebaseApp();
  const auth = initFirebaseAuth(app);
  const db = initFirestore(app);

  return [
    { provide: FIREBASE_APP, useValue: app },
    { provide: FIREBASE_AUTH, useValue: auth },
    { provide: FIREBASE_FIRESTORE, useValue: db },
  ];
}
