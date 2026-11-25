import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Lock,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { IMAGES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { FooterPageId } from '../types';

export const InfoPages: React.FC = () => {
  const { footerPage, navigateTo } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs: { id: FooterPageId; label: string }[] = [
    { id: 'about', label: 'Tentang Kami' },
    { id: 'how-it-works', label: 'Cara Kerja' },
    { id: 'safety', label: 'Keamanan' },
    { id: 'faq', label: 'Pusat Bantuan' },
    { id: 'terms', label: 'Syarat & Ketentuan' },
    { id: 'privacy', label: 'Privasi' },
  ];

  const faqs = [
    {
      q: 'Bagaimana jika barang rusak atau hilang saat disewa?',
      a: 'Setiap transaksi dilindungi deposit keamanan dan catatan kondisi foto sebelum serah terima. PinjamKuy Protect membantu mediasi serta penggantian biaya perbaikan wajar.',
    },
    {
      q: 'Apakah saya harus bertemu langsung untuk mengambil barang?',
      a: 'Anda dapat memilih serah terima langsung di titik GPS yang disepakati melalui Chat atau menggunakan kurir instan sesuai kesepakatan dengan pemilik.',
    },
    {
      q: 'Bagaimana cara pemilik menentukan jumlah barang yang bisa disewa?',
      a: 'Di halaman Akun -> Barang Saya, pemilik dapat mengisi jumlah stok unit yang dimiliki (misal 1 unit atau 3 unit). Penyewa tidak akan bisa memesan melebihi batas stok tersebut.',
    },
    {
      q: 'Kapan deposit keamanan saya dikembalikan?',
      a: 'Deposit dikembalikan penuh 100% segera setelah pemilik menandai barang kembali dalam kondisi baik di aplikasi.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sub-navigation across footer topics */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => navigateTo('info', { footerPage: t.id })}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
              footerPage === t.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ABOUT PAGE */}
      {footerPage === 'about' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-4">
              <p className="text-xs font-semibold text-blue-600">Tentang PinjamKuy Indonesia</p>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Akses Tanpa Harus Memiliki: Ekonomi Berbagi untuk Semua
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Banyak kamera, bor listrik, tenda, dan proyektor di rumah hanya dipakai 2–3 kali setahun. PinjamKuy menghubungkan pemilik barang dengan tetangga terdekat yang membutuhkan secara aman, cepat, dan hemat biaya.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xl font-extrabold text-blue-600 tabular-nums">85%</p>
                  <p className="text-xs text-slate-500">Lebih Hemat dari Beli Baru</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 tabular-nums">100%</p>
                  <p className="text-xs text-slate-500">Verifikasi Gmail & KTP</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-orange-600 tabular-nums">24 Jam</p>
                  <p className="text-xs text-slate-500">Hitungan Sewa Fleksibel</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 min-h-[260px]">
              <img
                src={IMAGES.hero}
                alt="Komunitas PinjamKuy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Comparison Cards: Beli Baru vs Sewa di PinjamKuy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Untuk Penyewa Cerdas</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pakai kamera Sony A7 III atau bor cordless terbaik tanpa harus keluar belasan juta rupiah dan pusing memikirkan biaya perawatan di gudang.
              </p>
            </div>
            <div className="bg-blue-600 text-white rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-bold">Untuk Pemilik Barang</h2>
              <p className="text-sm text-blue-100 leading-relaxed">
                Ubah barang yang jarang dipakai menjadi penghasilan pasif mingguan dengan kontrol penuh atas stok, harga harian, syarat sewa, dan lokasi serah terima.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HOW IT WORKS PAGE */}
      {footerPage === 'how-it-works' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Cara Kerja Sewa di PinjamKuy
            </h1>
            <p className="text-sm text-slate-600">
              Empat langkah sederhana dari pencarian lokasi GPS hingga pengembalian barang yang aman.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Cari & Cek GPS',
                desc: 'Temukan barang yang Anda butuhkan dan cek jaraknya dari titik GPS Anda saat ini.',
              },
              {
                step: '02',
                icon: MessageSquare,
                title: 'Chat & Ajukan Sewa',
                desc: 'Tanyakan kelengkapan lewat Chat lalu pilih tanggal, jumlah unit, dan ajukan sewa.',
              },
              {
                step: '03',
                icon: MapPin,
                title: 'Serah Terima Aman',
                desc: 'Bertemu di titik GPS yang disepakati, cek kondisi barang bersama, lalu bawa pulang.',
              },
              {
                step: '04',
                icon: Wallet,
                title: 'Kembalikan & Ulas',
                desc: 'Kembalikan tepat waktu, deposit kembali 100%, dan tulis ulasan beserta foto asli.',
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-data font-bold text-blue-600">
                        LANGKAH {s.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{s.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              <span>Mulai Jelajahi Barang Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SAFETY PAGE */}
      {footerPage === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Verifikasi Identitas Berlapis',
              desc: 'Setiap akun wajib memverifikasi alamat Gmail aktif dengan kode OTP dan dapat melengkapi verifikasi KTP oleh tim Admin PinjamKuy.',
            },
            {
              icon: Lock,
              title: 'Sistem Deposit Transparan',
              desc: 'Besaran deposit tercantum jelas di syarat sewa sejak awal dan dikembalikan penuh setelah serah terima pengembalian selesai.',
            },
            {
              icon: Sparkles,
              title: 'Ulasan Foto Asli Terverifikasi',
              desc: 'Penyewa mengunggah foto kondisi nyata barang setelah pemakaian sehingga komunitas selalu mendapat informasi jujur.',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ PAGE */}
      {footerPage === 'faq' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Klik pertanyaan di bawah untuk melihat jawaban lengkap.
            </p>
          </div>
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {faqs.map((item, idx) => (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed pr-6">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TERMS OR PRIVACY */}
      {(footerPage === 'terms' || footerPage === 'privacy') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {footerPage === 'terms' ? 'Syarat & Ketentuan PinjamKuy' : 'Kebijakan Privasi Data'}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h2 className="text-sm font-bold text-slate-900">
                {footerPage === 'terms' ? '01. Kewajiban Penyewa' : '01. Perlindungan Lokasi GPS'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {footerPage === 'terms'
                  ? 'Penyewa wajib menjaga barang layaknya milik sendiri, mengembalikan tepat waktu sesuai durasi, dan mematuhi syarat spesifik dari pemilik barang.'
                  : 'Titik GPS yang ditampilkan pada katalog hanya menunjukkan area kelurahan/kecamatan. Alamat lengkap hanya dibagikan setelah pemilik menyetujui sewa.'}
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h2 className="text-sm font-bold text-slate-900">
                {footerPage === 'terms' ? '02. Kewajiban Pemilik' : '02. Keamanan Data KTP & Gmail'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {footerPage === 'terms'
                  ? 'Pemilik wajib menyerahkan barang dalam kondisi bersih, berfungsi baik, lengkap sesuai deskripsi, serta mengembalikan deposit tanpa potongan bila barang utuh.'
                  : 'Data verifikasi Gmail dan dokumen identitas dienkripsi dan tidak pernah dijual atau dibagikan ke pihak ketiga di luar kebutuhan verifikasi sewa.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
