import { Star } from 'lucide-react';

const RatingCard = () => {
  return (
    <div className="w-[150px] bg-white rounded-xl shadow-md p-2 flex flex-col items-center space-y-2">
      {/* Profile Image */}
      <img
        src="/path-to-your-image.jpg" // <-- replace with your image path
        alt="Profile"
        className="rounded-lg w-full aspect-square object-cover"
      />

      {/* Rating Section */}
      <div className="flex items-center justify-between w-full px-1">
        {/* Left Stars */}
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-gray-800">4.8</span>
        </div>

        {/* Faded Star Text */}
        <div className="text-yellow-400 text-xs opacity-70 font-medium">⭐⭐⭐½</div>

        {/* Final Number */}
        <div className="text-sm font-semibold text-gray-700">4.4.8</div>
      </div>
    </div>
  );
};

export default RatingCard;
