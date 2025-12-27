interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    avatar?: string;
    category?: string;
    bio?: string;
    country?: string;
    ratings: number;
    // followersCount: number;
    // productsCount: number;
  };
}
