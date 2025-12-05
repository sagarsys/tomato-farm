import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultLayout from "@/layout/DefaultLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import { TOAST_CONFIG } from "@/config/toast.config";
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
            <Route index element={<Dashboard />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/supply-chain" element={<SupplyChain />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </DefaultLayout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
