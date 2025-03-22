
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Search, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-10 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-medium tracking-tight transition-transform duration-300 hover:scale-[1.02]"
        >
          AI<span className="text-primary font-bold">Market</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/models" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
            Models
          </Link>
          <Link to="/pricing" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link to="/about" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <div className="ml-2 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="rounded-full w-10 h-10"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-72 animate-fade-in">
                <Input 
                  type="search" 
                  placeholder="Search models..." 
                  className="w-full h-10 rounded-full pl-4 pr-10 focus:ring-primary" 
                  autoFocus
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <ModeToggle />
          <Link to="/signin">
            <Button variant="outline" className="ml-2 rounded-full h-9">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="ml-2 rounded-full h-9">Sign Up</Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
            className="rounded-full w-10 h-10"
          >
            <Search className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            className="rounded-full w-10 h-10"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pt-3 animate-fade-in">
          <Input 
            type="search" 
            placeholder="Search models..." 
            className="w-full h-10 rounded-full pl-4 pr-10 focus:ring-primary" 
            autoFocus
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-8 mt-3 h-8 w-8 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md shadow-md border-t border-border animate-slide-in-bottom">
          <nav className="flex flex-col p-4 space-y-3">
            <Link to="/" className="px-4 py-3 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              Home
            </Link>
            <Link to="/models" className="px-4 py-3 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              Models
            </Link>
            <Link to="/pricing" className="px-4 py-3 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="px-4 py-3 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              About
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/signin" className="w-full">
                <Button variant="outline" className="w-full rounded-full h-10">Sign In</Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full rounded-full h-10">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
