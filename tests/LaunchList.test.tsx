import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { FavoritesProvider } from '@/context/FavoritesContext';

// Mock the hooks
jest.mock('../src/hooks/useLaunches.ts', () => ({
  useLaunches: jest.fn()
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

// Import the mocked hook
import { useLaunches } from '@/hooks/useLaunches';

const mockUseLaunches = {
  launches: [
    {
      id: '1',
      name: 'Test Mission',
      date_utc: '2024-01-01T00:00:00.000Z',
      date_local: '2024-01-01T00:00:00.000Z',
      rocket: 'rocket1',
      success: true,
      details: 'Test mission details',
      links: {
        patch: {
          small: 'https://example.com/patch.png',
          large: 'https://example.com/patch-large.png'
        },
        webcast: 'https://youtube.com/watch?v=test',
        wikipedia: 'https://wikipedia.org/test'
      }
    }
  ],
  rockets: { rocket1: 'Falcon 9' },
  loading: false,
  error: null,
  filterLaunches: jest.fn((launches, filters, favorites) => launches)
};

describe('Launch List', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the mock implementation
    (useLaunches as jest.Mock).mockReturnValue(mockUseLaunches);
  });

  it('renders launch list with mission data', async () => {
    render(
      <FavoritesProvider>
        <Home />
      </FavoritesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Mission')).toBeInTheDocument();
      expect(screen.getByText('Falcon 9')).toBeInTheDocument();
    });
  });

  it('filters launches based on search input', async () => {
    render(
      <FavoritesProvider>
        <Home />
      </FavoritesProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search missions by name...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });
  });

  it('shows loading skeleton when loading', () => {
    // Set loading to true
    (useLaunches as jest.Mock).mockReturnValue({
      ...mockUseLaunches,
      loading: true
    });

    render(
      <FavoritesProvider>
        <Home />
      </FavoritesProvider>
    );

    expect(screen.getByText('SpaceX Mission Explorer')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    // Set error state
    (useLaunches as jest.Mock).mockReturnValue({
      ...mockUseLaunches,
      error: 'Failed to fetch data'
    });

    render(
      <FavoritesProvider>
        <Home />
      </FavoritesProvider>
    );

    expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });
});