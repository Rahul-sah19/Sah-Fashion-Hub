import { Sparkles, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useNav } from "@/context/NavContext";

export default function Footer() {
  const { navigate } = useNav();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-white">
                <Sparkles size={18} />
              </div>
              <div className="leading-none">
                <span className="block text-base font-bold text-white">SAH</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-rose-400">
                  Fashion Hub
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Nepal's trusted online destination for stylish and affordable
              women's fashion. From traditional to contemporary, we have
              something for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate({ name: "home" })} className="text-gray-400 transition-colors hover:text-rose-400">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "shop" })} className="text-gray-400 transition-colors hover:text-rose-400">
                  Shop
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "categories" })} className="text-gray-400 transition-colors hover:text-rose-400">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "about" })} className="text-gray-400 transition-colors hover:text-rose-400">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: "contact" })} className="text-gray-400 transition-colors hover:text-rose-400">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {["Kurti", "Saree", "Western Wear", "Dresses", "Accessories"].map(
                (cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => navigate({ name: "shop", category: cat })}
                      className="text-gray-400 transition-colors hover:text-rose-400"
                    >
                      {cat}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-rose-400" />
                <span>New Road, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-rose-400" />
                <span>+977 9841234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-rose-400" />
                <span>info@sahfashionhub.com</span>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-rose-600 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>&copy; 2026 SAH Fashion Hub. All rights reserved. Made with care in Kathmandu, Nepal.</p>
        </div>
      </div>
    </footer>
  );
}
