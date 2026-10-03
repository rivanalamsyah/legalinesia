/**
 * Development environment configuration.
 * Firebase credentials for the DEVELOPMENT project.
 *
 * SECURITY: This file contains PUBLIC Firebase client config only.
 * Firebase client credentials (apiKey) are designed to be public —
 * security is enforced by Firebase Security Rules, NOT by keeping apiKey secret.
 *
 * DO NOT commit private keys, service account JSON, or admin SDK credentials.
 * Use Firebase Emulator for local development whenever possible.
 */
export const environment = {
  production: false,
  useEmulator: false, // set to true to use Firebase Emulator Suite locally

  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  }
};
