// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutDetailTransaksi adalah custom hook yang digunakan untuk memperbarui data detail transaksi di backend.
 * @returns { Object } - Mengembalikan fungsi putDetailTransaksi, serta status loading dan error.
 */
const usePutDetailTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data detail transaksi di backend.
   * @param { number } id - ID detail transaksi yang akan diperbarui.
   * @param { string } kode_detail_transaksi - Kode detail transaksi.
   * @param { string } nama - Nama detail transaksi.
   * @param { string } kode_himpun - Kode himpun.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putDetailTransaksi = async (id, kode_detail_transaksi, nama, kode_himpun) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_detail_transaksi,
        nama,
        kode_himpun,
      };

    // Defensive check untuk memastikan endpoints.detail_transaksi.update terdefinisi
      if (!endpoints.detail_transaksi || typeof endpoints.detail_transaksi.update !== 'function') {
        throw new Error('endpoints.detail_transaksi.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.detail_transaksi.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating detail transaksi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui detail transaksi.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putDetailTransaksi, loading, error };
};

export default usePutDetailTransaksi;