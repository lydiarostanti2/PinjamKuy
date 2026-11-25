import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  MailCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { validateGmail, validateStrongPassword } from '../utils/format';
import { Logo } from './Logo';

export const AuthPage: React.FC = () => {
  const {
    loginWithEmail,
    loginWithProvider,
    registerAccount,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'renter' | 'owner'>('renter');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState('');

  // Gmail Verification Step State
  const [verifyStep, setVerifyStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Social Login Modal Simulation
  const [socialModal, setSocialModal] = useState<'Google' | 'Apple' | 'Facebook' | null>(null);
  const [socialEmail, setSocialEmail] = useState('pengguna.baru@gmail.com');
  const [socialName, setSocialName] = useState('Aulia Rahman');

  const pwCheck = validateStrongPassword(regPassword);
  const passwordsMatch =
    regConfirmPassword.length > 0 && regPassword === regConfirmPassword;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const gmailCheck = validateGmail(loginEmail);
    if (!gmailCheck.valid) {
      setLoginError(gmailCheck.error || 'Email Gmail tidak valid.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Kata sandi wajib diisi.');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('Kata sandi terlalu pendek.');
      return;
    }
    const res = loginWithEmail(loginEmail);
    if (!res.ok && res.error) {
      setLoginError(res.error);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Nama lengkap wajib diisi.');
      return;
    }
    const gmailCheck = validateGmail(regEmail);
    if (!gmailCheck.valid) {
      setRegError(gmailCheck.error || 'Email Gmail wajib diisi dengan format yang benar.');
      return;
    }
    if (!pwCheck.isValid) {
      setRegError(
        'Kata sandi harus memenuhi minimal 8 karakter, huruf kapital, huruf kecil, angka, dan simbol.'
      );
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi kata sandi tidak cocok dengan kata sandi utama.');
      return;
    }

    // Generate 6-digit OTP & enter Gmail verification step
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setInputOtp('');
    setOtpError('');
    setVerifyStep(true);
    showToast(`Kode verifikasi Gmail dikirim ke ${regEmail}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (inputOtp.trim() !== generatedOtp) {
      setOtpError('Kode verifikasi 6 digit tidak sesuai. Periksa kotak masuk Gmail simulasi di atas.');
      return;
    }
    registerAccount({
      name: regName,
      email: regEmail,
      role: regRole,
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Auth Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Logo size="md" />
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setVerifyStep(false);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setVerifyStep(false);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daftar Baru
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Masuk ke Akun PinjamKuy
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Gunakan akun Gmail Anda atau masuk cepat lewat penyedia sosial.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alamat Email Gmail <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="contoh: raka.penyewa@gmail.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kata Sandi <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPass ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((p) => !p)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      aria-label="Tampilkan kata sandi"
                    >
                      {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Masuk Sekarang
                </button>
              </form>

              {/* Social Login Providers */}
              <div className="space-y-3 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-xs text-slate-400 whitespace-nowrap">
                    Atau masuk lebih cepat dengan
                  </span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSocialModal('Google')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSocialModal('Apple')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43Zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45Z" />
                    </svg>
                    <span>Apple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSocialModal('Facebook')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          ) : !verifyStep ? (
            /* REGISTRATION FORM */
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Daftar Akun PinjamKuy
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Wajib verifikasi Gmail aktif dan membuat kata sandi yang kuat.
                </p>
              </div>

              {regError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama Lengkap <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Siti Rahmawati"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Daftar Sebagai <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as 'renter' | 'owner')}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="renter">Penyewa Barang</option>
                      <option value="owner">Pemilik Barang (Pemberi Sewa)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alamat Gmail Aktif <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="namaanda@gmail.com"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* 2 Password Fields: Password + Konfirmasi Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kata Sandi <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 8 karakter + simbol"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass((p) => !p)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                      >
                        {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Konfirmasi Kata Sandi <span className="text-red-600">*</span>
                    </label>
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Live Password Strength Checklist */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Syarat Keamanan Kata Sandi:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                    {[
                      { ok: pwCheck.minLength, text: 'Minimal 8 karakter' },
                      { ok: pwCheck.hasUpper, text: 'Huruf Kapital (A-Z)' },
                      { ok: pwCheck.hasLower, text: 'Huruf Kecil (a-z)' },
                      { ok: pwCheck.hasNumber, text: 'Angka (0-9)' },
                      { ok: pwCheck.hasSymbol, text: 'Simbol (!@#$%)' },
                      { ok: passwordsMatch, text: 'Konfirmasi Cocok' },
                    ].map((rule, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 ${
                          rule.ok ? 'text-blue-700 font-semibold' : 'text-slate-500'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            rule.ok ? 'text-blue-600' : 'text-slate-300'
                          }`}
                        />
                        <span>{rule.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Lanjut ke Verifikasi Gmail
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: GMAIL VERIFICATION OTP */
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MailCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Verifikasi Gmail Terlebih Dahulu
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kode 6 digit telah dikirim ke <span className="font-semibold text-slate-800">{regEmail}</span>
                  </p>
                </div>
              </div>

              {/* Simulated Gmail Inbox Preview so user can verify seamlessly */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-blue-800">
                  Simulasi Kotak Masuk Gmail ({regEmail})
                </p>
                <p className="text-xs text-slate-700">
                  Kode Verifikasi PinjamKuy Anda:{' '}
                  <span className="font-mono-data text-base font-extrabold text-blue-700 tracking-widest bg-white px-2.5 py-0.5 rounded border border-blue-200">
                    {generatedOtp}
                  </span>
                </p>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {otpError}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Masukkan 6 Digit Kode Verifikasi
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 123456"
                    className="w-full font-mono-data text-center text-xl tracking-[0.4em] rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVerifyStep(false)}
                    className="px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Ubah Email
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    Verifikasi & Aktifkan Akun
                  </button>
                </div>
              </form>
            </div>
          )}
      </div>

      {/* Social OAuth Simulation Modal */}
      {socialModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Lanjutkan dengan {socialModal}
            </h3>
            <p className="text-xs text-slate-600">
              Konfirmasi akun {socialModal} yang ingin dihubungkan ke PinjamKuy:
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Akun
                </label>
                <input
                  type="text"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Gmail Terhubung
                </label>
                <input
                  type="email"
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSocialModal(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  loginWithProvider(socialModal, socialEmail, socialName);
                  setSocialModal(null);
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Izinkan & Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
