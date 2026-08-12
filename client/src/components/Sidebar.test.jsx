// client/src/components/Sidebar.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  test('renders a nav button for each view', () => {
    render(<Sidebar currentView="closets" onNavigate={() => {}} />);
    expect(screen.getByRole('button', { name: 'Closets' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clothes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Laundry' })).toBeInTheDocument();
  });

  test('marks the current view active via aria-current', () => {
    render(<Sidebar currentView="clothes" onNavigate={() => {}} />);
    expect(screen.getByRole('button', { name: 'Clothes' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Closets' })).not.toHaveAttribute('aria-current');
  });

  test('calls onNavigate with the clicked view id', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Sidebar currentView="closets" onNavigate={onNavigate} />);

    await user.click(screen.getByRole('button', { name: 'Laundry' }));
    expect(onNavigate).toHaveBeenCalledWith('laundry');
  });
});
