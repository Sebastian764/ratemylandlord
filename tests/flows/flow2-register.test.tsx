import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '../utils/renderWithProviders';
import { createMockApiService, createMockAuthService } from '../utils/createMockServices';

vi.mock('../../components/TurnstileWidget');

beforeEach(() => {
  window.alert = vi.fn();
  window.confirm = vi.fn(() => true);
});

describe('Flow 2: Register', () => {
  it('base: fill email + matching passwords + complete captcha + click Sign Up → auth.signUp called → success screen shows email', async () => {
    const user = userEvent.setup();
    const auth = createMockAuthService({
      signUp: vi.fn().mockResolvedValue({ success: true }),
    });
    const api = createMockApiService();

    const { default: RegisterPage } = await import('../../pages/RegisterPage');
    renderPage(<RegisterPage />, { api, auth });

    // Fill the form
    await user.type(screen.getByLabelText(/email address/i), 'newuser@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');

    // Complete captcha
    await user.click(screen.getByTestId('captcha-complete'));

    // Click Sign Up
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    // Should show success screen
    await screen.findByText(/verify your email/i);
    expect(screen.getByText(/newuser@example\.com/)).toBeInTheDocument();
    expect(auth.signUp).toHaveBeenCalledWith('newuser@example.com', 'password123', expect.any(Object));
  });

  it('edge: mismatched passwords → "Passwords do not match." error; auth.signUp NOT called', async () => {
    const user = userEvent.setup();
    const auth = createMockAuthService({
      signUp: vi.fn().mockResolvedValue({ success: true }),
    });
    const api = createMockApiService();

    const { default: RegisterPage } = await import('../../pages/RegisterPage');
    renderPage(<RegisterPage />, { api, auth });

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword');

    // Complete captcha
    await user.click(screen.getByTestId('captcha-complete'));

    // Click Sign Up
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    // Should show error
    await screen.findByText(/passwords do not match/i);
    expect(auth.signUp).not.toHaveBeenCalled();
  });
});
