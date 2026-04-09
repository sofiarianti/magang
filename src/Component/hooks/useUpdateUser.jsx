// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * usePutDonatur adalah custom hook yang digunakan untuk memperbarui data donatur di backend.
 * @returns { Object } - Mengembalikan fungsi putDonatur, serta status loading dan error.
 */
const usePutUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data donatur di backend.
   * @param { number } id - ID donatur yang akan diperbarui.
   * @param { string } kode_user - NIK donatur.
   * @param { string } nama_user - Nama donatur.
   * @param { string } kode_himpunan - Kode himpunan.
   * @param { string } email - Email user.
   * @param { string } password - Password user.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putUser = async (id, kode_user, nama_user, kode_himpunan, email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_user,
        nama_user,
        kode_himpunan,
        email,
        password,
      };

    // Defensive check untuk memastikan endpoints.donatur.update terdefinisi
      if (!endpoints.users || typeof endpoints.users.update !== 'function') {
        throw new Error('endpoints.users.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.users.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating user:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui user.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putUser, loading, error };
};

export default usePutUser;