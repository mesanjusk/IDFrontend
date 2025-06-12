import Footer from "./Footer";
import Header from "./Header";
import Banner from "./Banner";
import AllCategory from "./allCategory";
import SocialMedia from "./SocialMedia.jsx";

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-900">
      <Header />
      <Banner />
      <AllCategory />

      
      <Footer />
      <SocialMedia />
    </div>
  );
}
