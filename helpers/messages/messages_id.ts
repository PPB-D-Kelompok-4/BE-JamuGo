import { MessagesKey } from './messagesKey';

export const messages_id = {
  // Common Error messages
  [MessagesKey.NODATAFOUND]: 'Data tidak ditemukan',
  [MessagesKey.INTERNALSERVERERROR]: 'Kesalahan server internal',
  [MessagesKey.UNKNOWNERROR]: 'Terjadi kesalahan yang tidak diketahui',
  [MessagesKey.BADREQUEST]: 'Permintaan tidak valid.',
  [MessagesKey.UNAUTHORIZED]: 'Tidak terotorisasi.',
  [MessagesKey.SPESIFICDATANOTFOUND]: '{0} tidak ditemukan.',
  [MessagesKey.ERRORCREATION]:
    'Gagal membuat {0}. Metode pembuatan tidak mengembalikan instansi model yang valid.',
  [MessagesKey.ERRORCREATEUSER]: 'Gagal membuat pengguna di Firebase.',
  [MessagesKey.EMAILALREADYEXISTS]: 'Email sudah digunakan.',
  [MessagesKey.IMAGEDELETIONERROR]: 'Gagal menghapus file gambar.',

  // Common Success messages
  [MessagesKey.SUCCESSGET]: 'Data telah ditemukan.',
  [MessagesKey.SUCCESSGETBYID]:
    'Data telah ditemukan berdasarkan kriteria yang ditentukan.',
  [MessagesKey.SUCCESSCREATE]: 'Data telah dibuat.',
  [MessagesKey.SUCCESSBULKCREATE]: 'Data telah dibuat secara massal.',
  [MessagesKey.SUCCESSUPDATE]: 'Data telah diperbarui.',
  [MessagesKey.SUCCESSBULKUPDATE]: 'Data telah diperbarui secara massal.',
  [MessagesKey.SUCCESSHARDDELETE]: 'Data telah dihapus secara permanen.',
  [MessagesKey.SUCCESSSOFTDELETE]: 'Data telah dihapus secara lunak.',
  [MessagesKey.SUCCESSRESTORE]: 'Data telah dipulihkan.',
  [MessagesKey.SUCCESSRESETPASSWORD]: 'Email reset kata sandi telah dikirim.',

  // Repository messages
  [MessagesKey.ERRORFINDINGALL]: 'Terjadi kesalahan saat mencari semua data',
  [MessagesKey.ERRORFINDINGBYID]:
    'Terjadi kesalahan saat mencari data berdasarkan ID',
  [MessagesKey.ERRORCREATE]: 'Terjadi kesalahan saat membuat data.',
  [MessagesKey.ERRORBULKCREATE]:
    'Terjadi kesalahan saat membuat data secara massal.',
  [MessagesKey.ERRORHARDDELETING]:
    'Terjadi kesalahan saat menghapus data secara permanen.',
  [MessagesKey.ERRORSOFTDELETING]:
    'Terjadi kesalahan saat menghapus data secara lunak.',
  [MessagesKey.ERRORRESTORING]: 'Terjadi kesalahan saat memulihkan data.',

  // Business Logic messages
  [MessagesKey.INVALIDPASSWORD]:
    'Kata sandi tidak valid. Kata sandi harus terdiri dari minimal 8 karakter, mengandung setidaknya satu huruf besar, satu huruf kecil, satu digit, dan satu karakter khusus.',
  [MessagesKey.CUSTOMERROLENOTFOUND]: 'Peran pelanggan tidak ditemukan.',
  [MessagesKey.NOFILEUPLOADED]: 'Tidak ada file yang diunggah.',
  [MessagesKey.INVALIDCREDENTIALS]: 'Kredensial tidak valid.',
  [MessagesKey.USERNOTFOUND]: 'Pengguna tidak ditemukan.',
  [MessagesKey.USERUPDATENOTFOUND]: 'Pembaruan pengguna tidak ditemukan.',
  [MessagesKey.INVALIDEMAIL]: 'Format email tidak valid.',
  [MessagesKey.ORDERALREADYCANCELLED]: 'Pesanan sudah dibatalkan.',
  [MessagesKey.ORDERCANCELLED]: 'Pesanan berhasil dibatalkan.',
  [MessagesKey.INVALIDORDERSTATUS]: 'Status pesanan tidak valid.',
  [MessagesKey.ROLENOTFOUND]: 'Peran tidak ditemukan.',
};
