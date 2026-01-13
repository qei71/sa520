
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizer' | 'Main' | 'Pasta' | 'Pizza' | 'Dessert' | 'Drink';
  image: string;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  preOrders: CartItem[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  pictureUrl: string;
  points: number;
  memberLevel: 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  expiryDate: string;
}
