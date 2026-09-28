import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { CartProvider } from "@/context/CartContext";
import { NavProvider, useNav } from "@/context/NavContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import CategoriesPage from "@/pages/CategoriesPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 py-24 text-center text-gray-500">{children}</div>;
}

function PageRouter() {
  const { page, navigate } = useNav();
  const { user, loading, isAdmin } = useAuth();

  switch (page.name) {
    case "home":
      return <HomePage />;
    case "shop":
      return <ShopPage />;
    case "categories":
      return <CategoriesPage />;
    case "product":
      return <ProductDetailsPage productId={page.id} />;
    case "cart":
      return <CartPage />;
    case "checkout":
      if (loading) return <Centered>Loading...</Centered>;
      // Orders belong to an account, so ask guests to log in first.
      return user ? <CheckoutPage /> : <LoginPage next={{ name: "checkout" }} />;
    case "about":
      return <AboutPage />;
    case "contact":
      return <ContactPage />;
    case "login":
      if (user) return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      return <LoginPage next={page.next} />;
    case "register":
      if (user) return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      return <RegisterPage next={page.next} />;
    case "dashboard":
      if (loading) return <Centered>Loading...</Centered>;
      return user ? <UserDashboard /> : <LoginPage next={{ name: "dashboard" }} />;
    case "admin":
      if (loading) return <Centered>Loading...</Centered>;
      if (!user) return <LoginPage next={{ name: "admin" }} />;
      if (!isAdmin) {
        return (
          <Centered>
            <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
            <p className="mt-2">You need an admin account to view this page.</p>
            <button
              onClick={() => navigate({ name: "home" })}
              className="mt-6 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Back to Home
            </button>
          </Centered>
        );
      }
      return <AdminDashboard />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <NavProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-white">
              <Navbar />
              <main className="flex-1">
                <PageRouter />
              </main>
              <Footer />
            </div>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </NavProvider>
  );
}

export default App;
