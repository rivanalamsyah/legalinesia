/**
 * Production environment configuration.
 * Firebase credentials are injected at build/deploy time via CI/CD environment variables
 * or window runtime config.
 *
 * For Firebase Hosting deployment, client credentials are non-sensitive public values.
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
    apiKey: getEnvVar('FIREBASE_API_KEY') || 'FIREBASE_PROD_API_KEY',
    authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || 'legalinesia.firebaseapp.com',
    projectId: getEnvVar('FIREBASE_PROJECT_ID') || 'legalinesia',
    storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || 'legalinesia.appspot.com',
    messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || '123456789',
    appId: getEnvVar('FIREBASE_APP_ID') || '1:123456789:web:prod',
  }
};
