// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutDetailDonasi adalah custom hook yang digunakan untuk memperbarui data detail donasi di backend.
 * @returns { Object } - Mengembalikan fungsi putDetailDonasi, serta status loading dan error.
 */
const usePutDetailDonasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data detail donasi di backend.
   * @param { number } id - ID detail donasi yang akan diperbarui.
   * @param { string } kode_detail_donasi- Kode detail donasi.
   * @param { string } nama_detail_donasi - Nama detail donasi.
   * @param { string } kode_jenis_donasi- Kode jenis donasi.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putDetailDonasi = async (id, kode_detail_donasi, nama_detail_donasi, kode_jenis_donasi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_detail_donasi,
        nama_detail_donasi,
        kode_jenis_donasi,
      };

    // Defensive check untuk memastikan endpoints.detail_donasi.update terdefinisi
      if (!endpoints.detail_donasi || typeof endpoints.detail_donasi.update !== 'function') {
        throw new Error('endpoints.detail_donasi.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.detail_donasi.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating detail donasi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui detail donasi.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putDetailDonasi, loading, error };
};

export default usePutDetailDonasi;