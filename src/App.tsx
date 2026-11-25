import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AccountPage } from './components/AccountPage';
import { AddItemPage } from './components/AddItemPage';
import { AuthPage } from './components/AuthPage';
import { ChatPage } from './components/ChatPage';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { InfoPages } from './components/InfoPages';
import { Navbar } from './components/Navbar';
import { NotificationsPage } from './components/NotificationsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AppProvider, useApp } from './context/AppContext';

const MainShell: React.FC = () => {
  const { view, toastMessage, navigateTo } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {view === 'home' && <HomePage />}
        {view === 'product-detail' && <ProductDetailPage />}
        {view === 'auth' && <AuthPage />}
        {view === 'account' && <AccountPage />}
        {view === 'add-item' && <AddItemPage />}
        {view === 'chat' && <ChatPage />}
        {view === 'notifications' && <NotificationsPage />}
        {view === 'info' && <InfoPages />}
      </main>

      {view === 'home' && (
        <section
          aria-label="Mulai sewakan barang"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                Punya Barang Menganggur?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Sewakan kamera, perkakas, atau alat camping Anda dan hasilkan pendapatan tambahan aman setiap minggu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('add-item')}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              Mulai Sewakan Barang
            </button>
          </div>
        </section>
      )}

      <Footer />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
