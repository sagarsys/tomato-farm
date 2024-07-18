import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Loader from "./common/Loader";
import { Dashboard } from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Orders from "./pages/Orders";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <Dashboard />
            </>
          }
        />
        <Route
          path="/farms"
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
    </>
  );
}

export default App;
