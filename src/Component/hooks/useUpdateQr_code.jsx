// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutQr_code adalah custom hook yang digunakan untuk memperbarui data donatur di backend.
 * @returns { Object } - Mengembalikan fungsi putQr_code, serta status loading dan error.
 */
const usePutQr_code = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data donatur di backend.
   * @param { number } id_qrcode
   * @param { string } nama_qrcode
   * @param { string } jenis_qrcode
   * @param { string } image_qrcode             
   * @param { string } nominal_default
   * @param { string } is_active
   * @param { string } keterangan    
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putQr_code = async (id_qrcode, nama_qrcode, jenis_qrcode, image_qrcode, nominal_default, is_active, keterangan) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        id_qrcode,
        nama_qrcode,
        jenis_qrcode,
        image_qrcode,
        nominal_default,
        is_active,
        keterangan,
      };

    // Defensive check untuk memastikan endpoint update terdefinisi
      if (!endpoints.qrcode || typeof endpoints.qrcode.update !== 'function') {
        throw new Error('endpoints.qrcode.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.qrcode.update(id_qrcode), data, {
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

  return { putQr_code, loading, error };
};

export default usePutQr_code;
