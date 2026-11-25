import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Heart,
  MapPin,
  MessageSquare,
  Minus,
  Navigation,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDays, calculateDistanceKm, formatRupiah } from '../utils/format';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedItemId,
    items,
    users,
    reviews,
    favorites,
    currentUser,
    userCoords,
    setUserCoords,
    toggleFavorite,
    submitRental,
    addReview,
    openChatWithOwner,
    navigateTo,
    showToast,
  } = useApp();

  const item = items.find((i) => i.id === selectedItemId) || items[0];
  const owner = users.find((u) => u.id === item.ownerId);
  const itemReviews = useMemo(
    () => reviews.filter((r) => r.itemId === item.id),
    [reviews, item.id]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('2026-11-28');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [notes, setNotes] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'with-photo' | '5-star'>('all');
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewPhotos, setNewReviewPhotos] = useState<string[]>([]);

  const isFav = favorites.includes(item.id);
  const totalDays = calculateDays(startDate, endDate);
  const baseRent = item.pricePerDay * totalDays * quantity;
  const protectionFee = Math.round(baseRent * 0.05);
  const totalPrice = baseRent + protectionFee;

  const shareUrl = `${window.location.origin}/?item=${item.id}`;

  const distanceKm = userCoords
    ? calculateDistanceKm(userCoords.lat, userCoords.lng, item.lat, item.lng)
    : null;

  const filteredReviews = useMemo(() => {
    return itemReviews.filter((r) => {
      if (reviewFilter === 'with-photo') return r.photos.length > 0;
      if (reviewFilter === '5-star') return r.rating === 5;
      return true;
    });
  }, [itemReviews, reviewFilter]);

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Link produk disalin ke clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Salin link dari kotak URL yang tersedia.');
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setUserCoords({ lat: -6.2442, lng: 106.7995 });
      showToast('GPS browser tidak tersedia; menggunakan titik Jakarta Selatan.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast('Titik GPS Anda berhasil diperbarui!');
      },
      () => {
        setUserCoords({ lat: -6.2442, lng: 106.7995 });
        showToast('Izin lokasi ditolak; menggunakan titik simulasi Jakarta Selatan.');
      },
      { timeout: 6000 }
    );
  };

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files)
      .slice(0, 3)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setNewReviewPhotos((prev) => [...prev, reader.result as string].slice(0, 4));
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Tulis komentar ulasan terlebih dahulu.');
      return;
    }
    addReview({
      itemId: item.id,
      rating: newRating,
      comment: newComment.trim(),
      photos: newReviewPhotos,
    });
    setNewComment('');
    setNewReviewPhotos([]);
    setShowReviewForm(false);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = submitRental({
      item,
      quantity,
      startDate,
      endDate,
      totalDays,
      totalPrice,
      protectionFee,
      notes,
    });
    if (ok) {
      setBookingSuccess(true);
      setNotes('');
    }
  };

  // Bounding box for OpenStreetMap Embed
  const bbox = `${item.lng - 0.012}%2C${item.lat - 0.008}%2C${item.lng + 0.012}%2C${item.lat + 0.008}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Breadcrumb + Share & Favorite Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Barang</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Bagikan Link</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold border rounded-xl transition-colors ${
              isFav
                ? 'bg-orange-600 border-orange-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:text-orange-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Tersimpan di Favorit' : 'Simpan Favorit'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Gallery, Combined Description + Terms, GPS Map, Shopee-Style Photo Reviews */}
        <div className="lg:col-span-7 space-y-8">
          {/* Product Gallery */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-3 sm:p-4 space-y-3">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={item.images[activeImage] || item.images[0]}
                alt={item.title}
                referrerPolicy="no-referrer"
                onClick={() => setZoomPhoto(item.images[activeImage] || item.images[0])}
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === idx
                        ? 'border-blue-600 ring-2 ring-blue-600/20'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${item.title} ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unified Side-by-Side: Syarat Sewa & Keterangan Barang (In One Module) */}
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Informasi Lengkap Produk & Aturan Penyewaan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Syarat sewa dan keterangan barang ditampilkan berdampingan agar mudah dibaca sebelum menyewa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Left Half: Syarat Sewa */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">Syarat Sewa</h3>
                </div>
                <ul className="space-y-3">
                  {item.rentalTerms.map((term, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Deposit Keamanan:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatRupiah(item.depositAmount)}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Deposit dikembalikan 100% setelah barang kembali dalam kondisi baik.
                  </p>
                </div>
              </div>

              {/* Right Half: Keterangan Barang */}
              <div className="p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Keterangan Barang</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-900">Kondisi & Kelengkapan:</p>
                  <p className="text-xs font-medium text-blue-700">{item.condition}</p>
                  <ul className="space-y-1.5">
                    {item.completeness.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-xs font-semibold text-slate-900">Spesifikasi Teknis:</p>
                  <dl className="space-y-1.5 text-xs">
                    {item.specs.map((sp, idx) => (
                      <div key={idx} className="flex justify-between gap-3">
                        <dt className="text-slate-500">{sp.label}</dt>
                        <dd className="text-slate-900 font-medium text-right">{sp.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive GPS Location Section */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Lokasi GPS Pengambilan Barang</span>
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {item.district}, {item.city} · {item.addressHint}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDetectGps}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Cek Jarak dari GPS Saya</span>
              </button>
            </div>

            {/* Coordinate Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Compass className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Koordinat GPS:</span>
                <span className="font-mono-data font-semibold text-slate-900">
                  {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                </span>
              </div>
              {distanceKm !== null && (
                <div className="text-blue-700 font-semibold tabular-nums">
                  Estimasi jarak dari lokasi Anda: {distanceKm} km
                </div>
              )}
              <a
                href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto font-semibold text-blue-600 hover:underline"
              >
                Buka di Google Maps
              </a>
            </div>

            {/* Embedded Live Map + GPS Pin Overlay */}
            <div className="relative h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title={`Lokasi GPS ${item.title}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${item.lat}%2C${item.lng}`}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-xs">
                <p className="font-bold text-slate-900">Titik Serah Terima · {item.district}</p>
                <p className="text-slate-500">Alamat detail dikirim via Chat setelah konfirmasi</p>
              </div>
            </div>
          </section>

          {/* Shopee-Style Customer Reviews with Photos */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Ulasan Penyewa ({itemReviews.length})
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                      {item.rating}
                    </span>
                    <span className="text-sm text-slate-500">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(item.rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {[
                    { id: 'all', label: `Semua (${itemReviews.length})` },
                    {
                      id: 'with-photo',
                      label: `Dengan Foto (${itemReviews.filter((r) => r.photos.length > 0).length})`,
                    },
                    {
                      id: '5-star',
                      label: `5 Bintang (${itemReviews.filter((r) => r.rating === 5).length})`,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setReviewFilter(tab.id as typeof reviewFilter)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                        reviewFilter === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {currentUser && (
                  <button
                    type="button"
                    onClick={() => setShowReviewForm((p) => !p)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Tulis Ulasan
                  </button>
                )}
              </div>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">Bagikan Pengalaman Sewa Anda</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritakan kondisi barang, ketepatan waktu pemilik, dan kelengkapannya..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Upload Foto Ulasan</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReviewPhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      Kirim Ulasan
                    </button>
                  </div>
                </div>
                {newReviewPhotos.length > 0 && (
                  <div className="flex items-center gap-2">
                    {newReviewPhotos.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Preview ulasan"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                )}
              </form>
            )}

            {/* Review List */}
            {filteredReviews.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                Belum ada ulasan pada filter ini.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-5">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} className="pt-5 first:pt-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover bg-slate-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{rev.userName}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span aria-hidden="true">·</span>
                            <span>{rev.createdAt}</span>
                            {rev.variantInfo && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{rev.variantInfo}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">{rev.comment}</p>

                    {/* Shopee-Style Review Photo Thumbnails */}
                    {rev.photos.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {rev.photos.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setZoomPhoto(photo)}
                            className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <img
                              src={photo}
                              alt={`Foto ulasan ${rev.userName}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Booking Module & Owner Info */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            {/* Header Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-600">{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>{item.city}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Disewa {item.rentedCount} kali</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {item.title}
              </h1>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {formatRupiah(item.pricePerDay)}
                </span>
                <span className="text-sm text-slate-500">/ hari</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Pengajuan Sewa Berhasil Dikirim!
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Notifikasi telah dikirim ke {owner?.name}. Anda dapat memantau status di halaman Akun atau langsung chat pemilik.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('account')}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Lihat Status Sewaan
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingSuccess(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg"
                  >
                    Sewa Lagi
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Kembali
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Quantity Stepper Bounded by Owner Stock */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Jumlah Barang</p>
                    <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {item.stock === 1
                        ? 'Stok pemilik hanya 1 unit (maksimal 1)'
                        : `Tersedia ${item.stock} unit dari pemilik`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Kurangi jumlah barang"
                      className="w-9 h-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(item.stock, q + 1))}
                      disabled={quantity >= item.stock}
                      aria-label="Tambah jumlah barang"
                      className="w-9 h-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan untuk Pemilik (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Rencana ambil jam 09.00 pagi"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span className="tabular-nums">
                      {formatRupiah(item.pricePerDay)} × {totalDays} hari × {quantity} unit
                    </span>
                    <span className="font-medium text-slate-900 tabular-nums">
                      {formatRupiah(baseRent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Perlindungan PinjamKuy (5%)</span>
                    <span className="font-medium text-slate-900 tabular-nums">
                      {formatRupiah(protectionFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-base font-extrabold text-slate-900">
                    <span>Total Estimasi Sewa</span>
                    <span className="text-blue-600 tabular-nums">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    Ajukan Sewa Sekarang
                  </button>
                  {owner && (
                    <button
                      type="button"
                      onClick={() => openChatWithOwner(owner.id, item)}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>Chat Pemilik ({owner.name})</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Owner Trust Card */}
          {owner && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 truncate">{owner.name}</p>
                    {owner.ktpVerified && (
                      <ShieldCheck
                        className="w-4 h-4 text-blue-600 shrink-0"
                        aria-label="Terverifikasi KTP"
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {owner.city} · Respon {owner.responseRate}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 tabular-nums">
                    Rating Pemilik: {owner.rating} / 5.0
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openChatWithOwner(owner.id, item)}
                className="px-3.5 py-2 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl whitespace-nowrap shrink-0"
              >
                Tanya
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Share Product Link Modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Bagikan Produk Ini</h3>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Salin tautan produk ini untuk dibagikan ke teman atau rekan kerja Anda:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-xs font-mono-data bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800"
              />
              <button
                type="button"
                onClick={handleCopyShare}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl whitespace-nowrap"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4"
          onClick={() => setZoomPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setZoomPhoto(null)}
            className="absolute top-4 right-4 p-2 text-white bg-white/10 hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomPhoto}
            alt="Tampilan penuh"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};
