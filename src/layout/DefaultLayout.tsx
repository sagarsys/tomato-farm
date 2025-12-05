import React, { ReactNode } from "react";
import Logo from "../images/logo-1.svg?react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CircleUser, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { GlobalSearch } from "@/components/GlobalSearch";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Check if current route matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden  w-full  flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo className="w-32" />
            <span className="sr-only">Fresh Tomato Farm</span>
          </Link>
          <Link
            to="/"
            className={cn(
              "transition-colors hover:text-foreground",
              isActive("/")
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            to="/supply-chain"
            className={cn(
              "transition-colors hover:text-foreground",
              isActive("/supply-chain")
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            Supply Chain
          </Link>
          <Link
            to="/farms"
            className={cn(
              "transition-colors hover:text-foreground",
              isActive("/farms")
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            Farms
          </Link>
          <Link
            to="/orders"
            className={cn(
              "transition-colors hover:text-foreground",
              isActive("/orders")
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            Orders
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Logo className="w-32" />
              </Link>
              <Link
                to="/"
                className={cn(
                  "hover:text-foreground",
                  isActive("/")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/supply-chain"
                className={cn(
                  "hover:text-foreground",
                  isActive("/supply-chain")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Supply Chain
              </Link>
              <Link
                to="/farms"
                className={cn(
                  "hover:text-foreground",
                  isActive("/farms")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Farms
              </Link>
              <Link
                to="/orders"
                className={cn(
                  "hover:text-foreground",
                  isActive("/orders")
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Orders
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <GlobalSearch />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout;
