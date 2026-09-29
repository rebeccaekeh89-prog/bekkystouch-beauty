export interface Product {
  id: number;
  name: string;
  category: 'Face' | 'Eyes' | 'Brows' | 'Lips' | 'Tools';
  price: number;
  shade: string;
  shadesList?: string[];
  shadeImages?: Record<string, string>;
  image: string;
  badge?: 'Bestseller' | 'New' | 'Limited' | 'Viral' | 'Shade Set' | 'Set' | null;
  rating: number;
  reviewsCount: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  volumeOrWeight: string;
  undertoneRecommendation?: string[];
}

export interface CartItem extends Product {
  qty: number;
  selectedShade?: string;
}

export interface CustomerOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
  };
  paymentMethod: string;
}
