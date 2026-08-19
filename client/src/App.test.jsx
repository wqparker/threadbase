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
const item = { _id: 'item1', type: 'shirt', colourCategory: 'dark', closetId: 'closet1' };

beforeEach(() => {
  closetService.getClosets.mockResolvedValue([closet]);
  itemService.getItems.mockResolvedValue([item]);
});

describe('App navigation', () => {
  test('starts on the Closets view', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Closets' })).toBeInTheDocument();
  });

  test('selecting a closet shows its own detail view, not the global Clothes view', async () => {
    const user = userEvent.setup();
    render(<App />);

    const closetButton = await screen.findByRole('button', { name: /Winter Closet/ });
    await user.click(closetButton);

    expect(await screen.findByRole('heading', { name: 'Winter Closet' })).toBeInTheDocument();
    expect(itemService.getItems).toHaveBeenCalledWith('closet1');
  });

  test('Clothes view lists all items with no closet filter, regardless of active closet', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Clothes' }));

    expect(await screen.findByRole('heading', { name: 'Clothes' })).toBeInTheDocument();
    expect(itemService.getItems).toHaveBeenCalledWith(undefined);
  });

  test('Laundry nav link shows the laundry screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Laundry' }));
    expect(await screen.findByRole('heading', { name: 'Laundry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Generate today's laundry loads" })).toBeInTheDocument();
  });
});
