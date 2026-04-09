// src/Services/endpoints.js
const endpointsUser = {
  donatur: {
    getAll: '/api/donatur',
    getById: (id) => `/api/donatur/get/${id}`,
    create: '/api/donatur/insert',
    login: '/api/donatur/login',
    update: (id) => `/api/donatur/update/${id}`,
    delete: (id) => `/api/donatur/delete/${id}`,
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

    detail_transaksi: {
      getAll: '/api/detail-transaksi',
      getById: (id) => `/api/detail-transaksi/get/${id}`,
      create: '/api/detail-transaksi/insert',
      login: '/api/detail-transaksi/login',
      update: (id) => `/api/detail-transaksi/update/${id}`,
      delete: (id) => `/api/detail-transaksi/delete/${id}`,
    },
  
    himpun: {
      getAll: '/api/himpun',
      getById: (id) => `/api/himpun/get/${id}`,
      create: '/api/himpun/insert',
      login: '/api/himpun/login',
      update: (id) => `/api/himpun/update/${id}`,
      delete: (id) => `/api/himpun/delete/${id}`,
    },

    infak_terikat: {
      getAll: '/api/infak-terikat',
      getById: (id) => `/api/infak-terikat/get/${id}`,
      create: '/api/infak-terikat/insert',
      login: '/api/infak-terikat/login',
      update: (id) => `/api/infak-terikat/update/${id}`,
      delete: (id) => `/api/infak-terikat/delete/${id}`,
    },

    infak_umum: {
      getAll: '/api/infak-umum',
      getById: (id) => `/api/infak-umum/get/${id}`,
      create: '/api/infak-umum/insert',
      login: '/api/infak-umum/login',
      update: (id) => `/api/infak-umum/update/${id}`,
      delete: (id) => `/api/infak-umum/delete/${id}`,
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

    zakat: {
      getAll: '/api/zakat',
      getById: (id) => `/api/zakat/get/${id}`,
      create: '/api/zakat/insert',
      login: '/api/zakat/login',
      update: (id) => `/api/zakat/update/${id}`,
      delete: (id) => `/api/zakat/delete/${id}`,
    },

    informasi: {
      getAll: '/api/informasi-mahasiswa',
      getById: (id) => `/api/informasi-mahasiswa/get/${id}`,
      create: '/api/informasi-mahasiswa/insert',
      update: (id) => `/api/informasi-mahasiswa/update/${id}`,
      delete: (id) => `/api/informasi-mahasiswa/delete/${id}`,
    },

    qrcode: {
       getAll: '/api/qrcode',
       getActive: '/api/qrcode/active',
      getById: (id) => `/api/qrcode/get/${id}`,
      create: '/api/qrcode/insert',
      update: (id) => `/api/qrcode/update/${id}`,
      delete: (id) => `/api/qrcode/delete/${id}`,
     

    },
};


export default endpointsUser;