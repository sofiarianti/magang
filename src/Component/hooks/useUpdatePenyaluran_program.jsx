import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi putPenyaluranProgram, serta status loading dan error.
 */
const useUpdatePenyaluranProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memperbarui data penyaluran program di backend.
   * @param { number|string } id_peyaluran
   * @param { number|string } id_transaksi
   * @param { number|string } id_program
   * @param { string } kode_user
   * @param { string } tanggal_penyaluran
   * @param { number|string } nominal_penyaluran
   * @param { string } status_penyaluran
   * @param { string } catatan
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putPenyaluranProgram = async (
    id_peyaluran,
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

      // Defensive check untuk memastikan endpoint update terdefinisi
      if (!endpoints.penyaluran_program || typeof endpoints.penyaluran_program.update !== 'function') {
        throw new Error('endpoints.penyaluran_program.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.penyaluran_program.update(id_peyaluran), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating penyaluran program:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui data penyaluran program.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putPenyaluranProgram, loading, error };
};

export default useUpdatePenyaluranProgram;
