export type Product = {
  id: string;
  name: string;
  category: string; // category name
  categoryId?: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  sizes: string[];
  isNew?: boolean;
  isFeatured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  description?: string;
  productCount?: number;
};

export type ProductInput = {
  name: string;
  categoryId: string;
  price: number;
  oldPrice: number;
  image: string;
  description: string;
  sizes: string[];
  rating?: number;
  reviews?: number;
  isNew: boolean;
  isFeatured: boolean;
};

// Products and categories now come from the API (see CatalogContext).
// Only the homepage testimonials stay static.
export const reviews = [
  {
    id: 1,
    name: "Sita Sharma",
    location: "Kathmandu",
    rating: 5,
    text: "I ordered a Banarasi saree for my sister's wedding and it was even more beautiful in person. The quality is amazing for the price!",
    avatar: "https://images.pexels.com/photos/8229321/pexels-photo-8229321.jpeg?auto=compress&cs=tinysrgb&h=120&w=120",
  },
  {
    id: 2,
    name: "Anita Gurung",
    location: "Pokhara",
    rating: 5,
    text: "SAH Fashion Hub has become my go-to store for kurtis. The fit is perfect and delivery was quick. Highly recommended!",
    avatar: "https://images.pexels.com/photos/10477882/pexels-photo-10477882.jpeg?auto=compress&cs=tinysrgb&h=120&w=120",
  },
  {
    id: 3,
    name: "Rojina Thapa",
    location: "Lalitpur",
    rating: 4,
    text: "Great collection of western wear at affordable prices. The denim dress I bought gets compliments everywhere I go.",
    avatar: "https://images.pexels.com/photos/5102577/pexels-photo-5102577.jpeg?auto=compress&cs=tinysrgb&h=120&w=120",
  },
];
