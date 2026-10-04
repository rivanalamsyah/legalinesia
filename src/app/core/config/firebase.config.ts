import { InjectionToken, Provider } from '@angular/core';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
  isConfigured: boolean;
}

export const FIREBASE_CONFIG = new InjectionToken<FirebaseClientConfig>('FIREBASE_CONFIG');

/**
 * Provides Firebase configuration from environment or window config object safely.
 * Credentials are injected via runtime environment injection without hardcoding secrets in codebase.
 */
export function provideFirebaseConfig(config?: Partial<FirebaseClientConfig>): Provider {
  const defaultConfig: FirebaseClientConfig = {
    apiKey: (typeof window !== 'undefined' && (window as any).__ENV_FIREBASE_API_KEY__) || '',
    authDomain: (typeof window !== 'undefined' && (window as any).__ENV_FIREBASE_AUTH_DOMAIN__) || 'legalinesia-id.firebaseapp.com',
    projectId: (typeof window !== 'undefined' && (window as any).__ENV_FIREBASE_PROJECT_ID__) || 'legalinesia-id',
    storageBucket: (typeof window !== 'undefined' && (window as any).__ENV_FIREBASE_STORAGE_BUCKET__) || 'legalinesia-id.appspot.com',
    messagingSenderId: '',
    appId: '',
    isConfigured: Boolean(config?.apiKey || (typeof window !== 'undefined' && (window as any).__ENV_FIREBASE_API_KEY__))
  };

  return {
    provide: FIREBASE_CONFIG,
    useValue: { ...defaultConfig, ...config }
  };
}
