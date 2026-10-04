/**
 * Production environment configuration.
 * Real Firebase project credentials for legalinesia1.
 */

const getEnvVar = (key: string): string => {
  const g = globalThis as any;
  if (g.process && g.process.env && g.process.env[key]) {
    return g.process.env[key];
  }
  if (g.__ENV__ && g.__ENV__[key]) {
    return g.__ENV__[key];
  }
  return '';
};

export const environment = {
  production: true,
  useEmulator: false,

  firebase: {
    apiKey: getEnvVar('FIREBASE_API_KEY') || 'AIzaSyD0toD_KPq3ttqAaHWiL_aleuUn0rK1iWw',
    authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || 'legalinesia1.firebaseapp.com',
    projectId: getEnvVar('FIREBASE_PROJECT_ID') || 'legalinesia1',
    storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || 'legalinesia1.firebasestorage.app',
    messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || '818889920291',
    appId: getEnvVar('FIREBASE_APP_ID') || '1:818889920291:web:70da123c465ab563724696',
    measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID') || 'G-ZWXZHT22MD'
  }
};
