// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutInfakUmum adalah custom hook yang digunakan untuk memperbarui data infak umum di backend.
 * @returns { Object } - Mengembalikan fungsi putInfakUmum, serta status loading dan error.
 */
const usePutInfakUmum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data infak umum di backend.
    * @param { number } id - ID infak umum yang akan diperbarui.
   * @param { string } kode_infak_umum - Kode infak umum.
   * @param { string } nama_infak_umum - Nama infak umum.
   * @param { string } kode_jenis_donasi - Kode jenis donasi.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putInfakUmum = async (id, kode_infak_umum, nama_infak_umum, kode_jenis_donasi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_infak_umum,
        nama_infak_umum,
        kode_jenis_donasi,
      };

    // Defensive check untuk memastikan endpoints.zakat.update terdefinisi
      if (!endpoints.infak_umum || typeof endpoints.infak_umum.update !== 'function') {
        throw new Error('endpoints.infak_umum.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.infak_umum.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating infak umum:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui infak umum.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putInfakUmum, loading, error };
};

export default usePutInfakUmum;