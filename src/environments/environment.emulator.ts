/**
 * Emulator environment configuration.
 * Used when running Firebase Emulator Suite locally.
 * Copy from environment.ts and set useEmulator: true.
 */
export const environment = {
  production: false,
  useEmulator: true,

  firebase: {
    apiKey: 'demo-legalinesia-local',
    authDomain: 'localhost',
    projectId: 'legalinesia-dev',
    storageBucket: 'legalinesia-dev.firebasestorage.app',
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:emulator-demo',
  }
};
