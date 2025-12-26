import { Star } from "lucide-react";
import avatarPlaceholder from "apps/user-ui/public/images/Webinar-pana.svg";
import Image from "next/image";
import { useState } from "react";

export default function ShopCard({ shop }: ShopCardProps) {
    const [imgSrc, setImgSrc] = useState(
  shop.avatar || avatarPlaceholder
);
  return (
    <div className="group rounded-2xl border bg-white shadow-sm hover:shadow-lg transition overflow-hidden">
      
      {/* Cover */}
<div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
  <Image
    src={imgSrc}
    alt={shop.name}
    width={80}
    height={80}
    onError={() => setImgSrc(avatarPlaceholder)}
    className="rounded-full border-4 border-white absolute -bottom-10 left-4 object-cover bg-white"
  />
</div>

      {/* Content */}
      <div className="pt-12 px-4 pb-4 space-y-2">
        
        {/* Name */}
        <h3 className="font-semibold text-gray-900 truncate">
          {shop.name}
        </h3>

        {/* Category */}
        {shop.category && (
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {shop.category}
          </span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{shop.ratings.toFixed(1)}</span>
          <span className="text-gray-500">
            ({shop.followersCount} followers)
          </span>
        </div>

        {/* Bio */}
        {shop.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {shop.bio}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-gray-500">
            📍 {shop.country || "Worldwide"}
          </span>

          <span className="text-xs font-medium text-blue-600">
            {shop.productsCount} Products
          </span>
        </div>
      </div>
    </div>
  );
}
