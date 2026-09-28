import { useState } from "react";
import { Menu, X, Search, ShoppingBag, Sparkles, User as UserIcon } from "lucide-react";
import { useNav } from "@/context/NavContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = ["Home", "Shop", "Categories", "About", "Contact"] as const;

export default function Navbar() {
  const { page, navigate, searchQuery, setSearchQuery } = useNav();
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const accountPage = isAdmin ? ({ name: "admin" } as const) : ({ name: "dashboard" } as const);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (link: string) => {
    const lower = link.toLowerCase();
    if (lower === "home") navigate({ name: "home" });
    else if (lower === "shop") navigate({ name: "shop" });
    else if (lower === "categories") navigate({ name: "categories" });
    else if (lower === "about") navigate({ name: "about" });
    else if (lower === "contact") navigate({ name: "contact" });
    setMobileOpen(false);
  };

  const isActive = (link: string) => {
    const lower = link.toLowerCase();
    if (lower === "home") return page.name === "home";
    if (lower === "shop") return page.name === "shop" || page.name === "product";
    if (lower === "categories") return page.name === "categories";
    if (lower === "about") return page.name === "about";
    if (lower === "contact") return page.name === "contact";
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: "shop" });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate({ name: "home" })}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <div className="text-left leading-none">
            <span className="block text-base font-bold tracking-tight text-gray-900">
              SAH
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-rose-600">
              Fashion Hub
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => handleNav(link)}
              className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link)
                  ? "text-rose-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {link}
              {isActive(link) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-rose-600" />
              )}
            </button>
          ))}
        </nav>

        {/* Search - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-xs items-center lg:flex"
        >
          <div className="relative w-full">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </form>

        {/* Cart + Mobile toggle */}
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => navigate(accountPage)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                page.name === "dashboard" || page.name === "admin" ? "text-rose-600" : "text-gray-700"
              }`}
            >
              <UserIcon size={20} />
              <span className="hidden max-w-[100px] truncate sm:inline">
                {isAdmin ? "Admin" : user.name.split(" ")[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate({ name: "login" })}
              className="hidden rounded-full border border-rose-600 px-4 py-1.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-600 hover:text-white sm:inline-block"
            >
              Log in
            </button>
          )}
          <button
            onClick={() => navigate({ name: "cart" })}
            className="relative rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                className={`rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive(link)
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link}
              </button>
            ))}
            <div className="mt-2 border-t border-gray-100 pt-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate(accountPage);
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {isAdmin ? "Admin Dashboard" : "My Account"}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate({ name: "home" });
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate({ name: "login" });
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      navigate({ name: "register" });
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
