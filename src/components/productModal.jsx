import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";

export default function ProductModal() {
  const [selectedProduct, setSelectedProduct] = useState(null);
 
  return (
    <div className="font-sans bg-white text-gray-900">
  
      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-3">{selectedProduct.title}</h3>
            {selectedProduct.images?.length > 0 ? (
              <div className="mb-4">
                <Carousel images={selectedProduct.images} />
              </div>
            ) : (
              <div className="mb-4 h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                No Image Available
              </div>
            )}
            <p className="text-gray-700">₹{selectedProduct.price}</p>
            <p className="mt-2 text-sm text-gray-500">
              {selectedProduct.description || "No description available."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
