import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthCallback from "../pages/AuthCallback";
import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "../components/common/AppLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AlbumDetails from "../pages/AlbumDetails";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
                   {/* Public routes */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/auth/callback" element={<AuthCallback />} />

                      {/* Protected routes */}

              <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/albums/:albumId" element={<AlbumDetails />} />

          <Route path="/favorites" element={<Favorites />} />
            </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
