import ContactPreview from './ContactPreview';
import FeaturedProducts from './FeaturedProducts';
import Footer from './Footer';
import HeroSection from './HeroSection';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';

const categoryCards = [
  { id: 'visiting-cards', title: 'Visiting Cards', icon: '📇' },
  { id: 'brochures', title: 'Brochures', icon: '📘' },
  { id: 'flex-banners', title: 'Flex & Banners', icon: '🪧' },
  { id: 'packaging', title: 'Packaging Prints', icon: '📦' },
  { id: 'flyers', title: 'Flyers', icon: '📣' },
  { id: 'custom-gifts', title: 'Custom Gifts', icon: '🎁' },
];

const featuredProducts = [
  {
    _id: 'demo-1',
    title: 'Premium Visiting Cards',
    description: 'Matte and glossy options with high-resolution finish for professional branding.',
    price: 299,
    images: ['https://images.unsplash.com/photo-1576511745850-bad9f7f1e7a0?auto=format&fit=crop&w=900&q=80'],
    badge: 'Popular',
  },
  {
    _id: 'demo-2',
    title: 'Event Flex Banner',
    description: 'Weather-resistant, vibrant large-format banners for events and promotions.',
    price: 899,
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'],
    badge: 'New',
  },
  {
    _id: 'demo-3',
    title: 'Corporate Brochure',
    description: 'High-quality brochure printing designed for business presentations and catalogs.',
    price: 499,
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'demo-4',
    title: 'Custom Product Labels',
    description: 'Durable adhesive labels suitable for packaging, retail, and product branding.',
    price: 399,
    images: ['https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'demo-5',
    title: 'Restaurant Menu Cards',
    description: 'Water-resistant and premium menu cards tailored for cafes and restaurants.',
    price: 649,
    images: ['https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'demo-6',
    title: 'Promotional Flyers',
    description: 'Eye-catching flyers with sharp print quality for campaigns and local promotions.',
    price: 249,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'demo-7',
    title: 'Standee Printing',
    description: 'Roll-up standees ideal for exhibitions, showrooms, and retail branding.',
    price: 1199,
    images: ['https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'demo-8',
    title: 'Custom Paper Bags',
    description: 'Eco-friendly printed paper bags for stores, boutiques, and gifting.',
    price: 699,
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80'],
  },
];

export default function Home() {
  return (
    <div className="bg-white font-sans text-gray-900">
      <HeroSection />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
            <p className="mt-3 text-gray-600">Find the right print product for every business need.</p>
          </div>

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
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} visibleCount={8} onLoadMore={undefined} />
      <WhyChooseUs />
      <Testimonials />
      <ContactPreview />
      <Footer />
    </div>
  );
}
