import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, PlusCircle } from 'lucide-react';
import { CATEGORIES, IMAGES } from '../data/seedData';
import { useApp } from '../context/AppContext';

export const AddItemPage: React.FC = () => {
  const { currentUser, addItem, navigateTo, showToast } = useApp();

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
        <h1 className="text-2xl font-bold text-slate-900">
          Masuk untuk Mulai Menyewakan Barang
        </h1>
        <p className="text-sm text-slate-600">
          Masuk atau daftar akun PinjamKuy terlebih dahulu agar barang yang Anda sewakan terhubung dengan akun dan lokasi Anda.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={() => navigateTo('auth')}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Masuk / Daftar Sekarang
          </button>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      showToast('Lengkapi nama barang dan deskripsi terlebih dahulu.');
      return;
    }

    const stockQty = Math.max(1, Number(newStock) || 1);
    addItem({
      title: newTitle.trim(),
      category: newCategory,
      pricePerDay: Math.max(10000, Number(newPrice) || 100000),
      stock: stockQty,
      depositAmount: Math.max(0, Number(newDeposit) || 0),
      description: newDesc.trim(),
      condition: 'Sangat Baik & Siap Pakai',
      completeness: ['Unit Utama', 'Aksesoris Standar', 'Tas / Kemasan'],
      specs: [
        { label: 'Kategori', value: newCategory },
        { label: 'Stok Tersedia', value: `${stockQty} Unit` },
      ],
      rentalTerms: newTermsText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      images: [newPhoto],
      city: newCity.trim() || 'Jakarta Selatan',
      district: newDistrict.trim() || 'Kemang',
      addressHint: `Area ${newDistrict.trim() || 'Kemang'}, ${newCity.trim() || 'Jakarta Selatan'}`,
      lat: currentUser.lat,
      lng: currentUser.lng,
    });

    navigateTo('home');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
            <PlusCircle className="w-4 h-4" />
            <span>Sewakan Barang Anda</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Tambah Barang Sewaan Baru
          </h1>
          <p className="text-sm text-slate-500">
            Isi informasi barang di bawah ini untuk langsung menayangkannya di katalog PinjamKuy.
          </p>
        </div>

        <form onSubmit={handleCreateItem} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Barang <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Kamera Mirrorless Fujifilm X-T5 + Lensa"
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {CATEGORIES.filter((c) => c.id !== 'Semua').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Harga Sewa / Hari (Rp)
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                min={10000}
                step={5000}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Stok Unit
                </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min={1}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deposit (Rp)
                </label>
                <input
                  type="number"
                  value={newDeposit}
                  onChange={(e) => setNewDeposit(e.target.value)}
                  min={0}
                  step={25000}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kota Lokasi
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kecamatan / Area Serah Terima
              </label>
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                placeholder="Contoh: Kemang / Dago / Menteng"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Deskripsi & Kelengkapan Barang <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Jelaskan kondisi fisik, kelengkapan unit, dan rekomendasi penggunaan..."
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Syarat Sewa (1 baris = 1 syarat)
              </label>
              <textarea
                rows={4}
                value={newTermsText}
                onChange={(e) => setNewTermsText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={newPhoto}
                alt="Preview foto barang"
                className="w-20 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Upload Foto Barang</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Terbitkan Barang
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
