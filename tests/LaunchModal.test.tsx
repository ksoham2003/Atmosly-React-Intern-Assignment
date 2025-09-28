import { render, screen, fireEvent } from '@testing-library/react';
import LaunchModal from '@/components/LaunchModal';
import { FavoritesProvider } from '@/context/FavoritesContext';

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

describe('LaunchModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders launch details when open', () => {
    render(
      <FavoritesProvider>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(screen.getByText('Test Mission')).toBeInTheDocument();
    expect(screen.getByText('Falcon 9')).toBeInTheDocument();
    expect(screen.getByText('Test mission details')).toBeInTheDocument();
    expect(screen.getByText('Successful')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <FavoritesProvider>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(
      <FavoritesProvider>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={false}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(screen.queryByText('Test Mission')).not.toBeInTheDocument();
  });

  it('renders favorite button', () => {
    render(
      <FavoritesProvider>
        <LaunchModal
          launch={mockLaunch}
          rocketName="Falcon 9"
          isOpen={true}
          onClose={mockOnClose}
        />
      </FavoritesProvider>
    );

    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
  });
});