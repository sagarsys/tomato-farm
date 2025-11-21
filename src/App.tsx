import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Orders from "./pages/Orders";
import SupplyChain from "./pages/SupplyChain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultLayout from "./layout/DefaultLayout";

const queryClient = new QueryClient();

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
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
  );
}

export default App;
