// client/src/hooks/useActiveCloset.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { ActiveClosetProvider } from '../context/ActiveClosetProvider';
import { useActiveCloset } from './useActiveCloset';

function Consumer() {
  const { activeCloset, setActiveCloset } = useActiveCloset();
  return (
    <div>
      <p>{activeCloset ? activeCloset.name : 'none'}</p>
      <button type="button" onClick={() => setActiveCloset({ _id: '1', name: 'Test Closet' })}>
        select
      </button>
    </div>
  );
}

describe('useActiveCloset', () => {
  test('defaults to no active closet', () => {
    render(
      <ActiveClosetProvider>
        <Consumer />
      </ActiveClosetProvider>
    );
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  test('updates when setActiveCloset is called', async () => {
    const user = userEvent.setup();
    render(
      <ActiveClosetProvider>
        <Consumer />
      </ActiveClosetProvider>
    );

    await user.click(screen.getByRole('button', { name: 'select' }));
    expect(screen.getByText('Test Closet')).toBeInTheDocument();
  });

  test('throws outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      'useActiveCloset must be used within an ActiveClosetProvider'
    );
    spy.mockRestore();
  });
});
