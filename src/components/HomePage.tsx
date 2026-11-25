import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { CATEGORIES, IMAGES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatRupiah } from '../utils/format';

export const HomePage: React.FC = () => {
  const {
    items,
    users,
    favorites,
    currentUser,
    notifications,
    userCoords,
    setUserCoords,
    toggleFavorite,
    navigateTo,
    markNotificationRead,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'rating'>('newest');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const cities = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.city)));
    return ['Semua Kota', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items
      .filter((it) => it.isApproved)
      .filter((it) => {
        if (selectedCategory !== 'Semua' && it.category !== selectedCategory) return false;
        if (selectedCity !== 'Semua Kota' && it.city !== selectedCity) return false;
        if (
          q &&
          !it.title.toLowerCase().includes(q) &&
          !it.category.toLowerCase().includes(q) &&
          !it.city.toLowerCase().includes(q) &&
          !it.district.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [items, searchQuery, selectedCategory, selectedCity, sortBy]);

  const ITEMS_PER_SLIDE = 8;
  const itemSlides = useMemo(() => {
    const chunks: (typeof filteredItems)[] = [];
    for (let i = 0; i < filteredItems.length; i += ITEMS_PER_SLIDE) {
      chunks.push(filteredItems.slice(i, i + ITEMS_PER_SLIDE));
    }
    return chunks;
  }, [filteredItems]);

  useEffect(() => {
    setCurrentSlide(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0 });
    }
  }, [searchQuery, selectedCategory, selectedCity, sortBy, filteredItems.length]);

  const goToSlide = (index: number) => {
    const el = sliderRef.current;
    if (!el || itemSlides.length === 0) return;
    const clamped = Math.max(0, Math.min(index, itemSlides.length - 1));
    setCurrentSlide(clamped);
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: 'smooth',
    });
  };

  const handleSliderScroll = () => {
    const el = sliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== currentSlide && idx >= 0 && idx < itemSlides.length) {
      setCurrentSlide(idx);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || itemSlides.length <= 1) return;
    const el = sliderRef.current;
    if (!el) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.isDown) return;
    const el = sliderRef.current;
    if (!el) return;
    const deltaX = e.clientX - drag.startX;
    if (Math.abs(deltaX) > 6) {
      drag.moved = true;
    }
    if (drag.moved) {
      el.scrollLeft = drag.scrollLeft - deltaX;
    }
  };

  const handlePointerEnd = () => {
    const drag = dragStateRef.current;
    if (!drag.isDown) return;
    drag.isDown = false;
    const el = sliderRef.current;
    if (el && drag.moved && el.clientWidth > 0) {
      const targetSlide = Math.round(el.scrollLeft / el.clientWidth);
      goToSlide(targetSlide);
      setTimeout(() => {
        dragStateRef.current.moved = false;
      }, 50);
    }
  };

  const unreadNotifications = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.isRead)
    : [];

  const handleDetectMyGps = () => {
    if (!navigator.geolocation) {
      setUserCoords({ lat: -6.2442, lng: 106.7995 });
      showToast('Menggunakan lokasi simulasi Jakarta Selatan.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast('Lokasi GPS Anda terdeteksi! Jarak barang diperbarui.');
      },
      () => {
        setUserCoords({ lat: -6.2442, lng: 106.7995 });
        showToast('Izin GPS tidak aktif — menggunakan titik Jakarta Selatan.');
      },
      { timeout: 6000 }
    );
  };

  return (
    <div className="space-y-12 pb-8">
      {/* Live Notification Strip on Homepage */}
      {currentUser && unreadNotifications.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Bell className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-800 truncate">
                <span className="font-semibold text-blue-700">
                  Notifikasi Baru ({unreadNotifications.length}):
                </span>{' '}
                {unreadNotifications[0].title} — {unreadNotifications[0].body}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const first = unreadNotifications[0];
                  markNotificationRead(first.id);
                  navigateTo(first.targetView, {
                    chatId: first.type === 'chat' ? first.targetId : undefined,
                  });
                }}
                className="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap"
              >
                Buka Sekarang
              </button>
              <button
                type="button"
                onClick={() => navigateTo('notifications')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
              >
                Semua Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Split Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-blue-600">
                Marketplace Sewa P2P Terverifikasi
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Pinjam Barang Apa Saja dari Pemilik Terpercaya di Sekitarmu
              </h1>
              <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                Tidak perlu membeli barang mahal yang hanya dipakai sesekali. Sewa kamera, drone, perkakas, hingga tenda camping harian dengan lokasi GPS akurat dan ulasan foto asli.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kamera Sony, drone, bor listrik, tenda..."
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <div className="sm:border-l border-slate-200 sm:pl-3 flex items-center gap-2 px-3 py-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="text-sm text-slate-700 font-medium bg-transparent focus:outline-none pr-2"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleDetectMyGps}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                Cek GPS Terdekat
              </button>
            </div>

            {/* Clean Unboxed Trust Line */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verifikasi KTP & Gmail
              </span>
              <span aria-hidden="true">·</span>
              <span>Lokasi GPS Real-Time</span>
              <span aria-hidden="true">·</span>
              <span>Chat Langsung Pemilik</span>
            </div>
          </div>

          {/* Right Hero Photography */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={IMAGES.hero}
                alt="Peralatan kreatif siap sewa di PinjamKuy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/15 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-medium text-blue-200 mb-1">
                  Hemat hingga 85% dibanding membeli baru
                </p>
                <p className="text-base font-bold leading-snug">
                  Semua barang dicek kondisinya dan dilengkapi foto ulasan penyewa asli.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Photo Category Selector (Zero Emoji) */}
      <section className="border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Kategori Pilihan
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Pilih kategori berdasarkan foto barang aslinya
              </p>
            </div>
            {selectedCategory !== 'Semua' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('Semua')}
                className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
              >
                Reset Kategori
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group text-left rounded-xl overflow-hidden border transition-all duration-200 ${
                    active
                      ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <p
                      className={`text-xs font-semibold leading-tight line-clamp-2 ${
                        active ? 'text-blue-700' : 'text-slate-800'
                      }`}
                    >
                      {cat.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Available Items Grid ("Barang Tersedia") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Barang Tersedia ({filteredItems.length})
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Klik barang untuk melihat deskripsi, syarat sewa, lokasi GPS, dan ulasan foto
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-medium text-slate-500">Urutkan:</span>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              {[
                { id: 'newest', label: 'Terbaru' },
                { id: 'price-asc', label: 'Termurah' },
                { id: 'rating', label: 'Rating' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id as typeof sortBy)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    sortBy === opt.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-base font-semibold text-slate-900">
              Barang tidak ditemukan
            </p>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Coba ubah kata kunci pencarian atau pilih kategori lain.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setSelectedCity('Semua Kota');
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Tampilkan Semua Barang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              ref={sliderRef}
              onScroll={handleSliderScroll}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
              onClickCapture={(e) => {
                if (dragStateRef.current.moved) {
                  e.preventDefault();
                  e.stopPropagation();
                  dragStateRef.current.moved = false;
                }
              }}
              className={`flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                itemSlides.length > 1 ? 'cursor-grab active:cursor-grabbing select-none' : ''
              }`}
            >
              {itemSlides.map((slideItems, slideIdx) => (
                <div
                  key={slideIdx}
                  className="w-full shrink-0 snap-start grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4"
                >
                  {slideItems.map((item) => {
                    const owner = users.find((u) => u.id === item.ownerId);
                    const isFav = favorites.includes(item.id);
                    const distanceKm = userCoords
                      ? calculateDistanceKm(userCoords.lat, userCoords.lng, item.lat, item.lng)
                      : null;

                    return (
                      <article
                        key={item.id}
                        className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {/* Product Photo + Favorite Button */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => navigateTo('product-detail', { itemId: item.id })}
                            className="w-full h-full block focus:outline-none"
                          >
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              draggable={false}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            aria-label={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                              isFav
                                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                                : 'bg-white/90 border-slate-200 text-slate-600 hover:text-orange-600'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                          <div className="space-y-1.5">
                            {/* Clean Unboxed Metadata */}
                            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                              <span className="font-medium text-blue-600 truncate max-w-[110px]">
                                {item.category}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{item.city}</span>
                              {distanceKm !== null && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="tabular-nums text-slate-700 font-medium">
                                    {distanceKm} km
                                  </span>
                                </>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => navigateTo('product-detail', { itemId: item.id })}
                              className="text-left block"
                            >
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {item.title}
                              </h3>
                            </button>

                            {/* Rating & Owner Row */}
                            <div className="flex items-center justify-between pt-0.5 gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {owner && (
                                  <>
                                    <img
                                      src={owner.avatar}
                                      alt={owner.name}
                                      referrerPolicy="no-referrer"
                                      draggable={false}
                                      className="w-4 h-4 rounded-full object-cover shrink-0"
                                    />
                                    <span className="text-[11px] text-slate-600 truncate">
                                      {owner.name}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 shrink-0 tabular-nums">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span>{item.rating}</span>
                                <span className="text-slate-400 font-normal">
                                  ({item.reviewCount})
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                                {formatRupiah(item.pricePerDay)}
                              </span>
                              <span className="text-[11px] text-slate-500"> / hari</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigateTo('product-detail', { itemId: item.id })}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                            >
                              <span>Detail</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>

            {itemSlides.length > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-xs text-slate-500">
                  Geser ke samping untuk melihat barang lainnya ({currentSlide + 1} / {itemSlides.length})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToSlide(currentSlide - 1)}
                    disabled={currentSlide === 0}
                    aria-label="Slide sebelumnya"
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5 px-1">
                    {itemSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`Halaman produk ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          currentSlide === idx
                            ? 'w-5 bg-blue-600'
                            : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goToSlide(currentSlide + 1)}
                    disabled={currentSlide === itemSlides.length - 1}
                    aria-label="Slide berikutnya"
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3-Step Safe Rental Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-semibold text-blue-600">
                Panduan Sewa Aman
              </p>
              <h2
                className="text-xl sm:text-2xl font-bold text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Cara Menyewa Barang di Sekitarmu dalam 3 Langkah
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Proses sewa dibuat sederhana dan transparan agar penyewa dan pemilik barang sama-sama tenang.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo('info', { footerPage: 'how-it-works' })}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap shrink-0"
              >
                <span>Detail Cara Kerja</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('info', { footerPage: 'safety' })}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:underline whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Aturan Keamanan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-slate-200">
            <div className="md:pr-8 space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                01. Cari Barang & Cek Jarak GPS
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gunakan filter kategori, kota, atau aktifkan GPS untuk menemukan barang terdekat dan membandingkan harga sewa harian.
              </p>
            </div>

            <div className="md:px-8 space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                02. Chat Pemilik & Ajukan Tanggal
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tanyakan kelengkapan unit dan titik serah terima lewat chat langsung, lalu kirim pengajuan tanggal sewa yang dibutuhkan.
              </p>
            </div>

            <div className="md:pl-8 space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                03. Serah Terima & Beri Ulasan
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Periksa kondisi barang bersama pemilik saat serah terima, dan bagikan ulasan foto setelah pengembalian selesai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
