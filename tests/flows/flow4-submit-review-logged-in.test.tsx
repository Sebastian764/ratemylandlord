import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '../utils/renderWithProviders';
import {
  createMockApiService,
  createLoggedInAuth,
  TEST_LANDLORD,
  TEST_REVIEW,
  TEST_USER,
} from '../utils/createMockServices';

vi.mock('../../components/TurnstileWidget');

beforeEach(() => {
  window.alert = vi.fn();
  window.confirm = vi.fn(() => true);
});

describe('Flow 4: Submit Review (Logged In)', () => {
  it('base: logged-in user; complete captcha; fill comment; submit → api.addReview called; success alert shown', async () => {
    const user = userEvent.setup();
    const api = createMockApiService({
      getLandlordById: vi.fn().mockResolvedValue(TEST_LANDLORD),
      addReview: vi.fn().mockResolvedValue(TEST_REVIEW),
    });
    const auth = createLoggedInAuth(TEST_USER);

    const { default: AddReviewPage } = await import('../../pages/AddReviewPage');

    renderPage(<AddReviewPage />, {
      api,
      auth,
      initialRoute: '/landlord/1/add-review',
    });

    // Wait for landlord name to appear (page loaded)
    await screen.findByText('Test Landlord');

    // Complete captcha first
    await user.click(screen.getByTestId('captcha-complete'));

    // Fill in the comment
    const commentBox = screen.getByLabelText(/comment/i);
    await user.type(commentBox, 'This is a great landlord who fixed things quickly.');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit review/i }));

    await waitFor(() => {
      expect(api.addReview).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalledWith('Review submitted successfully!');
  });

  it('edge: do not fill comment; complete captcha; click Submit Review → alert("Please add a comment..."); api.addReview NOT called', async () => {
    const user = userEvent.setup();
    const api = createMockApiService({
      getLandlordById: vi.fn().mockResolvedValue(TEST_LANDLORD),
      addReview: vi.fn().mockResolvedValue(TEST_REVIEW),
    });
    const auth = createLoggedInAuth(TEST_USER);

    const { default: AddReviewPage } = await import('../../pages/AddReviewPage');

    renderPage(<AddReviewPage />, {
      api,
      auth,
      initialRoute: '/landlord/1/add-review',
    });

    // Wait for landlord name to appear
    await screen.findByText('Test Landlord');

    // Complete captcha but do NOT fill in comment
    await user.click(screen.getByTestId('captcha-complete'));

    // Click submit
    await user.click(screen.getByRole('button', { name: /submit review/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please add a comment to your review.');
    });

    expect(api.addReview).not.toHaveBeenCalled();
  });
});
