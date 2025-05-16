import Footer from "./Footer";
import Header from "./Header";
import Banner from "./Banner";
import FilterCategory from "./filterCategory";
import FavoriteDeal from "./favoriteDeal";
import SpecialPicks from "./specialPicks";
import ProductModal from "./productModal";

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-900">
    <Header />
     <Banner />
  <FilterCategory />
  <FavoriteDeal />

     <SpecialPicks />

     <ProductModal />

     <Footer />
    </div>
  );
}
