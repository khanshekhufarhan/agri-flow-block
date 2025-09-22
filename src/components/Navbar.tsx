import { Button } from "@/components/ui/button";
import { Sprout, User, Menu, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-soft">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AgroConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/trace" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/trace") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
              Trace Produce
            </Link>
            <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/dashboard") ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
              Dashboard
            </Link>
            {user ? (
              <Button variant="outline" size="sm" className="ml-4" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth?tab=signin">
                    <User className="h-4 w-4 mr-2" />
                    Log In
                  </Link>
                </Button>
                <Button asChild variant="hero" size="sm">
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link
                to="/trace"
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Trace Produce
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {user ? (
                <Button variant="outline" size="sm" className="mx-3 mt-2" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mx-3 mt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth?tab=signin">
                      <User className="h-4 w-4 mr-2" />
                      Log In
                    </Link>
                  </Button>
                  <Button asChild variant="hero" size="sm">
                    <Link to="/auth?tab=signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};