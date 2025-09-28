import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock the hooks
jest.mock('@/hooks/useLaunches', () => ({
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

const createMockUseLaunches = (overrides = {}) => ({
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
  filterLaunches: jest.fn((launches) => launches), // Simple mock that returns all launches
  ...overrides
});

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <FavoritesProvider>
      {children}
    </FavoritesProvider>
  </ThemeProvider>
);

describe('Launch List', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders launch list with mission data', async () => {
    const mockUseLaunchesData = createMockUseLaunches();
    (useLaunches as jest.Mock).mockReturnValue(mockUseLaunchesData);

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for any async operations
    await waitFor(() => {
      // Check if the mission name appears
      expect(screen.getByText('Test Mission')).toBeInTheDocument();
    });

    // Check if rocket name appears (might be in a different element)
    const rocketElements = screen.getAllByText(/Falcon 9|rocket/i);
    expect(rocketElements.length).toBeGreaterThan(0);
  });

  it('filters launches based on search input', async () => {
    const mockUseLaunchesData = createMockUseLaunches();
    (useLaunches as jest.Mock).mockReturnValue(mockUseLaunchesData);

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search missions by name...');
    
    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Verify the input has the value
    await waitFor(() => {
      expect(searchInput).toHaveValue('Test');
    });

    // The mission should still be visible since it matches "Test"
    expect(screen.getByText('Test Mission')).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    const mockUseLaunchesData = createMockUseLaunches({ loading: true });
    (useLaunches as jest.Mock).mockReturnValue(mockUseLaunchesData);

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Should show loading skeleton
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('shows error state correctly', () => {
    const mockUseLaunchesData = createMockUseLaunches({ 
      error: 'Failed to fetch data' 
    });
    (useLaunches as jest.Mock).mockReturnValue(mockUseLaunchesData);

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });
});