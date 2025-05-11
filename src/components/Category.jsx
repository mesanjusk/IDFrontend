import { useState } from 'react';

const Category = ({ uniqueCategories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex overflow-x-auto px-3 py-2 gap-8">
      {uniqueCategories.length === 0 ? (
        <div>No categories available</div>
      ) : (
        uniqueCategories.map((category, index) => (
          <div
            key={index}
            className={`w-16 flex-shrink-0 flex flex-col items-center cursor-pointer ${
              selectedCategory === category ? 'text-pink-600' : ''
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-1">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xl font-bold text-pink-600">
                {category[0].toUpperCase()}
              </div>
            </div>
            <div className="text-xs mt-1 text-center">{category.slice(0, 8)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Category;
