import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    view,
    currentUser,
    notifications,
    messages,
    conversations,
    navigateTo,
    loginAsDemoRole,
    logout,
    markNotificationRead,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);

  const userNotifs = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : [];
  const unreadNotifCount = userNotifs.filter((n) => !n.isRead).length;

  const userConvs = currentUser
    ? conversations.filter((c) => c.participantIds.includes(currentUser.id))
    : [];
  const unreadChatCount = currentUser
    ? messages.filter(
        (m) =>
          userConvs.some((c) => c.id === m.conversationId) &&
          m.senderId !== currentUser.id &&
          !m.isRead
      ).length
    : 0;

  const roleLabel = (role: UserRole) =>
    role === 'renter' ? 'Penyewa' : role === 'owner' ? 'Pemilik Barang' : 'Admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          aria-label="PinjamKuy Beranda"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              view === 'home'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Jelajahi Barang
          </button>
          <button
            type="button"
            onClick={() => navigateTo('info', { footerPage: 'how-it-works' })}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
              view === 'info'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Cara Kerja
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={() => navigateTo('chat')}
              aria-label="Chat"
              title="Chat"
              className={`relative whitespace-nowrap shrink-0 p-1.5 border-b-2 transition-colors inline-flex items-center gap-1 ${
                view === 'chat'
                  ? 'border-blue-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {unreadChatCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-semibold bg-blue-600 text-white rounded-full tabular-nums">
                  {unreadChatCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Auth & Account Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0 relative">
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => navigateTo('auth')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => navigateTo('auth')}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Daftar Gratis
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Quick Notification Bell Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifPopoverOpen((p) => !p);
                    setAccountMenuOpen(false);
                  }}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Lihat notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {notifPopoverOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        Notifikasi Masuk ({unreadNotifCount})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifPopoverOpen(false);
                          navigateTo('notifications');
                        }}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Lihat Semua
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {userNotifs.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">
                          Belum ada notifikasi saat ini.
                        </div>
                      ) : (
                        userNotifs.slice(0, 4).map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              markNotificationRead(n.id);
                              setNotifPopoverOpen(false);
                              navigateTo(n.targetView, {
                                chatId: n.type === 'chat' ? n.targetId : undefined,
                              });
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                              !n.isRead ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                                {n.title}
                              </p>
                              <span className="text-[11px] text-slate-400 shrink-0">
                                {n.createdAt}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                              {n.body}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Photo Avatar Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen((p) => !p);
                    setNotifPopoverOpen(false);
                  }}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover bg-slate-200"
                  />
                  <div className="text-left leading-tight">
                    <div className="text-xs font-semibold text-slate-900 max-w-[110px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium">
                      {roleLabel(currentUser.role)}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          navigateTo('account');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>Halaman Akun & Foto Profil</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          if (currentUser.role !== 'owner') loginAsDemoRole('owner');
                          navigateTo('account');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        <PlusCircle className="w-4 h-4 text-blue-600" />
                        <span>Sewakan Barang</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          navigateTo('auth');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        <LogIn className="w-4 h-4 text-slate-500" />
                        <span>Halaman Masuk / Daftar</span>
                      </button>
                    </div>
                    <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/70">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Simulasi Ganti Peran Cepat
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {(['renter', 'owner', 'admin'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              loginAsDemoRole(r);
                              setAccountMenuOpen(false);
                            }}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              currentUser.role === r
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {r === 'renter' ? 'Penyewa' : r === 'owner' ? 'Pemilik' : 'Admin'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <button
              type="button"
              onClick={() => navigateTo('notifications')}
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('account');
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-blue-600 font-medium">{roleLabel(currentUser.role)} · Lihat Akun</p>
              </div>
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('home');
              }}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg text-left"
            >
              Jelajahi Barang
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('chat');
              }}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg text-left"
            >
              Chat ({unreadChatCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('notifications');
              }}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg text-left"
            >
              Notifikasi ({unreadNotifCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('info', { footerPage: 'how-it-works' });
              }}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg text-left"
            >
              Cara Kerja
            </button>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('auth');
              }}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg"
            >
              {currentUser ? 'Ganti Akun / Masuk' : 'Masuk & Daftar'}
            </button>
            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg"
              >
                Keluar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
