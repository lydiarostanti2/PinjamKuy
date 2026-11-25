export type UserRole = 'renter' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  city: string;
  bio: string;
  ktpVerified: boolean;
  emailVerified: boolean;
  rating: number;
  responseRate: string;
  joinedAt: string;
  lat: number;
  lng: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  photos: string[];
  variantInfo?: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  pricePerDay: number;
  stock: number;
  depositAmount: number;
  description: string;
  condition: string;
  completeness: string[];
  specs: ProductSpec[];
  rentalTerms: string[];
  images: string[];
  city: string;
  district: string;
  addressHint: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  rentedCount: number;
  isApproved: boolean;
  createdAt: string;
}

export type RentalStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface RentalOrder {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  protectionFee: number;
  totalPrice: number;
  status: RentalStatus;
  notes: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  itemId?: string;
  itemTitle?: string;
  itemImage?: string;
  itemPrice?: number;
  lastMessage: string;
  lastMessageAt: string;
}

export type NotificationType = 'chat' | 'rental_request' | 'rental_status' | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  targetView: AppView;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

export type FooterPageId =
  | 'about'
  | 'how-it-works'
  | 'safety'
  | 'faq'
  | 'terms'
  | 'privacy';

export type AppView =
  | 'home'
  | 'product-detail'
  | 'auth'
  | 'account'
  | 'add-item'
  | 'chat'
  | 'notifications'
  | 'info';

export interface CategoryMeta {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}
