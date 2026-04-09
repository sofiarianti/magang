import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutInformasi adalah custom hook yang digunakan untuk memperbarui data informasi di backend.
 * @returns { Object } - Mengembalikan fungsi putZakat, serta status loading dan error.
 */
const usePutInformasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data informasi di backend.
   * @param { number } id - ID informasi yang akan diperbarui.
   * @param { string } judul - Judul informasi.
   * @param { string } foto - URL foto informasi.
   * @param { string } deskripsi - Deskripsi informasi.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putInformasi = async (id, judul, foto, deskripsi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        judul,
        foto,
        deskripsi,
      };

    // Defensive check untuk memastikan endpoints.informasi.update terdefinisi
      if (!endpoints.informasi || typeof endpoints.informasi.update !== 'function') {
        throw new Error('endpoints.informasi.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.informasi.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating informasi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui informasi.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putInformasi, loading, error };
};

export default usePutInformasi;