import { createContext, useContext, useState, type ReactNode } from "react";

export type Page =
  | { name: "home" }
  | { name: "shop"; category?: string }
  | { name: "categories" }
  | { name: "product"; id: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "login"; next?: Page }
  | { name: "register"; next?: Page }
  | { name: "dashboard" }
  | { name: "admin" };

type NavContextType = {
  page: Page;
  navigate: (page: Page) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>({ name: "home" });
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <NavContext.Provider value={{ page, navigate, searchQuery, setSearchQuery }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
