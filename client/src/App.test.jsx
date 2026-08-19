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
const item = {
  _id: 'item1',
  type: 'shirt',
  colourCategory: 'dark',
  closetId: 'closet1',
  wearStatus: 'dirty',
};

beforeEach(() => {
  closetService.getClosets.mockResolvedValue([closet]);
  itemService.getItems.mockResolvedValue([item]);
  itemService.updateItem.mockResolvedValue(item);
  itemService.deleteItem.mockResolvedValue(null);
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

  test('clicking an item card shows its detail screen with full info', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Clothes' }));
    const itemButton = await screen.findByRole('button', { name: /dark shirt/i });
    await user.click(itemButton);

    expect(await screen.findByRole('heading', { name: /dark shirt/i })).toBeInTheDocument();
    expect(screen.getByText('shirt')).toBeInTheDocument();
  });

  test('editing an item from its detail screen updates it in place', async () => {
    const user = userEvent.setup();
    const updatedItem = { ...item, brand: 'Acme' };
    itemService.updateItem.mockResolvedValue(updatedItem);
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Clothes' }));
    const itemButton = await screen.findByRole('button', { name: /dark shirt/i });
    await user.click(itemButton);
    await screen.findByRole('heading', { name: /dark shirt/i });

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const brandInput = screen.getByPlaceholderText('Brand (optional)');
    await user.clear(brandInput);
    await user.type(brandInput, 'Acme');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(itemService.updateItem).toHaveBeenCalledWith(
      'item1',
      expect.objectContaining({ brand: 'Acme' })
    );
    expect(await screen.findByText('Acme')).toBeInTheDocument();
  });

  test('deleting an item from its detail screen returns to the origin view', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Clothes' }));
    const itemButton = await screen.findByRole('button', { name: /dark shirt/i });
    await user.click(itemButton);
    await screen.findByRole('heading', { name: /dark shirt/i });

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(itemService.deleteItem).toHaveBeenCalledWith('item1');
    expect(await screen.findByRole('heading', { name: 'Clothes' })).toBeInTheDocument();
  });

  test('Laundry nav link shows the laundry screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Laundry' }));
    expect(await screen.findByRole('heading', { name: 'Laundry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Generate today's laundry loads" })).toBeInTheDocument();
  });

  test('Laundry screen always lists currently-dirty items, generated or not', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Laundry' }));

    expect(await screen.findByRole('heading', { name: 'Dirty clothes' })).toBeInTheDocument();
    expect(await screen.findByText('dark shirt')).toBeInTheDocument();
  });
});
