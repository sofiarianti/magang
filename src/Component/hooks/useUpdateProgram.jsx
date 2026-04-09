import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi putProgram, serta status loading dan error.
 */
const usePutProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memperbarui data program di backend.
   * @param { number } id_program
   * @param { number|string } id_divisi
   * @param { string } nama_program
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putProgram = async (id_program, id_divisi, nama_program) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        id_divisi,
        nama_program,
      };

      // Defensive check untuk memastikan endpoint update terdefinisi
      if (!endpoints.program || typeof endpoints.program.update !== 'function') {
        throw new Error('endpoints.program.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.program.update(id_program), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating program:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui data program.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putProgram, loading, error };
};

export default usePutProgram;
