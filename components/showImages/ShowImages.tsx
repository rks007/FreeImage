"use client";

import { useImageStore } from '@/stores/useImageStore';
import React, { useEffect } from 'react';

const ShowImages = () => {
  //@ts-ignore
  const { getAllProducts, products } = useImageStore();

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleDownload = async (url: string, title: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${title}.jpg`; // image will download as "title.jpg"
    link.click();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products && products.length > 0 ? (
        products.map((image: any) => (
          <div
            key={image._id}
            className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col"
          >
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-60 h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold">{image.title}</h2>
              <p className="text-sm text-gray-600 flex-grow">{image.description}</p>
              <button
                onClick={() => handleDownload(image.imageUrl, image.title)}
                className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
              >
                Download
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-full">No images found.</p>
      )}
    </div>
  );
};

export default ShowImages;
