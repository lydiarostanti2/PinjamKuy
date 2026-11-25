import React from 'react';
import { ShieldCheck, MapPin, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FooterPageId } from '../types';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const openInfo = (page: FooterPageId) => {
    navigateTo('info', { footerPage: page });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5">
              <div className="bg-white px-2.5 py-1.5 rounded-xl inline-flex">
                <Logo size="sm" />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform ekonomi berbagi untuk menyewa dan menyewakan barang berkualitas antar tetangga dengan verifikasi KTP, pelacakan GPS, dan perlindungan transaksi.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Jakarta Selatan & Bandung, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>halo@pinjamkuy.id</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Dilindungi PinjamKuy Protect</span>
              </div>
            </div>
          </div>

          {/* Tentang & Cara Kerja */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Tentang PinjamKuy</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openInfo('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openInfo('how-it-works')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cara Kerja Sewa
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openInfo('safety')}
                  className="hover:text-white transition-colors text-left"
                >
                  Keamanan & Perlindungan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openInfo('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Pusat Bantuan (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Panduan */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Aturan & Privasi</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openInfo('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openInfo('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('auth')}
                  className="hover:text-white transition-colors text-left"
                >
                  Masuk / Daftar Akun
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('chat')}
                  className="hover:text-white transition-colors text-left"
                >
                  Chat Komunitas
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PinjamKuy Indonesia. Seluruh hak cipta dilindungi.</p>
          <p>Hemat biaya · Kurangi limbah · Berbagi bersama tetangga</p>
        </div>
      </div>
    </footer>
  );
};
