import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postZakat, serta status loading dan error.
 */
const usePostInformasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } judul 
   * @param { string } foto 
   * @param { string } deskripsi 
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postInformasi = async (judul, foto, deskripsi) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        judul,
        foto,
        deskripsi,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.informasi.create, data, {
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

  return { postInformasi, loading, error };
};

export default usePostInformasi;