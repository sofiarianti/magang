import axios from 'axios';
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

const extractErrorMessage = (err) => {
  const responseData = err?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === 'object') {
    return (
      responseData.detail ||
      responseData.error ||
      responseData.message ||
      responseData.msg ||
      JSON.stringify(responseData)
    );
  }

  return err?.message || 'Terjadi kesalahan saat menambah konfirmasi transaksi.';
};

/**
 * @returns { Object } - Mengembalikan fungsi postKonfirmasiTransaksi, serta status loading dan error.
 */
const usePostKonfirmasiTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendFormDataRequest = async (payload) => {
    const baseURL = String(api?.defaults?.baseURL || '').replace(/\/+$/, '');
    const endpoint = String(endpoints.konfirmasi_transaksi.create || '');
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    return axios.post(url, payload, {
      timeout: api?.defaults?.timeout || 300000,
      headers: {
        Accept: 'application/json',
      },
    });
  };

  /**
   * Fungsi untuk mengirim data konfirmasi transaksi ke backend.
   * Dapat menerima object biasa atau FormData.
   * @param {Object|FormData} payload
   * @returns {Promise<Object|null>}
   */
  const postKonfirmasiTransaksi = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      if (payload instanceof FormData) {
        console.log(
          'Payload konfirmasi transaksi:',
          Array.from(payload.entries()).map(([key, value]) => [
            key,
            value instanceof File
              ? { name: value.name, size: value.size, type: value.type }
              : value,
          ])
        );
      }

      const response = payload instanceof FormData
        ? await sendFormDataRequest(payload)
        : await api.post(endpoints.konfirmasi_transaksi.create, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

      return response.data;
    } catch (err) {
      console.error('Error creating konfirmasi transaksi:', err);
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);

      const enrichedError = new Error(errorMessage);
      enrichedError.response = err?.response;
      throw enrichedError;
    } finally {
      setLoading(false);
    }
  };

  return { postKonfirmasiTransaksi, loading, error };
};

export default usePostKonfirmasiTransaksi;
