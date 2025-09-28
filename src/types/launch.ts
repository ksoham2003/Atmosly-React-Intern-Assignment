export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  date_local: string;
  rocket: string;
  success: boolean | null;
  details: string | null;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    webcast: string | null;
    wikipedia: string | null;
  };
}

export interface Rocket {
  id: string;
  name: string;
}

export interface FilterState {
  search: string;
  year: string;
  successOnly: boolean;
  showFavorites: boolean;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}