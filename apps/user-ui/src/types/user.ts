export interface User {
  id: string;
  name?: string;
  email?: string;
  followings: string[];
  orders: any[];
  shopReviews: any[];
  images: { url: string }[];
  createdAt: string;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
  userId: string;
  createdAt: Date;
}