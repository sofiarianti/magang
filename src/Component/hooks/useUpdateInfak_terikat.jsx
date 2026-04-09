// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutInfakTerikat adalah custom hook yang digunakan untuk memperbarui data infak terikat di backend.
 * @returns { Object } - Mengembalikan fungsi putInfakTerikat, serta status loading dan error.
 */
const usePutInfakTerikat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data infak terikat di backend.
    * @param { number } id - ID infak terikat yang akan diperbarui.
   * @param { string } kode_infak_terikat - Kode infak terikat.
   * @param { string } nama_infak_terikat - Nama infak terikat.
   * @param { string } kode_jenis_donasi - Kode jenis donasi.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putInfakTerikat = async (id, kode_infak_terikat, nama_infak_terikat, kode_jenis_donasi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_infak_terikat,
        nama_infak_terikat,
        kode_jenis_donasi,
      };

    // Defensive check untuk memastikan endpoints.zakat.update terdefinisi
      if (!endpoints.infak_terikat || typeof endpoints.infak_terikat.update !== 'function') {
        throw new Error('endpoints.infak_terikat.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.infak_terikat.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating infak terikat:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui infak terikat.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putInfakTerikat, loading, error };
};

export default usePutInfakTerikat;