# Backend System JamuGo

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Architecture](#architecture)
   - [Presentation Layer](#presentation-layer)
   - [Business Logic Layer](#business-logic-layer)
   - [Data Access Layer](#data-access-layer)
5. [Layers and Functions](#layers-and-functions)
    - [Infrastructure Layer](#infrastructure-layer)
    - [Data Access Layer](#data-access-layer)
    - [Business Layer](#business-layer)
    - [Helper Layer](#helper-layer)
    - [Web-Main Layer](#web-main-layer)
6. [Getting Started](#getting-started)
7. [Configuration](#configuration)
8. [Commit Message Guidelines](#commit-message-guidelines)
9. [License](#license)


## Overview

JamuGo adalah aplikasi pemesanan jamu dan minuman herbal tradisional Indonesia yang memungkinkan pengguna untuk memesan dengan mudah dan cepat langsung dari smartphone mereka. 
Backend system ini dibangun dengan menggunakan Express dan TypeScript, serta menggunakan MySQL dan Firebase untuk penyimpanan data dan autentikasi pengguna.

## Prerequisites

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut:
- Node.js
- npm atau yarn
- MySQL
- Firebase account

## Entity Relationship Diagram

Berikut adalah diagram hubungan entitas (ERD) yang digunakan dalam sistem backend JamuGo:

**Figure:** ERD JamuGo</br>
  <img src="https://github.com/kurniacf/PBB_Task-8_Firebase_Simple_Auth/assets/70510279/f747112e-42e6-4298-891d-5cc1ed5f6a87" width="500"/>

## Architecture

### Presentation Layer
Layer ini bertanggung jawab untuk menangani permintaan HTTP dari klien dan mengirimkan respons yang sesuai. Dalam proyek ini, Express digunakan sebagai framework utama.

### Business Logic Layer
Layer logika bisnis mengandung aturan dan alur bisnis yang digunakan dalam aplikasi. Ini mencakup layanan dan logika untuk memproses data yang diterima dari lapisan presentasi sebelum berinteraksi dengan lapisan data.

### Data Access Layer
Layer ini bertanggung jawab untuk berinteraksi dengan database. Dalam proyek ini, MySQL digunakan sebagai database utama, dan Sequelize digunakan sebagai ORM (Object-Relational Mapping).

## Layers and Functions

### Infrastructure Layer
Layer ini menyediakan layanan dasar seperti konfigurasi aplikasi, middleware, dan logging.

### Data Access Layer
Layer ini mengelola koneksi ke database dan operasi CRUD.

### Business Layer
Layer ini mengimplementasikan logika bisnis dan aturan aplikasi.

### Helper Layer
Layer ini menyediakan fungsi dan utilitas tambahan yang mendukung lapisan lain.

### Web-Main Layer
Layer ini menangani rute dan kontroler utama untuk aplikasi web.

## Getting Started

1. Clone repositori ini:

    ```bash
    git clone git@github.com:PPB-D-Kelompok-4/BE-JamuGo.git
    cd JamuGo
    ```

2. Instal dependensi:

    ```bash
    npm install
    ```

3. Buat file `.env` dari template `.env.example` dan isi dengan konfigurasi yang sesuai:

    ```bash
    cp .env.example .env
    ```

4. Migrasi database:

    ```bash
    npx sequelize-cli db:migrate
    ```

5. Jalankan server:

    ```bash
    npm start
    ```

## Configuration

File konfigurasi utama adalah `.env`, yang mencakup pengaturan untuk database, Firebase, dan parameter aplikasi lainnya.

## Commit Message Guidelines

Gunakan format berikut untuk pesan commit:
- `feat`: penambahan fitur baru
- `fix`: perbaikan bug
- `docs`: perubahan dokumentasi
- `style`: perubahan yang tidak mempengaruhi kode (misal: spasi, format, tanda baca)
- `refactor`: perubahan kode yang tidak menambah fitur atau memperbaiki bug
- `test`: penambahan atau perbaikan tes
- `chore`: pembaruan tugas build, manajemen package, dll

## License

Distributed under the MIT License. See LICENSE for more information. Develop with ❤️ by [Kurniacf](https://github.com/kurniacf)
