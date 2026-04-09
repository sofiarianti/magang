import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postInfakTerikat, serta status loading dan error.
 */
const usePostInfakTerikat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } kode_infak_terikat 
   * @param { string } nama_infak_terikat 
   * @param { string } kode_jenis_donasi
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postInfakTerikat = async (kode_infak_terikat, nama_infak_terikat, kode_jenis_donasi) => {
    setLoadingInfakTerikat(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        kode_infak_terikat,
        nama_infak_terikat,
        kode_jenis_donasi,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.infak_terikat.create, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error uploading data:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mengupload data.');
      return null;
    } finally {
      setLoading(false);
    }
  };

return { postInfakTerikat, loading, error };
};

export default usePostInfakTerikat;