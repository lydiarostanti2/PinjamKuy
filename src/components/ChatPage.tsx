import React, { useMemo, useState } from 'react';
import { BellRing, Image as ImageIcon, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/format';

export const ChatPage: React.FC = () => {
  const {
    currentUser,
    users,
    conversations,
    messages,
    activeChatId,
    navigateTo,
    sendMessage,
    simulateIncomingReply,
  } = useApp();

  const [selectedId, setSelectedId] = useState(activeChatId);
  const [text, setText] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Masuk untuk Membuka Chat</h1>
        <p className="text-sm text-slate-600">
          Anda dapat mengobrol langsung dengan pemilik barang atau penyewa setelah masuk ke akun PinjamKuy.
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

  const myConversations = useMemo(
    () =>
      conversations.filter((c) => c.participantIds.includes(currentUser.id)),
    [conversations, currentUser.id]
  );

  const currentConv =
    myConversations.find((c) => c.id === selectedId) || myConversations[0] || null;

  const convMessages = currentConv
    ? messages.filter((m) => m.conversationId === currentConv.id)
    : [];

  const otherUserId = currentConv?.participantIds.find((id) => id !== currentUser.id);
  const otherUser = users.find((u) => u.id === otherUserId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentConv || !text.trim()) return;
    sendMessage(currentConv.id, text);
    setText('');
  };

  const handleAttachPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentConv) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sendMessage(currentConv.id, 'Mengirim foto lampiran', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] shadow-sm">
        {/* Left Sidebar: Conversations */}
        <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-slate-900">Pesan & Negosiasi</h1>
              <p className="text-xs text-slate-500">Chat langsung antar penyewa & pemilik</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {myConversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Belum ada percakapan. Klik "Chat Pemilik" pada halaman produk untuk memulai.</p>
              </div>
            ) : (
              myConversations.map((conv) => {
                const partnerId = conv.participantIds.find((id) => id !== currentUser.id);
                const partner = users.find((u) => u.id === partnerId);
                const active = currentConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSelectedId(conv.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                      active ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={partner?.avatar || conv.itemImage || ''}
                      alt={partner?.name || 'Pengguna'}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {partner?.name || 'Pengguna PinjamKuy'}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {conv.lastMessageAt}
                        </span>
                      </div>
                      {conv.itemTitle && (
                        <p className="text-[11px] font-semibold text-blue-600 truncate">
                          {conv.itemTitle}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Chat Window */}
        <section className="md:col-span-8 flex flex-col bg-slate-50/40">
          {!currentConv ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-sm">
              Pilih percakapan di sebelah kiri atau mulai chat dari halaman produk.
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {otherUser && (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900">
                        {otherUser?.name || 'Lawan Bicara'}
                      </p>
                      {otherUser?.ktpVerified && (
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {otherUser?.city} · {otherUser?.responseRate}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => simulateIncomingReply(currentConv.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Simulasikan Balasan & Notifikasi</span>
                </button>
              </div>

              {/* Product Context Banner */}
              {currentConv.itemId && currentConv.itemTitle && (
                <div className="bg-white/90 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {currentConv.itemImage && (
                      <img
                        src={currentConv.itemImage}
                        alt={currentConv.itemTitle}
                        referrerPolicy="no-referrer"
                        className="w-11 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentConv.itemTitle}
                      </p>
                      {currentConv.itemPrice && (
                        <p className="text-xs font-semibold text-blue-600 tabular-nums">
                          {formatRupiah(currentConv.itemPrice)} / hari
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo('product-detail', { itemId: currentConv.itemId })
                    }
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap shrink-0"
                  >
                    Lihat Produk
                  </button>
                </div>
              )}

              {/* Messages Feed */}
              <div className="flex-1 p-5 space-y-3 overflow-y-auto max-h-[380px]">
                {convMessages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed space-y-2 ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                        }`}
                      >
                        {m.imageUrl && (
                          <img
                            src={m.imageUrl}
                            alt="Lampiran chat"
                            className="rounded-xl max-h-48 object-cover"
                          />
                        )}
                        <p>{m.content}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 px-1 tabular-nums">
                        {m.createdAt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Prompts */}
              <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto bg-white border-t border-slate-100">
                {[
                  'Apakah barang masih tersedia tanggal ini?',
                  'Bisa ambil langsung sesuai titik GPS?',
                  'Apakah kelengkapannya full set?',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(chip)}
                    className="px-3 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSend}
                className="bg-white p-3.5 border-t border-slate-200 flex items-center gap-2.5"
              >
                <label
                  title="Kirim Foto"
                  className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAttachPhoto}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis pesan ke pemilik atau penyewa..."
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
