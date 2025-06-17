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
import Booking from "./pages/admin/Booking";
import MyBookings from "./pages/user/MyBookings";
import EventDetails from "./pages/EventDetails";

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
        <Route path="/event/:id" element={<EventDetails />} />

        {/* Admin Routes */}
        <Route element={<SecureRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/Categories" element={<Categories />} />
          <Route path="/admin/bookings" element={<Booking />} />
        </Route>

        {/* User Routes */}
        <Route element={<SecureRoute allowedRoles={["user"]} />}>
          <Route path="/user-dashboard" element={<div>User Dashboard</div>} />
          <Route path="/bookings" element={<MyBookings />} />
        </Route>

        {/* Not Found Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
