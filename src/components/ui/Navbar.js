// components/Navbar.jsx
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "@/store/cartSlice";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaInfoCircle,
  FaUser,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import mitaLogo from "../../../public/mitalogo.png";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Custom hook for media queries

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const cartItemsCount = useSelector(selectCartCount);

  // Optimized scroll handler with RAF
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Prevent body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Prevent touch scrolling
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsSearchExpanded(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const query = searchQuery.trim();
      if (!query) return;

      router.push(`/books?search=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setIsOpen(false);
      setIsSearchExpanded(false);
    },
    [searchQuery, router],
  );

  const navLinks = useMemo(
    () => [
      { name: "Home", href: "/", icon: <FaHome />, exact: true },
      { name: "Books", href: "/books", icon: <FaBook /> },
      { name: "About Us", href: "/about", icon: <FaInfoCircle /> },
    ],
    [],
  );

  const isActiveLink = useCallback(
    (href, exact = false) => {
      if (exact) return pathname === href;
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const navbarVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 30, stiffness: 250 },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Improved touch target */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-1"
              aria-label="MitaStore Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105">
                <Image
                  src={mitaLogo}
                  alt="MITA Logo"
                  width={200}
                  height={200}
                  priority
                  className="w-[clamp(40px,4vw,60px)] h-auto object-contain"
                />
              </div>
              <span
                className={`text-[clamp(1rem,3vw,1.25rem)] font-light tracking-tight logoFont ${
                  scrolled ? "text-gray-900" : "text-white"
                } hidden sm:block transition-colors`}
              >
                নিয়োগ পাবলিকেশন্স
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-10">
              {/* Navigation Links */}
              <div className="flex gap-1 lg:gap-2">
                {navLinks.map((link) => {
                  const isActive = isActiveLink(link.href, link.exact);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`group relative flex items-center gap-2 px-3 lg:px-4 py-2 text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium rounded-lg transition-all ${
                        isActive
                          ? scrolled
                            ? "text-indigo-600"
                            : "text-white"
                          : scrolled
                            ? "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="text-[clamp(0.875rem,1.5vw,1rem)]">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full ${
                            scrolled ? "bg-indigo-600" : "bg-white"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Search - Conditional rendering based on screen size */}
              {!isTablet && (
                <form
                  onSubmit={handleSearch}
                  className="relative w-[clamp(12rem,25vw,18rem)]"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className={`w-full rounded-full border py-[clamp(0.5rem,1.2vw,0.625rem)] pl-11 pr-12 text-[clamp(0.75rem,1.2vw,0.875rem)] transition-all focus:outline-none focus:ring-2 ${
                      scrolled
                        ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500/50"
                        : "border-white/30 bg-white/15 text-white placeholder-white/60 focus:ring-white/50"
                    }`}
                    aria-label="Search books"
                  />
                  <FaSearch
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-[clamp(0.875rem,1.2vw,1rem)] ${
                      scrolled ? "text-gray-500" : "text-white/70"
                    }`}
                    aria-hidden="true"
                  />
                  <button
                    type="submit"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-[clamp(1rem,1.5vw,1.125rem)] font-bold transition-colors ${
                      scrolled
                        ? "text-indigo-600 hover:text-indigo-700"
                        : "text-white hover:text-white/80"
                    }`}
                    aria-label="Submit search"
                  >
                    →
                  </button>
                </form>
              )}

              {/* Cart with animation */}
              <Link
                href="/cart"
                className={`relative flex items-center rounded-full p-2 lg:p-3 transition-colors group ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={`Shopping cart with ${cartItemsCount} items`}
              >
                <FaShoppingCart className="text-[clamp(1rem,2vw,1.25rem)] transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold text-white shadow-md"
                    >
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>

            {/* Mobile: Right side actions */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile search toggle */}
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={`rounded-lg p-2.5 transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={isSearchExpanded ? "Close search" : "Open search"}
                aria-expanded={isSearchExpanded}
              >
                <FaSearch size={20} />
              </button>

              {/* Mobile cart */}
              <Link
                href="/cart"
                className={`relative rounded-lg p-2.5 ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={`Cart with ${cartItemsCount} items`}
              >
                <FaShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Hamburger menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-lg p-2.5 transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaTimes size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaBars size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile search bar - expands below navbar */}
          <AnimatePresence>
            {isMobile && isSearchExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden md:hidden"
              >
                <form onSubmit={handleSearch} className="py-3 px-1">
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books..."
                      className="w-full rounded-xl border border-gray-300 bg-white px-12 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      aria-label="Search books"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold hover:text-indigo-700"
                      aria-label="Submit search"
                    >
                      Go
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile Menu - Improved accessibility */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-[clamp(16rem,75vw,22rem)] max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              id="mobile-menu"
            >
              <div className="flex h-full flex-col p-6">
                {/* Header with user greeting (optional) */}
                <div className="mb-12 flex items-center justify-between"></div>

                {/* Navigation Links - Improved touch targets */}
                <nav
                  className="flex-1 space-y-1"
                  aria-label="Mobile navigation"
                >
                  {navLinks.map((link) => {
                    const isActive = isActiveLink(link.href, link.exact);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 rounded-xl px-5 py-4 text-base font-medium transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="text-xl">{link.icon}</span>
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Cart with improved touch target */}
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 flex items-center justify-between rounded-xl bg-gray-100 px-5 py-4 hover:bg-gray-200 active:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center gap-4">
                    <FaShoppingCart className="text-xl text-gray-700" />
                    <span className="font-medium text-gray-800">
                      Shopping Cart
                    </span>
                  </div>
                  {cartItemsCount > 0 && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-md">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} MitaStore. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer with dynamic height */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
};

export default Navbar;
