// Home.jsx – Premium Wedding Card Store UI Inspired by CaratLane (Tailwind CSS Only)

import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";
import FilterCategory from "./filterCategory";
import FavoriteDeal from "./favoriteDeal";
import SpecialPicks from "./specialPicks";
import ProductModal from "./productModal";
import AllCategory from "./allCategory";
import SocialMedia from "./SocialMedia.jsx";

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Sticky header */}
      <Header />

      {/* Hero Banner */}
      <Banner />

      {/* All Categories Carousel */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <AllCategory />
      </section>

      {/* Filters by Category (horizontal tabs) */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <FilterCategory />
      </section>

      {/* Favorite Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorite Deals</h2>
        <FavoriteDeal />
      </section>

      {/* Special Picks (grid or carousel) */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Picks</h2>
        <SpecialPicks />
      </section>

      {/* Product Modal Viewer */}
      <ProductModal />

      {/* Social Media Icons */}
      <section className="bg-gray-50 mt-16 py-6">
        <SocialMedia />
      </section>

      {/* Footer with links and policy */}
      <Footer />
    </div>
  );
}
