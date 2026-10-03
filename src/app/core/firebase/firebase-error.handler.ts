/**
 * Firestore Error Handler
 *
 * Maps Firebase/Firestore error codes to user-friendly messages.
 * Separates internal debug info from user-facing display messages.
 */

export interface FirestoreError {
  code: string;
  userMessage: string;
  isPermissionError: boolean;
  isNetworkError: boolean;
}

/**
 * Map Firebase error codes to structured error objects.
 */
export function mapFirebaseError(err: unknown): FirestoreError {
  const error = err as { code?: string; message?: string };
  const code = error?.code || 'unknown';

  switch (code) {
    case 'permission-denied':
    case 'PERMISSION_DENIED':
      return {
        code,
        userMessage: 'Anda tidak memiliki izin untuk mengakses data ini.',
        isPermissionError: true,
        isNetworkError: false
      };

    case 'unauthenticated':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        code,
        userMessage: 'Email atau kata sandi tidak valid. Silakan coba lagi.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'auth/email-already-in-use':
      return {
        code,
        userMessage: 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun yang ada.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'auth/weak-password':
      return {
        code,
        userMessage: 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'auth/too-many-requests':
      return {
        code,
        userMessage: 'Terlalu banyak percobaan masuk. Akun sementara dikunci. Coba beberapa menit lagi.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'auth/network-request-failed':
    case 'unavailable':
    case 'deadline-exceeded':
      return {
        code,
        userMessage: 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.',
        isPermissionError: false,
        isNetworkError: true
      };

    case 'not-found':
      return {
        code,
        userMessage: 'Data tidak ditemukan.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'already-exists':
      return {
        code,
        userMessage: 'Data sudah ada dan tidak dapat dibuat ulang.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'resource-exhausted':
      return {
        code,
        userMessage: 'Terlalu banyak permintaan. Coba beberapa saat lagi.',
        isPermissionError: false,
        isNetworkError: true
      };

    case 'aborted':
      return {
        code,
        userMessage: 'Operasi gagal karena konflik data. Silakan coba lagi.',
        isPermissionError: false,
        isNetworkError: false
      };

    case 'auth/operation-not-allowed':
      return {
        code,
        userMessage: 'Metode login ini tidak diaktifkan untuk platform ini.',
        isPermissionError: true,
        isNetworkError: false
      };

    default:
      console.error('[FirebaseError]', code, error?.message);
      return {
        code,
        userMessage: 'Terjadi kesalahan sistem. Silakan coba lagi atau hubungi dukungan.',
        isPermissionError: false,
        isNetworkError: false
      };
  }
}
