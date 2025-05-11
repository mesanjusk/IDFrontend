const Category = ({ uniqueCategories = [], selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex overflow-x-auto px-3 py-2 gap-6 scrollbar-hide">
      {uniqueCategories.length === 0 ? (
        <div className="text-gray-500">No categories available</div>
      ) : (
        uniqueCategories.map((category, index) => {
          const isSelected = selectedCategory === category;
          const label = category?.slice(0, 8) || 'Unknown';
          const initial = category?.[0]?.toUpperCase() || '?';

          return (
            <div
              key={index}
              className={`w-16 flex-shrink-0 flex flex-col items-center cursor-pointer transition-transform hover:scale-105 ${
                isSelected ? 'text-pink-600 font-semibold' : 'text-gray-700'
              }`}
              onClick={() => setSelectedCategory(isSelected ? null : category)}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xl font-bold">
                  {initial}
                </div>
              </div>
              <div className="text-xs mt-1 text-center">{label}</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Category;
