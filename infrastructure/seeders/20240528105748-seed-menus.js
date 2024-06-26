'use strict';

const BASE_URL = process.env.BASE_URL || 'http://103.127.132.182:3009';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'menus',
      [
        {
          name: 'Jamu Kunyit Asam',
          description:
            'Minuman herbal dengan rasa asam dan sedikit manis yang terbuat dari kunyit dan asam jawa. Dikenal dapat meningkatkan daya tahan tubuh.',
          price: 15000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_kunyit_asam.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jamu Beras Kencur',
          description:
            'Minuman tradisional yang terbuat dari beras yang direndam dan kencur, memberikan rasa manis dan segar. Baik untuk meningkatkan nafsu makan.',
          price: 15000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_beras_kencur.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jamu Temulawak',
          description:
            'Minuman sehat yang terbuat dari temulawak, terkenal dengan manfaatnya untuk meningkatkan fungsi hati dan sistem pencernaan.',
          price: 16000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_temulawak.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jamu Jahe Merah',
          description:
            'Minuman herbal yang terbuat dari jahe merah, memiliki rasa pedas khas dan manfaat untuk meningkatkan sistem kekebalan tubuh.',
          price: 18000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_jahe_merah.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jamu Sinom',
          description:
            'Minuman menyegarkan yang terbuat dari daun asam muda dan kunyit. Dikenal dapat membantu mengatasi kelelahan dan memperbaiki pencernaan.',
          price: 14000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_sinom.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jamu Cabe Puyang',
          description:
            'Minuman tradisional yang terbuat dari cabe jawa dan puyang, baik untuk mengatasi pegal-pegal dan nyeri tubuh.',
          price: 17000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_cabe_puyang.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jamu Kunci Sirih',
          description:
            'Minuman herbal yang terbuat dari kunci dan sirih, dikenal untuk menjaga kesehatan wanita dan mengurangi bau badan.',
          price: 16000,
          image_url: `${BASE_URL}/assets/image-menus/jamu_kunci_sirih.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Wedang Uwuh',
          description:
            'Minuman herbal khas Yogyakarta yang terbuat dari campuran rempah-rempah seperti jahe, serai, kayu manis, dan cengkeh. Menghangatkan tubuh.',
          price: 18000,
          image_url: `${BASE_URL}/assets/image-menus/wedang_uwuh.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Wedang Jahe',
          description:
            'Minuman hangat yang terbuat dari jahe segar, dikenal dapat menghangatkan tubuh dan meredakan sakit tenggorokan.',
          price: 15000,
          image_url: `${BASE_URL}/assets/image-menus/wedang_jahe.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Wedang Ronde',
          description:
            'Minuman tradisional yang terbuat dari air jahe dengan bola-bola ketan berisi kacang tanah. Nikmat diminum hangat.',
          price: 20000,
          image_url: `${BASE_URL}/assets/image-menus/wedang_ronde.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Teh Rosella',
          description:
            'Minuman herbal yang terbuat dari bunga rosella kering, memiliki rasa asam manis dan kaya akan antioksidan.',
          price: 13000,
          image_url: `${BASE_URL}/assets/image-menus/teh_rosella.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Teh Bunga Telang',
          description:
            'Minuman berwarna biru alami yang terbuat dari bunga telang, dikenal dapat membantu mengurangi stres dan meningkatkan kualitas tidur.',
          price: 15000,
          image_url: `${BASE_URL}/assets/image-menus/teh_bunga_telang.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jus Lidah Buaya',
          description:
            'Minuman segar yang terbuat dari lidah buaya, baik untuk kesehatan kulit dan pencernaan.',
          price: 17000,
          image_url: `${BASE_URL}/assets/image-menus/jus_lidah_buaya.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jus Mengkudu',
          description:
            'Minuman herbal dengan rasa yang khas, terbuat dari buah mengkudu. Dikenal memiliki banyak manfaat kesehatan, termasuk meningkatkan kekebalan tubuh.',
          price: 19000,
          image_url: `${BASE_URL}/assets/image-menus/jus_mengkudu.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
        {
          name: 'Jus Sirsak',
          description:
            'Minuman segar yang terbuat dari buah sirsak, dikenal dengan rasa manis asam yang menyegarkan dan manfaat untuk kesehatan pencernaan.',
          price: 18000,
          image_url: `${BASE_URL}/assets/image-menus/jus_sirsak.jpg`,
          created_by: 'system',
          created_date: new Date(),
          created_host: 'localhost',
          is_deleted: false,
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('menus', null, {});
  },
};
