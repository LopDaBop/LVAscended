
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { 
  Home, Award, Activity, UserCircle, Users, LogOut, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Level Up", path: "/level-up", icon: <Award className="h-5 w-5" /> },
    { name: "Stats", path: "/stats", icon: <Activity className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <UserCircle className="h-5 w-5" /> },
    { name: "Social", path: "/social", icon: <Users className="h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!user) return null;

  return (
    <nav className="bg-background border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-gradient">LevelAtop</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-white bg-primary/20"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button
              variant="ghost"
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/90 backdrop-blur-md">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-base font-medium ${
                  location.pathname === item.path
                    ? "text-white bg-primary/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
