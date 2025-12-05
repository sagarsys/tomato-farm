import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Tractor, Warehouse, Store, ShoppingCart, Package } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useGlobalSearch, SearchResultType } from "@/hooks/useGlobalSearch";

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
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close modal when navigating
  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
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
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search farms, warehouses, stores, orders..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.trim().length >= 2 && totalResults === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}

          {query.trim().length < 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}

          {/* Farms */}
          {groupedResults.farm && (
            <CommandGroup heading="Farms">
              {groupedResults.farm.map((result) => {
                const Icon = icons[result.type];
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Warehouses */}
          {groupedResults.warehouse && (
            <CommandGroup heading="Warehouses">
              {groupedResults.warehouse.map((result) => {
                const Icon = icons[result.type];
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Stores */}
          {groupedResults.store && (
            <CommandGroup heading="Stores">
              {groupedResults.store.map((result) => {
                const Icon = icons[result.type];
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Buy Orders */}
          {groupedResults["buy-order"] && (
            <CommandGroup heading="Buy Orders">
              {groupedResults["buy-order"].map((result) => {
                const Icon = icons[result.type];
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
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
                        className="ml-2 text-xs"
                      >
                        {result.metadata}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Sell Orders */}
          {groupedResults["sell-order"] && (
            <CommandGroup heading="Sell Orders">
              {groupedResults["sell-order"].map((result) => {
                const Icon = icons[result.type];
                return (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
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
                        className="ml-2 text-xs"
                      >
                        {result.metadata}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

