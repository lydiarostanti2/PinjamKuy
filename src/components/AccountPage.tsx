import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Heart,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { CATEGORIES, IMAGES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { formatRupiah } from '../utils/format';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    users,
    items,
    favorites,
    rentals,
    navigateTo,
    updateProfile,
    loginAsDemoRole,
    updateRentalStatus,
    addItem,
    updateItemStock,
    toggleFavorite,
    verifyUserKtp,
    toggleItemApproval,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'my-rentals' | 'owner-items' | 'favorites' | 'admin'
  >(() => {
    if (currentUser?.role === 'owner') return 'owner-items';
    if (currentUser?.role === 'admin') return 'admin';
    return 'profile';
  });

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Add New Item Form State (Owner)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Kamera & Lensa');
  const [newPrice, setNewPrice] = useState('120000');
  const [newStock, setNewStock] = useState('2');
  const [newDeposit, setNewDeposit] = useState('200000');
  const [newCity, setNewCity] = useState(currentUser?.city || 'Jakarta Selatan');
  const [newDistrict, setNewDistrict] = useState('Kemang');
  const [newDesc, setNewDesc] = useState('');
  const [newTermsText, setNewTermsText] = useState(
    'Wajib akun terverifikasi KTP.\nBarang dikembalikan dalam kondisi bersih dan lengkap.'
  );
  const [newPhoto, setNewPhoto] = useState<string>(IMAGES.camera);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Anda Belum Masuk</h1>
        <p className="text-sm text-slate-600">
          Masuk atau daftar akun PinjamKuy untuk mengelola foto profil, sewaan, barang, dan favorit Anda.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('auth')}
          className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          Masuk / Daftar Sekarang
        </button>
      </div>
    );
  }

  const myRentals = rentals.filter((r) => r.renterId === currentUser.id);
  const incomingRentals = rentals.filter((r) => r.ownerId === currentUser.id);
  const myItems = items.filter((i) => i.ownerId === currentUser.id);
  const favItems = items.filter((i) => favorites.includes(i.id));

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfile({ avatar: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNewItemPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, city, bio });
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      showToast('Lengkapi nama barang dan deskripsi terlebih dahulu.');
      return;
    }
    addItem({
      title: newTitle.trim(),
      category: newCategory,
      pricePerDay: Number(newPrice) || 100000,
      stock: Math.max(1, Number(newStock) || 1),
      depositAmount: Number(newDeposit) || 0,
      description: newDesc.trim(),
      condition: 'Sangat Baik & Siap Pakai',
      completeness: ['Unit Utama', 'Aksesoris Standar', 'Tas / Kemasan'],
      specs: [
        { label: 'Kategori', value: newCategory },
        { label: 'Stok Tersedia', value: `${Math.max(1, Number(newStock) || 1)} Unit` },
      ],
      rentalTerms: newTermsText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      images: [newPhoto],
      city: newCity.trim() || 'Jakarta Selatan',
      district: newDistrict.trim() || 'Kemang',
      addressHint: `Area ${newDistrict}, ${newCity}`,
      lat: currentUser.lat,
      lng: currentUser.lng,
    });
    setShowAddForm(false);
    setNewTitle('');
    setNewDesc('');
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: 'Menunggu Konfirmasi', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
      approved: { label: 'Disetujui · Sedang Berjalan', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      completed: { label: 'Selesai', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
      rejected: { label: 'Ditolak', cls: 'bg-red-50 text-red-700 border-red-200' },
      cancelled: { label: 'Dibatalkan', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
    };
    const cfg = map[status] || map.pending;
    return (
      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold border rounded-lg ${cfg.cls}`}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Header Card with Photo Upload */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-200 bg-slate-100"
            />
            <label
              title="Upload Foto Profil Baru"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer shadow-md border-2 border-white"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h1>
              {currentUser.ktpVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Terverifikasi KTP
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {currentUser.email} · {currentUser.city}
            </p>
            <p className="text-xs font-semibold text-orange-600">
              Peran Aktif:{' '}
              {currentUser.role === 'renter'
                ? 'Penyewa'
                : currentUser.role === 'owner'
                ? 'Pemilik Barang'
                : 'Admin Platform'}
            </p>
          </div>
        </div>

        {/* Role Switcher Quick Controls */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <p className="text-[11px] font-semibold text-slate-500">
            Simulasi Ganti Peran Akun:
          </p>
          <div className="flex items-center gap-1.5">
            {(['renter', 'owner', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  loginAsDemoRole(role);
                  setActiveTab(
                    role === 'owner' ? 'owner-items' : role === 'admin' ? 'admin' : 'my-rentals'
                  );
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  currentUser.role === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {role === 'renter' ? 'Penyewa' : role === 'owner' ? 'Pemilik' : 'Admin'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'profile', label: 'Profil & Foto', icon: UserCheck },
          { id: 'my-rentals', label: `Sewaan Saya (${myRentals.length})`, icon: ShoppingBag },
          {
            id: 'owner-items',
            label: `Barang & Pesanan Masuk (${myItems.length})`,
            icon: Package,
          },
          { id: 'favorites', label: `Favorit (${favItems.length})`, icon: Heart },
          ...(currentUser.role === 'admin'
            ? [{ id: 'admin', label: 'Panel Admin', icon: ShieldCheck }]
            : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE & PHOTO UPLOAD */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Profil & Foto Akun</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unggah foto profil Anda agar pemilik atau penyewa lebih percaya saat serah terima barang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-slate-300"
            />
            <div className="space-y-1.5">
              <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Pilih & Upload Foto Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500">Format JPG, PNG, atau WebP.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kota Domisili
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio Singkat
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: MY RENTALS (RENTER) */}
      {activeTab === 'my-rentals' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Daftar Pengajuan & Riwayat Sewaan</h2>
          {myRentals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <p className="text-sm text-slate-600">Anda belum memiliki pengajuan sewa.</p>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
              >
                Cari Barang untuk Disewa
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRentals.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={r.itemImage}
                      alt={r.itemTitle}
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {statusBadge(r.status)}
                        <span className="text-xs text-slate-500 tabular-nums">
                          {r.quantity} Unit · {r.totalDays} Hari ({r.startDate} s/d {r.endDate})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateTo('product-detail', { itemId: r.itemId })}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 text-left"
                      >
                        {r.itemTitle}
                      </button>
                      <p className="text-xs text-slate-500">Pemilik: {r.ownerName}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <p className="text-base font-extrabold text-slate-900 tabular-nums">
                      {formatRupiah(r.totalPrice)}
                    </p>
                    {r.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => updateRentalStatus(r.id, 'cancelled')}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Batalkan Pengajuan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OWNER ITEMS & INCOMING REQUESTS */}
      {activeTab === 'owner-items' && (
        <div className="space-y-8">
          {/* Incoming Rental Requests */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Permintaan Sewa Masuk ({incomingRentals.length})
            </h2>
            {incomingRentals.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm text-slate-500">
                Belum ada penyewa yang mengajukan sewa pada barang Anda.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRentals.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={r.itemImage}
                        alt={r.itemTitle}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {statusBadge(r.status)}
                          <span className="text-xs font-semibold text-slate-700 tabular-nums">
                            {r.quantity} Unit · {r.totalDays} Hari
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{r.itemTitle}</p>
                        <p className="text-xs text-slate-600">
                          Penyewa: <span className="font-semibold">{r.renterName}</span> ·{' '}
                          {r.startDate} – {r.endDate}
                        </p>
                        {r.notes && (
                          <p className="text-xs text-slate-500 italic">Catatan: "{r.notes}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 mr-2 tabular-nums">
                        {formatRupiah(r.totalPrice)}
                      </span>
                      {r.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateRentalStatus(r.id, 'approved')}
                            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateRentalStatus(r.id, 'rejected')}
                            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => updateRentalStatus(r.id, 'completed')}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                        >
                          Tandai Barang Kembali
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Listed Items + Add New Item */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                Barang Saya yang Disewakan ({myItems.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm((p) => !p)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Barang Baru</span>
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleCreateItem}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
              >
                <h3 className="text-base font-bold text-slate-900">
                  Pasang Iklan Barang Sewaan Baru
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Barang *
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Contoh: Mesin Espresso Portable + Grinder"
                      required
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm bg-white"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'Semua').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Harga Sewa / Hari (Rp)
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      min={10000}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jumlah Unit Dimiliki (Stok)
                    </label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      min={1}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kota Lokasi GPS
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kecamatan / Area
                    </label>
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Keterangan Barang *
                    </label>
                    <textarea
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Jelaskan kondisi, fitur, dan kelengkapan..."
                      required
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Syarat Sewa (1 baris = 1 syarat)
                    </label>
                    <textarea
                      rows={3}
                      value={newTermsText}
                      onChange={(e) => setNewTermsText(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={newPhoto}
                      alt="Preview barang"
                      className="w-14 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span>Upload Foto Barang</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewItemPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      Terbitkan Barang
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myItems.map((it) => (
                <div
                  key={it.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={it.images[0]}
                      alt={it.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateTo('product-detail', { itemId: it.id })}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 truncate block text-left"
                      >
                        {it.title}
                      </button>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {formatRupiah(it.pricePerDay)} / hari · {it.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[11px] text-slate-500">Stok:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={it.stock}
                      onChange={(e) => updateItemStock(it.id, Number(e.target.value))}
                      className="w-14 text-center text-xs font-bold border border-slate-300 rounded-lg py-1.5 tabular-nums"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Barang Favorit Tersimpan ({favItems.length})
          </h2>
          {favItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <p className="text-sm text-slate-500">Belum ada barang yang disimpan ke favorit.</p>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favItems.map((it) => (
                <div
                  key={it.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col"
                >
                  <img
                    src={it.images[0]}
                    alt={it.title}
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover cursor-pointer"
                    onClick={() => navigateTo('product-detail', { itemId: it.id })}
                  />
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">{it.category}</p>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                        {it.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                        {formatRupiah(it.pricePerDay)}/hari
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(it.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ADMIN PLATFORM PANEL */}
      {activeTab === 'admin' && currentUser.role === 'admin' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 font-medium">Total Pengguna</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {users.length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 font-medium">Barang Aktif di Katalog</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums">
                {items.filter((i) => i.isApproved).length} / {items.length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-500 font-medium">Total Transaksi Sewa</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {rentals.length}
              </p>
            </div>
          </div>

          {/* KTP User Verification Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Moderasi Verifikasi KTP Pengguna
            </h3>
            <div className="divide-y divide-slate-100">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">
                        {u.email} · {u.role}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => verifyUserKtp(u.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border ${
                      u.ktpVerified
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {u.ktpVerified ? 'KTP Terverifikasi (Klik Cabut)' : 'Verifikasi KTP Sekarang'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Item Catalog Moderation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Moderasi Katalog Barang</h3>
            <div className="divide-y divide-slate-100">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={it.images[0]}
                      alt={it.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{it.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {it.city} · {formatRupiah(it.pricePerDay)}/hari
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleItemApproval(it.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border ${
                      it.isApproved
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {it.isApproved ? 'Tayang Aktif (Nonaktifkan)' : 'Disembunyikan (Tayangkan)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
