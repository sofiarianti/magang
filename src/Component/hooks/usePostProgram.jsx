import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi postProgram, serta status loading dan error.
 */
const usePostProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data program ke backend.
   * @param { number|string } id_divisi
   * @param { string } nama_program
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postProgram = async (id_divisi, nama_program) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        id_divisi,
        nama_program,
      };

      // Memastikan endpoint create terdefinisi
      if (!endpoints.program?.create) {
        throw new Error('endpoints.program.create is not defined');
      }

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.program.create, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error uploading program:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat mengupload data program.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postProgram, loading, error };
};

export default usePostProgram;
