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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { key: 'categories', label: '📂 Categories' },
    { key: 'subcategories', label: '📁 Subcategories' },
    { key: 'banners', label: '📁 Banners' },
    { key: 'titles', label: '🏷️ Titles' },
    { key: 'prices', label: '💰 Prices' },
     { key: 'users', label: '📂 Users' },
     { key: 'confis', label: '📂 Confis' },
    { key: 'sizes', label: '📁 Sizes' },
    { key: 'instas', label: '📁 Instas' },
    { key: 'religions', label: '🏷️ Religions' },
    { key: 'seods', label: '💰 SEODS' },
     { key: 'seoks', label: '📂 SEOKS' },
    { key: 'seots', label: '📁 SEOKS' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🎛️ Admin Dashboard</h1>

      <div className="flex justify-center mb-6">
        <div className="bg-white shadow-md rounded-2xl p-2 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        {activeTab === 'categories' && <UploadCategory />}
        {activeTab === 'subcategories' && <UploadSubcategory />}
         {activeTab === 'banners' && <UploadBanner />}
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
    </div>
  );
}
