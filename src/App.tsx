import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Dashboard } from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Orders from "./pages/Orders";
import SupplyChain from "./pages/SupplyChain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultLayout from "./layout/DefaultLayout";
import { TOAST_CONFIG } from "./constants/toastConfig";
import { ThemeProvider } from "./context/ThemeContext";

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
                <>
                  <Dashboard />
                </>
              }
            />
            <Route path="/farms" element={<Farms />} />
            <Route path="/supply-chain" element={<SupplyChain />} />
            <Route
              path="/clients"
              element={
                <>
                  <Farms />
                </>
              }
            />
            <Route
              path="/orders"
              element={
                <>
                  <Orders />
                </>
              }
            />
          </Routes>
        </DefaultLayout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
