// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutDonatur adalah custom hook yang digunakan untuk memperbarui data donatur di backend.
 * @returns { Object } - Mengembalikan fungsi putDonatur, serta status loading dan error.
 */
const usePutTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data donatur di backend.
   * @param { number } id - ID donatur yang akan diperbarui.
   * @param { string } kode_transaksi - NIK donatur.
   * @param { string } kode_donatur - NIK donatur.
   * @param { string } kode_jenis_donasi - NIK donatur.
   * @param { string } kode_detail_donasi - NIK donatur.
   * @param { string } kode_user - NIK donatur.
   * @param { string } kode_himpun - NIK donatur.
   * @param { string } kode_detail_transaksi - NIK donatur.
   * @param { string } jumlah_donasi - NIK donatur.
  * @param {string} catatan - Catatan tambahan untuk transaksi, opsional.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putTransaksi = async (
    id,
    kode_transaksi,
    kode_donatur,
    kode_jenis_donasi,
    kode_detail_donasi,
    kode_user,
    kode_himpun,
    kode_detail_transaksi,
    jumlah_donasi,
    status,
    catatan
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim (support update status)
      const data = {
        kode_transaksi,
        kode_donatur,
        kode_jenis_donasi,
        kode_detail_donasi,
        kode_user,
        kode_himpun,
        kode_detail_transaksi,
        jumlah_donasi,
        catatan,
        ...(status !== undefined ? { status, status_transaksi: status } : {}),
      };
    // Defensive check untuk memastikan endpoints.donatur.update terdefinisi
      if (!endpoints.transaksi || typeof endpoints.transaksi.update !== 'function') {
        throw new Error('endpoints.transaksi.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.transaksi.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating transaksi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui transaksi.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putTransaksi, loading, error };
};

export default usePutTransaksi;