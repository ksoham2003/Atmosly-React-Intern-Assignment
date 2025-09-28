import { render, screen, fireEvent } from '@testing-library/react';
import LaunchModal from '@/components/LaunchModal';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ThemeProvider } from '@/context/ThemeContext';

const mockLaunch = {
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
};

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <FavoritesProvider>
      {children}
    </FavoritesProvider>
  </ThemeProvider>
);

describe('LaunchModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders launch details when open', () => {
    render(
      <TestWrapper>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Test Mission')).toBeInTheDocument();
    expect(screen.getByText('Falcon 9')).toBeInTheDocument();
    expect(screen.getByText('Test mission details')).toBeInTheDocument();
    expect(screen.getByText('Successful')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <TestWrapper>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(
      <TestWrapper>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={false}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    expect(screen.queryByText('Test Mission')).not.toBeInTheDocument();
  });

  it('renders favorite button', () => {
    render(
      <TestWrapper>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
  });
});