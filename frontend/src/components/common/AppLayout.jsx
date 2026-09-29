import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

function AppLayout() {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;