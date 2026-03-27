import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRoutes } from '../utils/renderWithProviders';
import { createMockApiService, createMockAuthService, TEST_USER } from '../utils/createMockServices';

vi.mock('../../components/TurnstileWidget');

beforeEach(() => {
  window.alert = vi.fn();
  window.confirm = vi.fn(() => true);
});

describe('Flow 3: Login', () => {
  it('base: fill email + password + click Login → auth.signIn called → navigate to home page', async () => {
    const user = userEvent.setup();
    const auth = createMockAuthService({
      signIn: vi.fn().mockResolvedValue({ success: true, user: TEST_USER }),
      checkIsAdmin: vi.fn().mockResolvedValue(false),
    });
    const api = createMockApiService({
      getLandlords: vi.fn().mockResolvedValue([]),
    });

    const { default: LoginPage } = await import('../../pages/LoginPage');
    const { default: MainPage } = await import('../../pages/MainPage');

    renderWithRoutes(
      [
        { path: '/', element: <MainPage /> },
        { path: '/login', element: <LoginPage /> },
      ],
      { api, auth, initialRoute: '/login' }
    );

    // Wait for login page to appear
    await screen.findByRole('heading', { name: /login/i });

    await user.type(screen.getByLabelText(/email/i), 'test@pitt.edu');
    await user.type(screen.getByLabelText(/password/i), 'mypassword');

    await user.click(screen.getByRole('button', { name: /^login$/i }));

    // auth.signIn should be called with correct args
    await waitFor(() => {
      expect(auth.signIn).toHaveBeenCalledWith('test@pitt.edu', 'mypassword');
    });

    // Should navigate to home page
    await screen.findByText(/find your landlord/i);
  });

  it('edge: auth.signIn returns emailNotVerified → error shown + "Resend Verification Email" button visible', async () => {
    const user = userEvent.setup();
    const auth = createMockAuthService({
      signIn: vi.fn().mockResolvedValue({
        success: false,
        emailNotVerified: true,
        error: 'Your email is not verified',
      }),
    });
    const api = createMockApiService();

    const { default: LoginPage } = await import('../../pages/LoginPage');

    renderWithRoutes(
      [{ path: '/login', element: <LoginPage /> }],
      { api, auth, initialRoute: '/login' }
    );

    await screen.findByRole('heading', { name: /login/i });

    await user.type(screen.getByLabelText(/email/i), 'unverified@pitt.edu');
    await user.type(screen.getByLabelText(/password/i), 'mypassword');

    await user.click(screen.getByRole('button', { name: /^login$/i }));

    // Should show error message
    await screen.findByText(/your email is not verified/i);

    // Should show resend verification button
    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument();
  });
});
