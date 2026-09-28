import { Heart, Target, Eye, Users, Award, Truck } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Quality First",
      desc: "We handpick every product to ensure it meets our quality standards before it reaches you.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      desc: "Our customers are at the heart of everything we do. Your satisfaction is our priority.",
    },
    {
      icon: Award,
      title: "Affordable Fashion",
      desc: "We believe great style should be accessible. We offer competitive prices without compromising quality.",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
      desc: "We deliver across all of Nepal, bringing fashion right to your doorstep.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600">
                Our Story
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                About SAH Fashion Hub
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-600">
                SAH Fashion Hub is a Nepal-based fashion e-commerce store born
                from a simple idea: every woman deserves access to stylish,
                high-quality clothing at affordable prices. Founded in
                Kathmandu, we started as a small boutique and have grown into a
                trusted online destination for women's fashion across the
                country.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                From traditional Kurtis and Sarees that celebrate our rich
                cultural heritage, to modern Western Wear and Dresses for the
                contemporary woman, we offer a carefully curated collection that
                blends tradition with trend.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8386651/pexels-photo-8386651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="SAH Fashion Hub boutique"
                loading="lazy"
                className="rounded-3xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              To empower women across Nepal with fashion that expresses their
              individuality. We strive to make quality clothing accessible to
              every household, bridging the gap between traditional craftsmanship
              and modern style.
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Eye size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              To become Nepal's most loved fashion brand, known for quality,
              affordability, and exceptional customer service. We envision a
              future where every woman in Nepal can shop for fashion with
              confidence and joy.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              What We Stand For
            </h2>
            <p className="mt-2 text-gray-500">The values that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <v.icon size={24} />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-800">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { num: "500+", label: "Products" },
              { num: "10K+", label: "Happy Customers" },
              { num: "75+", label: "Cities Served" },
              { num: "4.7", label: "Average Rating" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-white sm:text-4xl">{s.num}</p>
                <p className="mt-1 text-sm text-rose-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
