import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Tractor, Warehouse, Store, ShoppingCart, Package, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGlobalSearch, SearchResultType } from "@/hooks/useGlobalSearch";
import { cn } from "@/lib/utils";

const icons: Record<SearchResultType, any> = {
  farm: Tractor,
  warehouse: Warehouse,
  store: Store,
  "buy-order": ShoppingCart,
  "sell-order": Package,
};

/**
 * Global search modal with keyboard shortcut (Cmd+K / Ctrl+K)
 * Searches across all entities: Farms, Warehouses, Stores, Orders
 */
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { results, totalResults } = useGlobalSearch(query);

  // Register keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset query when closing
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  // Close modal when navigating
  const handleSelect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResultType, typeof results>);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-64"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 max-w-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="mr-3 h-5 w-5 shrink-0 opacity-50" />
            <Input
              placeholder="Search farms, warehouses, stores, orders..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="ml-2 hover:bg-accent rounded-sm p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {query.trim().length < 2 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </div>
            ) : totalResults === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-4">
                {/* Farms */}
                {groupedResults.farm && groupedResults.farm.length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Farms
                    </div>
                    <div className="space-y-1">
                      {groupedResults.farm.map((result) => {
                        const Icon = icons[result.type];
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-sm hover:bg-accent transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-green-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{result.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Warehouses */}
                {groupedResults.warehouse && groupedResults.warehouse.length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Warehouses
                    </div>
                    <div className="space-y-1">
                      {groupedResults.warehouse.map((result) => {
                        const Icon = icons[result.type];
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-sm hover:bg-accent transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-blue-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{result.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stores */}
                {groupedResults.store && groupedResults.store.length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Stores
                    </div>
                    <div className="space-y-1">
                      {groupedResults.store.map((result) => {
                        const Icon = icons[result.type];
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-sm hover:bg-accent transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-purple-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{result.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Buy Orders */}
                {groupedResults["buy-order"] && groupedResults["buy-order"].length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Buy Orders
                    </div>
                    <div className="space-y-1">
                      {groupedResults["buy-order"].map((result) => {
                        const Icon = icons[result.type];
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-sm hover:bg-accent transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-orange-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{result.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                            {result.metadata && (
                              <Badge
                                variant={
                                  result.metadata === "Contaminated"
                                    ? "destructive"
                                    : "default"
                                }
                                className="text-xs shrink-0"
                              >
                                {result.metadata}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sell Orders */}
                {groupedResults["sell-order"] && groupedResults["sell-order"].length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Sell Orders
                    </div>
                    <div className="space-y-1">
                      {groupedResults["sell-order"].map((result) => {
                        const Icon = icons[result.type];
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-sm hover:bg-accent transition-colors text-left"
                          >
                            <Icon className="h-4 w-4 text-green-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{result.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                            {result.metadata && (
                              <Badge
                                variant={
                                  result.metadata === "Contaminated"
                                    ? "destructive"
                                    : "default"
                                }
                                className="text-xs shrink-0"
                              >
                                {result.metadata}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
