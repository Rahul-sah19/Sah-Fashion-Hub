import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, Quote } from "lucide-react";
import { useNav } from "@/context/NavContext";
import { reviews } from "@/data/products";
import { useCatalog } from "@/context/CatalogContext";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const { navigate } = useNav();
  const { products, categories } = useCatalog();
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600">
              New Collection 2026
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Discover Your
              <span className="block bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-600 lg:mx-0">
              Explore SAH Fashion Hub's curated collection of traditional and
              contemporary women's fashion. Quality you can trust, prices
              you'll love.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={() => navigate({ name: "shop" })}
                className="group flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-600/40"
              >
                Shop Now
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate({ name: "categories" })}
                className="rounded-full border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-900 hover:text-gray-900"
              >
                Browse Categories
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-center lg:justify-start">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-xs text-gray-500">Happy Customers</p>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">4.7</p>
                <p className="text-xs text-gray-500">Avg Rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl bg-gradient-to-br from-rose-200 to-amber-200 opacity-60" />
              <img
                src="https://i.pinimg.com/1200x/5d/e9/0f/5de90f1b045ecfa308e869ee525a3ccc.jpg"
                alt="Fashion model"
                className="relative rounded-3xl object-cover shadow-2xl"
              />
              <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                  <Truck size={22} className="text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over Rs. 2000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over Rs. 2000" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected payments" },
            { icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy" },
            { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer care" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <f.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Shop by Category
          </h2>
          <p className="mt-2 text-gray-500">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate({ name: "shop", category: cat.name })}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all hover:shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-[300px] object-top w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 className="text-base font-semibold text-white drop-shadow-md">
                  {cat.name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/80">
                  Shop Now <ArrowRight size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Featured Products
              </h2>
              <p className="mt-2 text-gray-500">Our handpicked favorites for you</p>
            </div>
            <button
              onClick={() => navigate({ name: "shop" })}
              className="hidden items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 sm:flex"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h2>
            <p className="mt-2 text-gray-500">Fresh styles just landed</p>
          </div>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="hidden items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 sm:flex"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-800">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Mid-Season Sale
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-rose-100">
            Enjoy up to 40% off on selected items. Limited time only. Don't miss
            out on amazing deals!
          </p>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="mt-6 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-rose-600 shadow-lg transition-all hover:bg-rose-50 hover:shadow-xl"
          >
            Shop the Sale
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-gray-500">Real reviews from happy shoppers across Nepal</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <Quote size={32} className="text-rose-200" />
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  "{r.text}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-900 px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white">Join Our Newsletter</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Subscribe to get the latest updates on new arrivals, exclusive
            offers, and fashion tips.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.target as HTMLFormElement).reset();
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-full border border-gray-700 bg-gray-800 px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              type="submit"
              className="rounded-full bg-rose-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
