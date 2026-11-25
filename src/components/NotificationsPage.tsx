import React, { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, PackageCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationType } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
  } = useApp();

  const [filter, setFilter] = useState<'all' | NotificationType>('all');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Masuk untuk Melihat Notifikasi</h1>
        <p className="text-sm text-slate-600">
          Pantau pesan masuk, pengajuan sewa baru, dan pembaruan status transaksi Anda.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('auth')}
          className="px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          Masuk Sekarang
        </button>
      </div>
    );
  }

  const myNotifs = notifications.filter((n) => n.userId === currentUser.id);
  const filtered = myNotifs.filter((n) => (filter === 'all' ? true : n.type === filter));
  const unreadCount = myNotifs.filter((n) => !n.isRead).length;

  const iconForType = (type: NotificationType) => {
    if (type === 'chat') return <MessageSquare className="w-5 h-5 text-blue-600" />;
    if (type === 'rental_request') return <PackageCheck className="w-5 h-5 text-orange-600" />;
    if (type === 'rental_status') return <Bell className="w-5 h-5 text-blue-600" />;
    return <ShieldAlert className="w-5 h-5 text-slate-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Pusat Notifikasi ({unreadCount} Belum Dibaca)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Informasi chat masuk, pengajuan barang yang ingin disewa, dan pembaruan akun
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl whitespace-nowrap self-start"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'chat', label: 'Chat Masuk' },
          { id: 'rental_request', label: 'Permintaan Sewa Masuk' },
          { id: 'rental_status', label: 'Status Sewaan' },
          { id: 'system', label: 'Sistem' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id as typeof filter)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
              filter === t.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Belum ada notifikasi pada kategori ini.
          </div>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                markNotificationRead(n.id);
                navigateTo(n.targetView, {
                  chatId: n.type === 'chat' ? n.targetId : undefined,
                });
              }}
              className={`w-full text-left p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors ${
                !n.isRead ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                {iconForType(n.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  <span className="text-xs text-slate-400 shrink-0">{n.createdAt}</span>
                </div>
                <p className="text-sm text-slate-600">{n.body}</p>
              </div>
              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0 mt-2" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
