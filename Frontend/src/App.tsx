import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SecureRoute from "./routes/SecureRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";

function App() {
  return (
    <div>
      <Toaster position="top-center" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin Routes */}
          <Route element={<SecureRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/Categories" element={<Categories />} />
          </Route>

          {/* User Routes */}
          <Route element={<SecureRoute allowedRoles={["user"]} />}>
            <Route path="/user-dashboard" element={<div>User Dashboard</div>} />
          </Route>

          {/* Not Found Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
    </div>
  );
}

export default App;
