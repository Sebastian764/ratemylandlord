import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '../utils/renderWithProviders';
import { createMockApiService, createMockAuthService } from '../utils/createMockServices';

vi.mock('../../components/TurnstileWidget');

beforeEach(() => {
  window.alert = vi.fn();
  window.confirm = vi.fn(() => true);
  // Clear session storage to avoid caching between tests
  sessionStorage.clear();
});

afterEach(() => {
  // Restore original location after each test
  Object.defineProperty(window, 'location', {
    value: { ...window.location, search: '' },
    configurable: true,
    writable: true,
  });
});

describe('Flow 11: Reset Password', () => {
  it('base: valid token_hash and type=recovery; verifyOtp returns no error; form appears; fill passwords; click Update Password → auth.updatePassword called', async () => {
    const user = userEvent.setup();

    // Set window.location.search to simulate the reset link
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '?token_hash=valid-token&type=recovery' },
      configurable: true,
      writable: true,
    });

    const auth = createMockAuthService({
      verifyOtp: vi.fn().mockResolvedValue({ error: undefined }),
      updatePassword: vi.fn().mockResolvedValue({ success: true }),
    });
    const api = createMockApiService();

    const { default: ResetPasswordPage } = await import('../../pages/ResetPasswordPage');
    renderPage(<ResetPasswordPage />, { api, auth });

    // Wait for the form to appear (after OTP verification succeeds)
    await screen.findByRole('heading', { name: /set new password/i });

    // Fill new password
    await user.type(screen.getByLabelText(/^new password$/i), 'newsecurepassword');
    await user.type(screen.getByLabelText(/confirm new password/i), 'newsecurepassword');

    // Click Update Password
    await user.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(auth.updatePassword).toHaveBeenCalledWith('newsecurepassword');
    });
  });

  it('edge: auth.verifyOtp returns expired error → "The password reset link has expired" error shown; form NOT visible', async () => {
    // Set window.location.search to simulate the reset link
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '?token_hash=expired-token&type=recovery' },
      configurable: true,
      writable: true,
    });

    const auth = createMockAuthService({
      verifyOtp: vi.fn().mockResolvedValue({ error: 'The link has expired' }),
    });
    const api = createMockApiService();

    const { default: ResetPasswordPage } = await import('../../pages/ResetPasswordPage');
    renderPage(<ResetPasswordPage />, { api, auth });

    // Should show error about expired link
    await screen.findByText(/the password reset link has expired/i);

    // Form should NOT be visible
    expect(screen.queryByRole('heading', { name: /set new password/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^new password$/i)).not.toBeInTheDocument();
  });
});
