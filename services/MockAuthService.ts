import type { IAuthService } from './interfaces';

/**
 * Hard-coded demo account. This ONLY works in demo/mock mode, because
 * MockAuthService is only ever instantiated when running without Supabase
 * credentials (see App.tsx). It is surfaced on the login screen so anyone
 * trying the demo can sign in. Never used against a real backend.
 */
export const DEMO_CREDENTIALS = {
  email: 'demo@demo.com',
  password: 'demo1234',
};

const DEMO_USER = { id: 'demo-user', email: DEMO_CREDENTIALS.email };

export class MockAuthService implements IAuthService {
  async getSession() {
    return null;
  }

  onAuthStateChange(_callback: (user: { id: string; email: string } | null) => void) {
    return { unsubscribe: () => {} };
  }

  async signIn(email: string, password: string) {
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      return { success: true, user: DEMO_USER };
    }
    return {
      success: false,
      error: `Demo mode: sign in with ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}.`,
    };
  }

  async signUp(_email: string, _password: string, _options: { redirectTo: string }) {
    return { success: false, error: 'Registration is not available in demo mode.' };
  }

  async signOut() {}

  async resetPassword(_email: string, _options: { redirectTo: string }) {
    return { success: false, error: 'Password reset is not available in demo mode.' };
  }

  async updatePassword(_password: string) {
    return { success: false, error: 'Password update is not available in demo mode.' };
  }

  async verifyOtp(_params: {
    tokenHash: string;
    type: 'recovery' | 'signup' | 'invite' | 'email' | 'email_change';
  }) {
    return { error: 'Email verification is not available in demo mode.' };
  }

  async checkIsAdmin(_email: string) {
    return false;
  }
}
