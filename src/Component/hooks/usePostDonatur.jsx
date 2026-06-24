import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDonatur, serta status loading dan error.
 */
const usePostDonatur = (endpointSource = endpoints) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildValidationMessage = (responseData) => {
    const baseMessage =
      responseData?.error ||
      responseData?.message ||
      'Terjadi kesalahan saat mengupload data.';
    const validationErrors = responseData?.errors;

    if (!validationErrors || typeof validationErrors !== 'object') {
      return baseMessage;
    }

    const flatErrors = Object.entries(validationErrors)
      .flatMap(([field, messages]) => {
        if (Array.isArray(messages)) {
          return messages.map((message) => `${field}: ${message}`);
        }

        if (messages) {
          return [`${field}: ${messages}`];
        }

        return [];
      })
      .filter(Boolean);

    return flatErrors.length ? `${baseMessage} - ${flatErrors.join(' | ')}` : baseMessage;
  };

  const toNullableText = (value) => {
    const trimmedValue = String(value || '').trim();
    return trimmedValue ? trimmedValue : null;
  };

  const toTrimmedText = (value) => String(value || '').trim();

  const buildPayloadVariants = (payload) => {
    const nullableKeys = [
      'nik',
      'alamat',
      'tempat_lahir',
      'tanggal_lahir',
      'agama',
      'status_perkawinan',
      'pekerjaan',
      'kewarganegaraan',
      'password',
    ];

    const variants = [
      payload,
      {
        ...payload,
        ...Object.fromEntries(nullableKeys.map((key) => [key, undefined])),
      },
      {
        ...payload,
        is_register: undefined,
      },
      {
        ...payload,
        isRegister: undefined,
      },
      {
        ...payload,
        isRegister: undefined,
        is_register: undefined,
      },
    ];

    const seen = new Set();

    return variants.filter((variant) => {
      const sanitizedVariant = { ...variant };

      Object.keys(sanitizedVariant).forEach((key) => {
        if (sanitizedVariant[key] === undefined) {
          delete sanitizedVariant[key];
        }
      });

      const signature = JSON.stringify(sanitizedVariant);
      if (seen.has(signature)) {
        return false;
      }

      seen.add(signature);
      return true;
    });
  };

  const buildDonaturPayload = ({
    nik,
    nama,
    alamat,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    status_perkawinan,
    pekerjaan,
    kewarganegaraan,
    no_hp,
    email,
    password,
    isRegister,
    id_lembaga,
  }) => {
    const normalizedIsRegister =
      isRegister === null || isRegister === undefined ? null : Number(isRegister);
    const isRegisteredDonatur = normalizedIsRegister === 1;
    const fallbackNama = normalizedIsRegister === 1 ? 'Donatur Baru' : 'Donatur Tamu';
    const fallbackJenisKelamin = normalizedIsRegister === 1 ? 'Belum diisi' : 'Laki-laki';

    return {
      nik: toNullableText(nik),
      nama: toTrimmedText(nama) || fallbackNama,
      alamat: toNullableText(alamat),
      tempat_lahir: toNullableText(tempat_lahir),
      tanggal_lahir: toNullableText(tanggal_lahir),
      jenis_kelamin: toTrimmedText(jenis_kelamin) || fallbackJenisKelamin,
      agama: toNullableText(agama),
      status_perkawinan: toNullableText(status_perkawinan),
      pekerjaan: toNullableText(pekerjaan),
      kewarganegaraan: toNullableText(kewarganegaraan),
      id_lembaga: isRegisteredDonatur ? toNullableText(id_lembaga) : null,
      no_hp: toTrimmedText(no_hp),
      email: toTrimmedText(email),
      password: isRegisteredDonatur ? toNullableText(password) : undefined,
      ...(normalizedIsRegister === null
        ? {}
        : {
            isRegister: normalizedIsRegister,
            is_register: normalizedIsRegister,
          }),
    };
  };

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } nik 
   * @param { string } nama 
   * @param { string } alamat 
   * @param { string } tempat_lahir
   * @param { string } tanggal_lahir
   * @param { string } jenis_kelamin
   * @param { string } agama
   * @param { string } status_perkawinan
   * @param { string } pekerjaan
   * @param { string } kewarganegaraan
   * @param { string } no_hp
   * @param { string } email
   * @param { string } password
   * @param { number | null } isRegister
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postDonatur = async (nik, nama, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_perkawinan, pekerjaan, kewarganegaraan, no_hp, email, password, isRegister = null, id_lembaga = null) => {
    setLoading(true);
    setError(null);

    try {
      const standardizedPayload = buildDonaturPayload({
        nik,
        nama,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        agama,
        status_perkawinan,
        pekerjaan,
        kewarganegaraan,
        no_hp,
        email,
        password,
        isRegister,
        id_lembaga,
      });
      const normalizedIsRegister =
        isRegister === null || isRegister === undefined ? null : Number(isRegister);
      const payloadVariants = normalizedIsRegister === 1
        ? buildPayloadVariants(standardizedPayload)
        : [
            standardizedPayload,
            {
              ...standardizedPayload,
              is_register: undefined,
            },
            {
              ...standardizedPayload,
              isRegister: undefined,
            },
            {
              ...standardizedPayload,
              isRegister: undefined,
              is_register: undefined,
            },
          ].filter((variant, index, allVariants) => {
            const sanitizedVariant = { ...variant };

            Object.keys(sanitizedVariant).forEach((key) => {
              if (sanitizedVariant[key] === undefined) {
                delete sanitizedVariant[key];
              }
            });

            return (
              allVariants.findIndex((candidate) => {
                const sanitizedCandidate = { ...candidate };

                Object.keys(sanitizedCandidate).forEach((key) => {
                  if (sanitizedCandidate[key] === undefined) {
                    delete sanitizedCandidate[key];
                  }
                });

                return JSON.stringify(sanitizedCandidate) === JSON.stringify(sanitizedVariant);
              }) === index
            );
          });
      let lastError = null;

      for (let index = 0; index < payloadVariants.length; index += 1) {
        const data = { ...payloadVariants[index] };

        Object.keys(data).forEach((key) => {
          if (data[key] === undefined) {
            delete data[key];
          }
        });

        console.log(`Payload donatur varian #${index + 1} yang dikirim:`, data);

        try {
          const response = await api.post(endpointSource.donatur.create, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          return response.data;
        } catch (variantError) {
          lastError = variantError;
          console.error(`Payload donatur varian #${index + 1} gagal:`, {
            status: variantError.response?.status,
            responseData: variantError.response?.data,
            responseDataString: JSON.stringify(variantError.response?.data || {}),
          });
        }
      }

      throw lastError || new Error('Gagal mengupload data donatur.');
    } catch (err) {
      console.error('Error uploading data:', err);
      console.error('Error details donatur:', {
        status: err.response?.status,
        responseData: err.response?.data,
        responseDataString: JSON.stringify(err.response?.data || {}),
      });
      setError(buildValidationMessage(err.response?.data));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postDonatur, loading, error };
};

export default usePostDonatur;
