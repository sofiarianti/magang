import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi postPenyaluranProgram, serta status loading dan error.
 */
const usePostPenyaluranProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data penyaluran program ke backend.
   * @param { number|string } id_transaksi
   * @param { number|string } id_program
   * @param { string } kode_user
   * @param { string } tanggal_penyaluran
   * @param { number|string } nominal_penyaluran
   * @param { string } status_penyaluran
   * @param { string } catatan
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postPenyaluranProgram = async (
    id_transaksi,
    id_program,
    kode_user,
    tanggal_penyaluran,
    nominal_penyaluran,
    status_penyaluran,
    catatan
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        id_transaksi,
        id_program,
        kode_user,
        tanggal_penyaluran,
        nominal_penyaluran,
        status_penyaluran,
        catatan,
      };

      // Memastikan endpoint create terdefinisi
      if (!endpoints.penyaluran_program?.create) {
        throw new Error('endpoints.penyaluran_program.create is not defined');
      }

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.penyaluran_program.create, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error creating penyaluran program:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menambah data penyaluran program.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postPenyaluranProgram, loading, error };
};

export default usePostPenyaluranProgram;
