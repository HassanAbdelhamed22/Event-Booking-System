import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Menu, X, LogOut, Settings } from "lucide-react";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Evently</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/bookings"
                  className="font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  My Bookings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="font-medium text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : null}
          </nav>

          {/* Auth buttons / Profile menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors focus:outline-none"
                >
                  <span className="font-medium">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="block px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/bookings"
                      className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
