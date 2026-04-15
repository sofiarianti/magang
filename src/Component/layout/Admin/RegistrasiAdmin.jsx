import React, { useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import usePostUser from '../../hooks/usePostUser';
import endpointsAdmin from '../../Services/endpointAdmin';

const initialForm = {
  kode_user: '',
  nama_user: '',
  kode_himpun: '',
  email: '',
  password: '',
  role: 'admin_program',
};

function RegistrasiAdmin({ standalone = false, onGoToLogin }) {
  const { data: himpunData, loading: loadingHimpun } = useAPI(endpointsAdmin.himpun.getAll);
  const { postUser, loading: submitting, error } = usePostUser();
  const [form, setForm] = useState(initialForm);
  const [submitMessage, setSubmitMessage] = useState('');

  const himpunList = useMemo(() => {
    if (Array.isArray(himpunData)) return himpunData;
    if (Array.isArray(himpunData?.himpun)) return himpunData.himpun;
    if (Array.isArray(himpunData?.data)) return himpunData.data;
    if (Array.isArray(himpunData?.result)) return himpunData.result;
    return [];
  }, [himpunData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && value === 'super_admin' ? { kode_himpun: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    const response = await postUser(
      form.kode_user,
      form.nama_user,
      form.role === 'super_admin' ? '' : form.kode_himpun,
      form.email,
      form.password,
      form.role
    );

    if (response) {
      setSubmitMessage('Registrasi admin berhasil. Silakan login dengan akun baru Anda.');
      setForm(initialForm);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100';

  const formCard = (
    <section className="max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50">
        <h2 className="text-lg font-semibold text-slate-900">Form Registrasi Karyawan</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilih role sesuai kebutuhan: `admin_keuangan`, `admin_program`, `customer_service`, atau `super_admin`.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Kode User</label>
          <input
            type="text"
            name="kode_user"
            value={form.kode_user}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama User</label>
          <input
            type="text"
            name="nama_user"
            value={form.nama_user}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={`${inputClass} bg-white`}
          >
            <option value="admin_program">Admin Program</option>
            <option value="admin_keuangan">Admin Keuangan</option>
            <option value="customer_service">Customer Service</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Kode Himpun</label>
          <select
            name="kode_himpun"
            value={form.kode_himpun}
            onChange={handleChange}
            disabled={form.role === 'super_admin' || loadingHimpun}
            required={form.role !== 'super_admin'}
            className={`${inputClass} bg-white disabled:bg-slate-100 disabled:text-slate-400`}
          >
            <option value="">
              {form.role === 'super_admin' ? 'Super admin tidak perlu himpun' : 'Pilih himpun'}
            </option>
            {himpunList.map((item) => {
              const value = item.kode_himpun || item.kode || '';
              const label = item.nama_himpun || item.nama || value;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          {standalone && onGoToLogin ? (
            <button
              type="button"
              onClick={onGoToLogin}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kembali ke Login
            </button>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Menyimpan...' : 'Daftar Admin'}
          </button>
        </div>
      </form>
    </section>
  );

  if (standalone) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,_#eff6ff_0%,_#ffffff_42%,_#fff7ed_100%)] px-4 py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">Karyawan</p>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">Registrasi Admin</h1>
            <p className="text-sm text-slate-600 mt-3">
              Gunakan form ini untuk membuat akun internal dan memilih role sesuai tugas.
            </p>
          </div>

          {submitMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {submitMessage}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {formCard}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">Admin</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Registrasi Admin</h1>
          <p className="text-sm text-slate-600 mt-3">
            Tambahkan akun admin baru dan tentukan role yang akan digunakan saat login.
          </p>
        </div>

        {submitMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {submitMessage}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {formCard}
      </div>
    </div>
  );
}

export default RegistrasiAdmin;



