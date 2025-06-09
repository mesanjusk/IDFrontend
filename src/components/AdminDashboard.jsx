// 📁 src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import UploadCategory from '../pages/UploadCategory';
import UploadSubcategory from '../pages/UploadSubcategory';
import AddTitle from '../pages/addTitle';
import AddPrice from '../pages/addPrice';
import UploadBanner from '../pages/UploadBanner';
import AddInsta from '../pages/addInsta';
import AddReligion from '../pages/addReligion';
import AddSEOD from '../pages/addSEOD';
import AddUser from '../pages/addUser';
import AddSize from '../pages/addSize';
import AddSEOK from '../pages/addSEOK';
import AddSEOT from '../pages/addSEOT';
import AddConfi from '../pages/addConfi';
import CreateListing from './CreateListing';
import AllListing from './allLisiting';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { key: 'categories', label: '📂 Categories' },
    { key: 'subcategories', label: '📁 Subcategories' },
    { key: 'banners', label: '📁 Banners' },
    { key: 'listings', label: '📁 Add Listing' },
    { key: 'allListing', label: '📦 All Listings' },
    { key: 'titles', label: '🏷️ Titles' },
    { key: 'prices', label: '💰 Prices' },
    { key: 'users', label: '👥 Users' },
    { key: 'confis', label: '⚙️ Configuration' },
    { key: 'sizes', label: '📏 Sizes' },
    { key: 'instas', label: '📷 Instagram' },
    { key: 'religions', label: '🛐 Religions' },
    { key: 'seods', label: '🔍 SEO Description' },
    { key: 'seoks', label: '🔑 SEO Keywords' },
    { key: 'seots', label: '📄 SEO Titles' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('User_name');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 hidden sm:block">
        <h2 className="text-xl font-bold text-blue-600 mb-6">🛠 Admin Menu</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          🔒 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🎛️ Admin Dashboard</h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl">
          {activeTab === 'categories' && <UploadCategory />}
          {activeTab === 'subcategories' && <UploadSubcategory />}
          {activeTab === 'banners' && <UploadBanner />}
          {activeTab === 'listings' && <CreateListing />}
          {activeTab === 'allListing' && <AllListing />}
          {activeTab === 'titles' && <AddTitle />}
          {activeTab === 'prices' && <AddPrice />}
          {activeTab === 'users' && <AddUser />}
          {activeTab === 'confis' && <AddConfi />}
          {activeTab === 'sizes' && <AddSize />}
          {activeTab === 'instas' && <AddInsta />}
          {activeTab === 'religions' && <AddReligion />}
          {activeTab === 'seods' && <AddSEOD />}
          {activeTab === 'seoks' && <AddSEOK />}
          {activeTab === 'seots' && <AddSEOT />}
        </div>
      </main>
    </div>
  );
}
