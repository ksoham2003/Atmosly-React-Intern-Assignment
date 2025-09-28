import { renderHook, waitFor } from '@testing-library/react';
import { useLaunches } from '@/hooks/useLaunches';
import { FavoritesProvider } from '@/context/FavoritesContext';

// Mock fetch
global.fetch = jest.fn();

describe('useLaunches', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('fetches launches and rockets data', async () => {
    const mockLaunches = [
      {
        id: '1',
        name: 'Test Mission',
        date_utc: '2024-01-01T00:00:00.000Z',
        rocket: 'rocket1',
        success: true,
        details: 'Test details',
        links: { patch: { small: null, large: null }, webcast: null, wikipedia: null }
      }
    ];

    const mockRockets = [
      { id: 'rocket1', name: 'Falcon 9' }
    ];

    (fetch as jest.Mock)
      .mockImplementationOnce(() => 
        Promise.resolve({
          json: () => Promise.resolve(mockLaunches),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockRockets),
        })
      );

    const { result } = renderHook(() => useLaunches(), {
      wrapper: FavoritesProvider
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.launches).toEqual(mockLaunches);
    expect(result.current.rockets).toEqual({ rocket1: 'Falcon 9' });
  });
});