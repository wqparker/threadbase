// client/src/hooks/useTheme.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('defaults to the system preference (light, per the test matchMedia stub)', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.effectiveTheme).toBe('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  test('toggleTheme overrides to dark and sets data-theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(result.current.effectiveTheme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('threadbase-theme')).toBe('dark');
  });

  test('toggling twice lands back on an explicit light override, not "system"', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());
    act(() => result.current.toggleTheme());

    // Once toggled, the choice stays an explicit override - there's no
    // "reset to system" step, so this is 'light' the override, not the
    // absence of one.
    expect(result.current.effectiveTheme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('threadbase-theme')).toBe('light');
  });
});
