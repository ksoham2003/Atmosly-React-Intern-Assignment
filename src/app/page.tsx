"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLaunches } from "@/hooks/useLaunches";
import { useFavorites } from "@/context/FavoritesContext";
import { FilterState, Launch, PaginationState } from "@/types/launch";
import SearchInput from "@/components/SearchInput";
import LaunchFilters from "@/components/LaunchFilters";
import LaunchCard from "@/components/LaunchCard";
import LaunchModal from "@/components/LaunchModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Pagination from "@/components/Pagination";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Rocket } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];

export default function Home() {
  const { launches, rockets, loading, error, filterLaunches } = useLaunches();
  const { favorites } = useFavorites();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    year: "all",
    successOnly: false,
    showFavorites: false,
  });

  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0,
  });

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
  }, []);

  const handleLaunchClick = useCallback((launch: Launch) => {
    setSelectedLaunch(launch);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLaunch(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    const itemsPerPage = parseInt(value);
    setPagination((prev) => ({
      ...prev,
      itemsPerPage,
      currentPage: 1, // Reset to first page when changing items per page
    }));
  }, []);

  // Extract available years
  useEffect(() => {
    const years = [
      ...new Set(launches.map((launch) => launch.date_utc.substring(0, 4))),
    ]
      .sort()
      .reverse();
    setAvailableYears(years);
  }, [launches]);

  // Memoize filtered launches
  const filteredLaunches = useMemo(() => {
    return filterLaunches(launches, filters, favorites);
  }, [launches, filters, favorites, filterLaunches]);

  // Calculate pagination data
  const paginatedLaunches = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredLaunches.slice(startIndex, endIndex);
  }, [filteredLaunches, pagination.currentPage, pagination.itemsPerPage]);

  // Update pagination totals when filtered launches change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalItems: filteredLaunches.length,
      totalPages: Math.ceil(filteredLaunches.length / prev.itemsPerPage),
    }));
  }, [filteredLaunches.length, pagination.itemsPerPage]);

  // Reset to page 1 when filters change significantly
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [
    filters.search,
    filters.year,
    filters.successOnly,
    filters.showFavorites,
  ]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Error Loading Data
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-card-foreground max-sm:text-xl">
                SpaceX Mission Explorer
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button asChild variant="outline" className="max-sm:text-xs">
                <Link href="/favorites">
                  View Favorites ({favorites.length})
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search missions by name..."
          />
        </div>

        <LaunchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableYears={availableYears}
        />

        {/* Results Count and Items Per Page Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedLaunches.length} of {filteredLaunches.length}{" "}
            missions
            {pagination.totalPages > 1 &&
              ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Label
              htmlFor="items-per-page"
              className="text-sm whitespace-nowrap"
            >
              Items per page:
            </Label>
            <Select
              value={pagination.itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger id="items-per-page" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div data-testid="loading-skeleton">
            <LoadingSkeleton /> {/* or however you render it */}
          </div>
        ) : filteredLaunches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Rocket className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No missions found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedLaunches.map((launch) => (
                <LaunchCard
                  key={launch.id}
                  launch={launch}
                  rocketName={rockets[launch.rocket] || "Unknown Rocket"}
                  onLaunchClick={handleLaunchClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        <LaunchModal
          launch={selectedLaunch}
          rocketName={
            selectedLaunch
              ? rockets[selectedLaunch.rocket] || "Unknown Rocket"
              : ""
          }
          isOpen={!!selectedLaunch}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
}
