// client/src/hooks/useActiveItem.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { ActiveItemProvider } from '../context/ActiveItemProvider';
import { useActiveItem } from './useActiveItem';

function Consumer() {
  const { activeItem, setActiveItem } = useActiveItem();
  return (
    <div>
      <p>{activeItem ? activeItem.nickname : 'none'}</p>
      <button type="button" onClick={() => setActiveItem({ _id: '1', nickname: 'Test Item' })}>
        select
      </button>
    </div>
  );
}

describe('useActiveItem', () => {
  test('defaults to no active item', () => {
    render(
      <ActiveItemProvider>
        <Consumer />
      </ActiveItemProvider>
    );
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  test('updates when setActiveItem is called', async () => {
    const user = userEvent.setup();
    render(
      <ActiveItemProvider>
        <Consumer />
      </ActiveItemProvider>
    );

    await user.click(screen.getByRole('button', { name: 'select' }));
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  test('throws outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      'useActiveItem must be used within an ActiveItemProvider'
    );
    spy.mockRestore();
  });
});
