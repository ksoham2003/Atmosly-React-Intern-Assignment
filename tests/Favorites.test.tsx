import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import FavoriteButton from '@/components/FavoriteButton';

// Mock next/link
jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

// Test component that uses favorites
function TestComponent() {
  const { favorites } = useFavorites();
  return (
    <div>
      <FavoriteButton launchId="test-1" />
      <div data-testid="favorites-count">{favorites.length}</div>
    </div>
  );
}

describe('Favorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds and removes favorites', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    
    // Add to favorites
    fireEvent.click(favoriteButton);
    expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument();
    
    // Check favorites count
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    
    // Remove from favorites
    fireEvent.click(screen.getByRole('button', { name: /remove from favorites/i }));
    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('persists favorites in localStorage', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favoriteButton);

    // Check if favorites are stored in localStorage
    const storedFavorites = localStorage.getItem('spacex-favorites');
    expect(storedFavorites).toBe(JSON.stringify(['test-1']));
  });
});