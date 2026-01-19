import React from 'react';
const HomeSectionCard = ({ title, img, linkText }) => {
  return (
    <div className="bg-white z-30 h-[420px] p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
      <h2 className="text-xl font-bold tracking-wide text-amazon-blue">{title}</h2>
      
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        {/* If an image is passed, display it. Otherwise, show a placeholder. */}
        {img ? (
           <img className="h-full w-full object-cover scale-90 hover:scale-100 transition-transform duration-300" src={img} alt={title} />
        ) : (
           <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
             Image Placeholder
           </div>
        )}
      </div>

      <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline font-medium cursor-pointer">
        {linkText || "See more"}
      </p>
    </div>
  );
};

export default HomeSectionCard;