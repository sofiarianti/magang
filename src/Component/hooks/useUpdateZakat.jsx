// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutZakat adalah custom hook yang digunakan untuk memperbarui data zakat di backend.
 * @returns { Object } - Mengembalikan fungsi putZakat, serta status loading dan error.
 */
const usePutZakat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data zakat di backend.
   * @param { number } id - ID zakat yang akan diperbarui.
   * @param { string } kode_zakat - Kode zakat.
   * @param { string } nama_zakat - Nama zakat.
   * @param { string } kode_jenis_donasi - Kode jenis donasi.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putZakat = async (id, kode_zakat, nama_zakat, kode_jenis_donasi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_zakat,
        nama_zakat,
        kode_jenis_donasi,
      };

    // Defensive check untuk memastikan endpoints.zakat.update terdefinisi
      if (!endpoints.zakat || typeof endpoints.zakat.update !== 'function') {
        throw new Error('endpoints.zakat.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.zakat.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating zakat:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui zakat.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putZakat, loading, error };
};

export default usePutZakat;