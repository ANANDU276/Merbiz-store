import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import { CategoryContext } from "../context/CategoryContext";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaPhoneAlt,
  FaHeart,
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useContext(AuthContext);
  const { setSelectedCategory } = useContext(CategoryContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  // Define categories
  const categories = [
    { name: "Phones", path: "/productpage", category: "Phones" },
    { name: "Laptops", path: "/productpage", category: "Laptops" },
    { name: "Headphones", path: "/productpage", category: "Headphones" },
    { name: "Speakers", path: "/productpage", category: "Speakers" },
    { name: "Smart Watches", path: "/productpage", category: "Smart Watches" },
    { name: "Gaming", path: "/productpage", category: "Gaming Gear" },
    { name: "Features", path: "/features" }, // No category filter for this one
  ];

  // Refs for click-outside functionality
  const dropdownRef = useRef(null);
  const userButtonRef = useRef(null);
  const navbarRef = useRef(null);
  const categoryButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handlers for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // User dropdown
      if (
        userDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      
      // Category dropdown
      if (
        categoryOpen &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target) &&
        !event.target.closest('.mobile-category-menu')
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen, categoryOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (categoryOpen) setCategoryOpen(false);
    if (searchOpen) setSearchOpen(false);
    if (userDropdownOpen) setUserDropdownOpen(false);
  };

  const toggleCategories = () => {
    setCategoryOpen(!categoryOpen);
    if (menuOpen) setMenuOpen(false);
    if (userDropdownOpen) setUserDropdownOpen(false);
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
    if (menuOpen) setMenuOpen(false);
    if (categoryOpen) setCategoryOpen(false);
  };

  const closeAllDropdowns = () => {
    setUserDropdownOpen(false);
    setMenuOpen(false);
    setCategoryOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You'll need to log in again to access your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      scrollbarPadding: false,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
        ).then(() => {
          navigate("/");
        });
      }
    });
  };

  const getUserInitials = (name) => {
    if (!name) return "";

    const words = name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0);

    if (words.length === 0) return "";

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-lg bg-white" : "bg-white"
      }`}
      ref={navbarRef}
    >
      {/* Top Navbar */}
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and Hamburger */}
          <div className="flex items-center gap-4">
            {/* Hamburger - Mobile only */}
            <button
              className="md:hidden text-xl focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
              onClick={() => setSelectedCategory("")}
            >
              Merbiz
            </Link>
          </div>

          {/* Search - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 mx-8 max-w-2xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Right section - Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setSelectedCategory("")}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/myorders"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                My Orders
              </Link>
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-1 hover:text-blue-600 transition-colors"
              aria-label="Wishlist"
            >
              <FaHeart className="text-lg md:text-xl" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-1 hover:text-blue-600 transition-colors"
              aria-label="Cart"
            >
              <FaShoppingCart className="text-lg md:text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            {user ? (
              <div className="relative">
                <button
                  ref={userButtonRef}
                  onClick={toggleUserDropdown}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none"
                  aria-label="My Account"
                  aria-expanded={userDropdownOpen}
                  title={user.name}
                >
                  {getUserInitials(user.name)}
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 overflow-hidden"
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 bg-gray-50">
                        <div className="font-medium truncate">
                          Hi, {user.name.split(" ")[0]}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        <FaUserCircle className="mr-3 text-gray-500" />
                        My Account
                      </Link>
                      <Link
                        to="/account/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        <FaCog className="mr-3 text-gray-500" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-t border-gray-100"
                      >
                        <FaSignOutAlt className="mr-3 text-gray-500" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1 hover:text-blue-600 transition-colors"
                aria-label="Login"
              >
                <FaUser className="text-lg md:text-xl" />
              </Link>
            )}

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setUserDropdownOpen(false);
                setCategoryOpen(false);
              }}
              className="md:hidden p-1 focus:outline-none"
              aria-label="Search"
            >
              <FaSearch className="text-xl text-gray-700 hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col">
              <Link
                to="/"
                className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                onClick={() => {
                  setSelectedCategory("");
                  closeAllDropdowns();
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                onClick={closeAllDropdowns}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                onClick={closeAllDropdowns}
              >
                Contact
              </Link>
              <Link
                to="/myorders"
                className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                onClick={closeAllDropdowns}
              >
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                onClick={closeAllDropdowns}
              >
                My Wishlist
              </Link>
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                    onClick={closeAllDropdowns}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-3 px-3 text-left hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="py-3 px-3 hover:text-blue-600 transition-colors border-b border-gray-100 hover:bg-blue-50 rounded-md"
                  onClick={closeAllDropdowns}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Bar */}
      <div className="bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto">
          {/* Desktop Categories */}
          <div className="hidden md:flex justify-between items-center px-6 py-2">
            <nav className="flex items-center space-x-6 overflow-x-auto py-2 hide-scrollbar">
              {categories.map((item, index) => (
                <React.Fragment key={index}>
                  {item.category ? (
                    <Link
                      to={item.path}
                      onClick={() => setSelectedCategory(item.category)}
                      className="flex-shrink-0 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex-shrink-0 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
                    >
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
            <div className="flex-shrink-0 flex items-center text-xs text-gray-500 ml-6">
              <FaPhoneAlt className="mr-2" />
              <span>
                Need help?{" "}
                <span className="font-semibold text-gray-800">
                  +84 1234 555 77
                </span>
              </span>
            </div>
          </div>

          {/* Mobile Categories Toggle */}
          <div className="md:hidden px-4 py-2">
            <button
              ref={categoryButtonRef}
              className="flex items-center text-sm text-blue-600 font-medium w-full justify-between focus:outline-none p-2 bg-white rounded-lg border border-gray-200 shadow-sm"
              onClick={toggleCategories}
              aria-expanded={categoryOpen}
            >
              <span>Browse Categories</span>
              {categoryOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 mobile-category-menu"
                >
                  <div className="flex flex-col gap-1 text-sm text-gray-800 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                    {categories.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.category ? (
                          <Link
                            to={item.path}
                            onClick={() => {
                              setSelectedCategory(item.category);
                              closeAllDropdowns();
                            }}
                            className="hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <Link
                            to={item.path}
                            onClick={closeAllDropdowns}
                            className="hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            {item.name}
                          </Link>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-3 px-3 py-2 bg-gray-50 rounded-md">
                    <FaPhoneAlt className="mr-2" />
                    <span>
                      Need help?{" "}
                      <span className="font-semibold text-gray-800">
                        +84 1234 555 77
                      </span>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;