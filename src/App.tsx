import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultLayout from "@/layout/DefaultLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import { TOAST_CONFIG } from "@/config/toast.config";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Dashboard } from "@/features/dashboard";
import { Farms } from "@/features/farms";
import { Orders } from "@/features/orders";
import { SupplyChain } from "@/features/supply-chain";

const queryClient = new QueryClient();

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster {...TOAST_CONFIG} />
        <DefaultLayout>
          <Routes>
            <Route
              index
              element={
                <ErrorBoundary featureName="Dashboard">
                  <Dashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/farms"
              element={
                <ErrorBoundary featureName="Farms">
                  <Farms />
                </ErrorBoundary>
              }
            />
            <Route
              path="/supply-chain"
              element={
                <ErrorBoundary featureName="Supply Chain">
                  <SupplyChain />
                </ErrorBoundary>
              }
            />
            <Route
              path="/orders"
              element={
                <ErrorBoundary featureName="Orders">
                  <Orders />
                </ErrorBoundary>
              }
            />
          </Routes>
        </DefaultLayout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
