import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PageLayout = ({ children, showFooter = true }) => (
  <div className="font-sans bg-gray-50 text-gray-900 min-h-screen">
    <Header />
    {children}
    {showFooter && <Footer />}
  </div>
);

export default PageLayout;
