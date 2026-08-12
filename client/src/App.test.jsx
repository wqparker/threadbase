// client/src/App.test.jsx
// Integration test for the nav shell: mocks the service layer so it runs
// against fake data instead of a real backend.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as closetService from './services/closetService';
import * as itemService from './services/itemService';

vi.mock('./services/closetService');
vi.mock('./services/itemService');

const closet = { _id: 'closet1', name: 'Winter Closet', description: '' };

beforeEach(() => {
  closetService.getClosets.mockResolvedValue([closet]);
  itemService.getItems.mockResolvedValue([]);
});

describe('App navigation', () => {
  test('starts on the Closets view', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Closets' })).toBeInTheDocument();
  });

  test('selecting a closet navigates to Clothes and shows that closet', async () => {
    const user = userEvent.setup();
    render(<App />);

    const closetButton = await screen.findByRole('button', { name: /Winter Closet/ });
    await user.click(closetButton);

    expect(await screen.findByRole('heading', { name: 'Winter Closet' })).toBeInTheDocument();
  });

  test('Clothes view without an active closet prompts to pick one', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Clothes' }));
    expect(screen.getByText(/Select a closet/)).toBeInTheDocument();
  });

  test('Laundry nav link shows the placeholder screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Laundry' }));
    expect(screen.getByText('Coming soon.')).toBeInTheDocument();
  });
});
