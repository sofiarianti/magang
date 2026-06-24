// src/Services/endpoints.js
const endpointsUser = {
  donatur: {
    getAll: '/api/donatur',
    getById: (id) => `/api/donatur/get/${id}`,
    create: '/api/donatur/insert',
    login: '/api/donatur/login',
    update: (id) => `/api/donatur/update/${id}`,
    delete: (id) => `/api/donatur/delete/${id}`,
    getByLembaga: (id_lembaga) => `/api/donatur/by-lembaga/${id_lembaga}`,
    sendOtp: '/api/donatur/password/otp-request',
    resetPassword: '/api/donatur/password/otp-verify',
  },
  
    detail_donasi: {
      getAll: '/api/detail-donasi',
      getById: (id) => `/api/detail-donasi/get/${id}`,
      create: '/api/detail-donasi/insert',
      login: '/api/detail-donasi/login',
      update: (id) => `/api/detail-donasi/update/${id}`,
      delete: (id) => `/api/detail-donasi/delete/${id}`,
    },

    himpun: {
      getAll: '/api/himpun',
      getById: (id) => `/api/himpun/get/${id}`,
      create: '/api/himpun/insert',
      login: '/api/himpun/login',
      update: (id) => `/api/himpun/update/${id}`,
      delete: (id) => `/api/himpun/delete/${id}`,
    },

    detail_himpun: {
      getAll: '/api/detail-himpun',
      getById: (id) => `/api/detail-himpun/get/${id}`,
      getByHimpun: (kode_himpun) => `/api/detail-himpun/by-himpun/${kode_himpun}`,
      create: '/api/detail-himpun/insert',
      login: '/api/detail-himpun/login',
      update: (id) => `/api/detail-himpun/update/${id}`,
      delete: (id) => `/api/detail-himpun/delete/${id}`,
    },

    jenis_donasi: {
      getAll: '/api/jenis-donasi',
      getById: (id) => `/api/jenis-donasi/get/${id}`,
      create: '/api/jenis-donasi/insert',
      login: '/api/jenis-donasi/login',
      update: (id) => `/api/jenis-donasi/update/${id}`,
      delete: (id) => `/api/jenis-donasi/delete/${id}`,
    },

    transaksi: {
      getAll: '/api/transaksi',
      getById: (id) => `/api/transaksi/get/${id}`,
      getByDonatur: (idDonatur) =>
        `/api/transaksi/donatur/${idDonatur}`,
      getByKodeDonatur: (kd_donatur) =>
        `/api/transaksi/by-donatur/${kd_donatur}`,
      create: '/api/transaksi/insert',
      login: '/api/transaksi/login',
      update: (id) => `/api/transaksi/update/${id}`,
      delete: (id) => `/api/transaksi/delete/${id}`,
    },

    konfirmasi_transaksi: {
      getAll: '/api/konfirmasi-transaksi',
      getById: (id) => `/api/konfirmasi-transaksi/get/${id}`,
      getByTransaksi: (id_transaksi) =>
        `/api/konfirmasi-transaksi/by-transaksi/${id_transaksi}`,
      getByTransaksiKurban: (id_transaksi_kurban) =>
        `/api/konfirmasi-transaksi/by-transaksi-kurban/${id_transaksi_kurban}`,
      create: '/api/konfirmasi-transaksi/insert',
      update: (id) => `/api/konfirmasi-transaksi/update/${id}`,
      delete: (id) => `/api/konfirmasi-transaksi/delete/${id}`,
    },

    lembaga: {
      getAll: '/api/lembaga',
      getById: (id) => `/api/lembaga/get/${id}`,
      create: '/api/lembaga/insert',
      update: (id) => `/api/lembaga/update/${id}`,
      delete: (id) => `/api/lembaga/delete/${id}`,
    },

    informasi: {
      getAll: '/api/informasi-mahasiswa',
      getById: (id) => `/api/informasi-mahasiswa/get/${id}`,
      create: '/api/informasi-mahasiswa/insert',
      update: (id) => `/api/informasi-mahasiswa/update/${id}`,
      delete: (id) => `/api/informasi-mahasiswa/delete/${id}`,
    },

    program: {
      getAll: '/api/program',
      getById: (id) => `/api/program/get/${id}`,
      create: '/api/program/insert',
      update: (id) => `/api/program/update/${id}`,
      delete: (id) => `/api/program/delete/${id}`,
    },

    penyaluran_program: {
      getAll: '/api/penyaluran-program',
      getById: (id) => `/api/penyaluran-program/get/${id}`,
      create: '/api/penyaluran-program/insert',
      update: (id) => `/api/penyaluran-program/update/${id}`,
      delete: (id) => `/api/penyaluran-program/delete/${id}`,
    },

    qrcode: {
       getAll: '/api/qrcode',
       getActive: '/api/qrcode/active',
      generate: '/api/qrcode/generate',
      getById: (id) => `/api/qrcode/get/${id}`,
      create: '/api/qrcode/insert',
      update: (id) => `/api/qrcode/update/${id}`,
      delete: (id) => `/api/qrcode/delete/${id}`,
     

    },

    laporan_bsz: {
      generate: '/api/laporan-bsz/generate',
    },
};


export default endpointsUser;
