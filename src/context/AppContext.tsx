import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_ITEMS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_RENTALS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  IMAGES,
} from '../data/seedData';
import {
  AppNotification,
  AppView,
  ChatConversation,
  ChatMessage,
  FooterPageId,
  ProductItem,
  ProductReview,
  RentalOrder,
  RentalStatus,
  User,
  UserRole,
} from '../types';

interface AppContextValue {
  view: AppView;
  selectedItemId: string;
  activeChatId: string;
  footerPage: FooterPageId;
  currentUser: User | null;
  users: User[];
  items: ProductItem[];
  reviews: ProductReview[];
  favorites: string[];
  rentals: RentalOrder[];
  conversations: ChatConversation[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  toastMessage: string | null;
  userCoords: { lat: number; lng: number } | null;
  setUserCoords: (coords: { lat: number; lng: number }) => void;
  showToast: (msg: string) => void;
  navigateTo: (view: AppView, options?: { itemId?: string; chatId?: string; footerPage?: FooterPageId }) => void;
  loginAsDemoRole: (role: UserRole) => void;
  loginWithEmail: (email: string) => { ok: boolean; error?: string };
  loginWithProvider: (provider: 'Google' | 'Apple' | 'Facebook', email: string, name: string) => void;
  registerAccount: (data: { name: string; email: string; role: 'renter' | 'owner' }) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  toggleFavorite: (itemId: string) => void;
  submitRental: (payload: {
    item: ProductItem;
    quantity: number;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalPrice: number;
    protectionFee: number;
    notes: string;
  }) => boolean;
  updateRentalStatus: (rentalId: string, status: RentalStatus) => void;
  addReview: (payload: {
    itemId: string;
    rating: number;
    comment: string;
    photos: string[];
  }) => void;
  addItem: (newItem: Omit<ProductItem, 'id' | 'ownerId' | 'rating' | 'reviewCount' | 'rentedCount' | 'isApproved' | 'createdAt'>) => void;
  updateItemStock: (itemId: string, stock: number) => void;
  toggleItemApproval: (itemId: string) => void;
  verifyUserKtp: (userId: string) => void;
  openChatWithOwner: (ownerId: string, item?: ProductItem) => void;
  sendMessage: (conversationId: string, content: string, imageUrl?: string) => void;
  simulateIncomingReply: (conversationId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = 'pinjamkuy_state_v1';

interface PersistedState {
  currentUserId: string | null;
  users: User[];
  items: ProductItem[];
  reviews: ProductReview[];
  favorites: string[];
  rentals: RentalOrder[];
  conversations: ChatConversation[];
  messages: ChatMessage[];
  notifications: AppNotification[];
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.items) && Array.isArray(parsed.users)) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted local storage
  }
  return {
    currentUserId: 'user-renter-1',
    users: INITIAL_USERS,
    items: INITIAL_ITEMS,
    reviews: INITIAL_REVIEWS,
    favorites: ['item-sony-a7iii', 'item-projector-cinema'],
    rentals: INITIAL_RENTALS,
    conversations: INITIAL_CONVERSATIONS,
    messages: INITIAL_MESSAGES,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = loadPersisted();

  const [view, setView] = useState<AppView>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('item')) return 'product-detail';
    return 'home';
  });
  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('item') || INITIAL_ITEMS[0].id;
  });
  const [activeChatId, setActiveChatId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [footerPage, setFooterPage] = useState<FooterPageId>('about');

  const [users, setUsers] = useState<User[]>(initial.users);
  const [currentUserId, setCurrentUserId] = useState<string | null>(initial.currentUserId);
  const [items, setItems] = useState<ProductItem[]>(initial.items);
  const [reviews, setReviews] = useState<ProductReview[]>(initial.reviews);
  const [favorites, setFavorites] = useState<string[]>(initial.favorites);
  const [rentals, setRentals] = useState<RentalOrder[]>(initial.rentals);
  const [conversations, setConversations] = useState<ChatConversation[]>(initial.conversations);
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [notifications, setNotifications] = useState<AppNotification[]>(initial.notifications);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  useEffect(() => {
    const stateToSave: PersistedState = {
      currentUserId,
      users,
      items,
      reviews,
      favorites,
      rentals,
      conversations,
      messages,
      notifications,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore storage quota errors
    }
  }, [currentUserId, users, items, reviews, favorites, rentals, conversations, messages, notifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const navigateTo = (
    nextView: AppView,
    options?: { itemId?: string; chatId?: string; footerPage?: FooterPageId }
  ) => {
    if (options?.itemId) {
      setSelectedItemId(options.itemId);
      const url = new URL(window.location.href);
      url.searchParams.set('item', options.itemId);
      window.history.replaceState({}, '', url.toString());
    } else if (nextView !== 'product-detail') {
      const url = new URL(window.location.href);
      url.searchParams.delete('item');
      window.history.replaceState({}, '', url.toString());
    }
    if (options?.chatId) setActiveChatId(options.chatId);
    if (options?.footerPage) setFooterPage(options.footerPage);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAsDemoRole = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUserId(target.id);
      showToast(`Berhasil masuk sebagai ${target.name} (${role === 'renter' ? 'Penyewa' : role === 'owner' ? 'Pemilik Barang' : 'Admin'})`);
      navigateTo('home');
    }
  };

  const loginWithEmail = (email: string): { ok: boolean; error?: string } => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUserId(found.id);
      showToast(`Selamat datang kembali, ${found.name}!`);
      navigateTo('home');
      return { ok: true };
    }
    // Create session user if valid gmail format not yet in seed
    const localName = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = localName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formattedName || 'Pengguna PinjamKuy',
      email: email.trim().toLowerCase(),
      role: 'renter',
      avatar: IMAGES.avatarRaka,
      phone: '0812-0000-0000',
      city: 'Jakarta Selatan',
      bio: 'Anggota baru komunitas sewa PinjamKuy.',
      ktpVerified: false,
      emailVerified: true,
      rating: 5.0,
      responseRate: 'Baru bergabung',
      joinedAt: 'November 2026',
      lat: -6.2442,
      lng: 106.7995,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    showToast(`Berhasil masuk dengan akun ${newUser.email}`);
    navigateTo('home');
    return { ok: true };
  };

  const loginWithProvider = (
    provider: 'Google' | 'Apple' | 'Facebook',
    email: string,
    name: string
  ) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUserId(existing.id);
      showToast(`Masuk melalui ${provider} sebagai ${existing.name}`);
      navigateTo('home');
      return;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'renter',
      avatar: IMAGES.avatarRaka,
      phone: '0812-3456-7890',
      city: 'Jakarta Selatan',
      bio: `Terhubung melalui akun ${provider}.`,
      ktpVerified: true,
      emailVerified: true,
      rating: 5.0,
      responseRate: '99% · Aktif',
      joinedAt: 'November 2026',
      lat: -6.25,
      lng: 106.81,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    showToast(`Berhasil masuk lewat ${provider}!`);
    navigateTo('home');
  };

  const registerAccount = (data: { name: string; email: string; role: 'renter' | 'owner' }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      avatar: data.role === 'owner' ? IMAGES.avatarNadia : IMAGES.avatarRaka,
      phone: '0812-1122-3344',
      city: 'Jakarta Selatan',
      bio:
        data.role === 'owner'
          ? 'Pemilik barang terverifikasi Gmail di PinjamKuy.'
          : 'Penyewa terverifikasi Gmail di PinjamKuy.',
      ktpVerified: false,
      emailVerified: true,
      rating: 5.0,
      responseRate: 'Baru bergabung',
      joinedAt: 'November 2026',
      lat: -6.255,
      lng: 106.805,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: newUser.id,
        type: 'system',
        title: 'Selamat Datang di PinjamKuy!',
        body: 'Email Gmail Anda berhasil diverifikasi. Lengkapi foto profil Anda di halaman Akun.',
        targetView: 'account',
        isRead: false,
        createdAt: 'Baru saja',
      },
      ...prev,
    ]);
    showToast('Pendaftaran & verifikasi Gmail berhasil!');
    navigateTo('home');
  };

  const logout = () => {
    setCurrentUserId(null);
    showToast('Anda telah keluar dari akun.');
    navigateTo('auth');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
    showToast('Profil berhasil diperbarui!');
  };

  const toggleFavorite = (itemId: string) => {
    if (!currentUser) {
      showToast('Silakan masuk terlebih dahulu untuk menyimpan favorit.');
      navigateTo('auth');
      return;
    }
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      showToast(exists ? 'Dihapus dari daftar favorit' : 'Barang disimpan ke favorit!');
      return next;
    });
  };

  const submitRental: AppContextValue['submitRental'] = ({
    item,
    quantity,
    startDate,
    endDate,
    totalDays,
    totalPrice,
    protectionFee,
    notes,
  }) => {
    if (!currentUser) {
      showToast('Silakan masuk terlebih dahulu untuk mengajukan sewa.');
      navigateTo('auth');
      return false;
    }
    if (quantity < 1 || quantity > item.stock) {
      showToast(`Jumlah sewa maksimal ${item.stock} unit.`);
      return false;
    }
    const owner = users.find((u) => u.id === item.ownerId);
    const newRental: RentalOrder = {
      id: `rent-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0],
      renterId: currentUser.id,
      renterName: currentUser.name,
      ownerId: item.ownerId,
      ownerName: owner?.name || 'Pemilik Barang',
      quantity,
      startDate,
      endDate,
      totalDays,
      pricePerDay: item.pricePerDay,
      protectionFee,
      totalPrice,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
    };
    setRentals((prev) => [newRental, ...prev]);
    // Notify owner AND renter
    const nowNotifs: AppNotification[] = [
      {
        id: `notif-owner-${Date.now()}`,
        userId: item.ownerId,
        type: 'rental_request',
        title: `Pengajuan Sewa Baru (${quantity} Unit)`,
        body: `${currentUser.name} ingin menyewa ${item.title} selama ${totalDays} hari.`,
        targetView: 'account',
        targetId: newRental.id,
        isRead: false,
        createdAt: 'Baru saja',
      },
      {
        id: `notif-renter-${Date.now() + 1}`,
        userId: currentUser.id,
        type: 'rental_status',
        title: 'Pengajuan Sewa Terkirim',
        body: `Permintaan sewa ${item.title} (${quantity} unit) telah dikirim ke ${owner?.name || 'Pemilik'}.`,
        targetView: 'account',
        targetId: newRental.id,
        isRead: false,
        createdAt: 'Baru saja',
      },
    ];
    setNotifications((prev) => [...nowNotifs, ...prev]);
    showToast('Pengajuan sewa berhasil dikirim ke pemilik barang!');
    return true;
  };

  const updateRentalStatus = (rentalId: string, status: RentalStatus) => {
    const target = rentals.find((r) => r.id === rentalId);
    if (!target) return;
    setRentals((prev) => prev.map((r) => (r.id === rentalId ? { ...r, status } : r)));
    const statusLabel =
      status === 'approved'
        ? 'disetujui'
        : status === 'rejected'
        ? 'ditolak'
        : status === 'completed'
        ? 'selesai'
        : 'dibatalkan';
    setNotifications((prev) => [
      {
        id: `notif-status-${Date.now()}`,
        userId: target.renterId,
        type: 'rental_status',
        title: `Sewa ${statusLabel.toUpperCase()}`,
        body: `Pengajuan sewa "${target.itemTitle}" telah ${statusLabel} oleh pemilik.`,
        targetView: 'account',
        targetId: rentalId,
        isRead: false,
        createdAt: 'Baru saja',
      },
      ...prev,
    ]);
    showToast(`Status pengajuan sewa diperbarui menjadi ${statusLabel}.`);
  };

  const addReview: AppContextValue['addReview'] = ({ itemId, rating, comment, photos }) => {
    if (!currentUser) {
      showToast('Masuk terlebih dahulu untuk menulis ulasan.');
      return;
    }
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      itemId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      photos,
      variantInfo: 'Penyewa Terverifikasi',
      createdAt: 'Baru saja',
    };
    setReviews((prev) => [newRev, ...prev]);
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const nextCount = it.reviewCount + 1;
        const nextRating = Math.round(((it.rating * it.reviewCount + rating) / nextCount) * 10) / 10;
        return { ...it, reviewCount: nextCount, rating: nextRating };
      })
    );
    showToast('Ulasan dan foto Anda berhasil dipublikasikan!');
  };

  const addItem: AppContextValue['addItem'] = (newItem) => {
    if (!currentUser) return;
    const item: ProductItem = {
      ...newItem,
      id: `item-${Date.now()}`,
      ownerId: currentUser.id,
      rating: 5.0,
      reviewCount: 0,
      rentedCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItems((prev) => [item, ...prev]);
    showToast('Barang baru berhasil ditambahkan ke katalog PinjamKuy!');
  };

  const updateItemStock = (itemId: string, stock: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, stock: Math.max(1, stock) } : it))
    );
    showToast('Stok unit barang diperbarui.');
  };

  const toggleItemApproval = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, isApproved: !it.isApproved } : it))
    );
    showToast('Status moderasi barang diperbarui.');
  };

  const verifyUserKtp = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ktpVerified: !u.ktpVerified } : u))
    );
    showToast('Status verifikasi KTP pengguna diperbarui.');
  };

  const openChatWithOwner = (ownerId: string, item?: ProductItem) => {
    if (!currentUser) {
      showToast('Silakan masuk terlebih dahulu untuk mengirim pesan ke pemilik.');
      navigateTo('auth');
      return;
    }
    if (ownerId === currentUser.id) {
      navigateTo('chat');
      return;
    }
    const existing = conversations.find(
      (c) =>
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(ownerId) &&
        (!item || c.itemId === item.id)
    );
    if (existing) {
      navigateTo('chat', { chatId: existing.id });
      return;
    }
    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      participantIds: [currentUser.id, ownerId],
      itemId: item?.id,
      itemTitle: item?.title,
      itemImage: item?.images[0],
      itemPrice: item?.pricePerDay,
      lastMessage: item ? `Menanyakan tentang ${item.title}` : 'Memulai percakapan',
      lastMessageAt: 'Baru saja',
    };
    setConversations((prev) => [newConv, ...prev]);
    navigateTo('chat', { chatId: newConv.id });
  };

  const sendMessage = (conversationId: string, content: string, imageUrl?: string) => {
    if (!currentUser || (!content.trim() && !imageUrl)) return;
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      content: content.trim(),
      imageUrl,
      createdAt: timeStr,
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: content.trim() || 'Mengirim foto', lastMessageAt: timeStr }
          : c
      )
    );
    const recipientId = conv.participantIds.find((id) => id !== currentUser.id);
    if (recipientId) {
      setNotifications((prev) => [
        {
          id: `notif-chat-${Date.now()}`,
          userId: recipientId,
          type: 'chat',
          title: `Chat masuk dari ${currentUser.name}`,
          body: content.trim() || 'Mengirim lampiran gambar',
          targetView: 'chat',
          targetId: conversationId,
          isRead: false,
          createdAt: 'Baru saja',
        },
        ...prev,
      ]);
    }
  };

  const simulateIncomingReply = (conversationId: string) => {
    if (!currentUser) return;
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;
    const otherId = conv.participantIds.find((id) => id !== currentUser.id) || 'user-owner-1';
    const otherUser = users.find((u) => u.id === otherId);
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const replyText =
      currentUser.role === 'owner'
        ? 'Baik kak, saya sudah isi pengajuan sewanya dan siap ambil di lokasi GPS ya!'
        : 'Halo kak! Barang masih tersedia dan siap disewakan. Mau ambil jam berapa?';

    const replyMsg: ChatMessage = {
      id: `msg-sim-${Date.now()}`,
      conversationId,
      senderId: otherId,
      content: replyText,
      createdAt: timeStr,
      isRead: false,
    };
    setMessages((prev) => [...prev, replyMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: replyText, lastMessageAt: timeStr }
          : c
      )
    );
    setNotifications((prev) => [
      {
        id: `notif-sim-${Date.now()}`,
        userId: currentUser.id,
        type: 'chat',
        title: `Pesan baru dari ${otherUser?.name || 'Pengguna'}`,
        body: replyText,
        targetView: 'chat',
        targetId: conversationId,
        isRead: false,
        createdAt: 'Baru saja',
      },
      ...prev,
    ]);
    showToast(`Notifikasi chat masuk dari ${otherUser?.name || 'Pengguna'}!`);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
    showToast('Semua notifikasi ditandai sudah dibaca.');
  };

  return (
    <AppContext.Provider
      value={{
        view,
        selectedItemId,
        activeChatId,
        footerPage,
        currentUser,
        users,
        items,
        reviews,
        favorites,
        rentals,
        conversations,
        messages,
        notifications,
        toastMessage,
        userCoords,
        setUserCoords,
        showToast,
        navigateTo,
        loginAsDemoRole,
        loginWithEmail,
        loginWithProvider,
        registerAccount,
        logout,
        updateProfile,
        toggleFavorite,
        submitRental,
        updateRentalStatus,
        addReview,
        addItem,
        updateItemStock,
        toggleItemApproval,
        verifyUserKtp,
        openChatWithOwner,
        sendMessage,
        simulateIncomingReply,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
