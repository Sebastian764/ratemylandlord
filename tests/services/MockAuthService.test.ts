import { describe, it, expect } from 'vitest';
import { MockAuthService, DEMO_CREDENTIALS } from '../../services/MockAuthService';

describe('MockAuthService demo login', () => {
  it('signs in with the hard-coded demo credentials', async () => {
    const auth = new MockAuthService();
    const result = await auth.signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    expect(result.success).toBe(true);
    expect(result.user?.email).toBe(DEMO_CREDENTIALS.email);
  });

  it('is case-insensitive on the email', async () => {
    const auth = new MockAuthService();
    const result = await auth.signIn(DEMO_CREDENTIALS.email.toUpperCase(), DEMO_CREDENTIALS.password);

    expect(result.success).toBe(true);
  });

  it('rejects any other credentials', async () => {
    const auth = new MockAuthService();
    const result = await auth.signIn('someone@example.com', 'wrong-password');

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
