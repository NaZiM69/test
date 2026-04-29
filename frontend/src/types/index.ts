export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_days: number;
}

export interface UserSubscription {
  id: number;
  user: number;
  plan: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
