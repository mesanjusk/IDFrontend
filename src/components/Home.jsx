import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import ContactPreview from './ContactPreview';
import FeaturedProducts from './FeaturedProducts';
import Footer from './Footer';
import HeroSection from './HeroSection';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';

const categoryIcons = ['📇', '📘', '🪧', '📦', '📣', '🎁'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        const payload = Array.isArray(response.data) ? response.data : response.data?.result || [];
        setProducts(payload);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        const payload = Array.isArray(response.data) ? response.data : response.data?.result || [];
        setCategories(payload);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const categoryCards = useMemo(() => {
    return categories.slice(0, 6).map((category, index) => {
      const title = typeof category === 'string' ? category : category?.name || 'Category';
      return {
        id: category?._id || `${title}-${index}`,
        title,
        icon: categoryIcons[index % categoryIcons.length],
      };
    });
  }, [categories]);

  return (
    <div className="bg-white font-sans text-gray-900">
      <HeroSection />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
            <p className="mt-3 text-gray-600">Find the right print product for every business need.</p>
          </div>

          {categoryCards.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryCards.map((category) => (
                <article
                  key={category.id}
                  className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-2xl">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{category.title}</h3>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-500">Categories will appear here soon.</p>
          )}
        </div>
      </section>

      <FeaturedProducts
        products={products}
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount((prev) => prev + 4)}
      />
      <WhyChooseUs />
      <Testimonials />
      <ContactPreview />
      <Footer />
    </div>
  );
}
