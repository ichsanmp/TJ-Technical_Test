# DemoQA Automation Test

Automation test untuk beberapa halaman di [demoqa.com](https://demoqa.com), memakai Playwright dan TypeScript dengan pola Page Object Model.

## Cakupan test

- Web Tables: menambah beberapa user dari file JSON, lalu memastikan setiap user muncul di tabel dengan data yang sama di tiap kolom, termasuk yang berada di halaman berikutnya.
- Droppable: drag elemen ke area target di tab Simple, lalu cek area target berubah menjadi "Dropped!" dan elemen berada di dalamnya.
- Resizable: ubah ukuran kotak menjadi 400 x 200 piksel, untuk kotak yang dibatasi maupun yang tidak, lalu cek ukuran akhirnya.
- Practice Form: isi dan submit Student Registration Form, lalu bandingkan data yang diinput dengan data di popup konfirmasi. Upload gambar tidak diikutkan.

## Struktur project

```
.
├── .github/workflows/
│   └── playwright.yml        workflow GitHub Actions
├── data/demoqa_webtables/
│   └── webtables-data.json   data user untuk test Web Tables
├── pages/demoqa/             page object (aksi dan verifikasi per halaman)
├── selectors/demoqa/         locator per halaman
├── tests/
│   ├── demoqa/               spec untuk tiap halaman
│   └── example.spec.ts       contoh bawaan Playwright
├── utility/
│   ├── global-setup.ts       setup global sebelum test dijalankan
│   └── reporter.ts           reporter kustom untuk checklist di terminal
├── .env.qa                   pengaturan environment QA
├── playwright.config.ts
└── package.json
```

Folder `playwright-report` dan `test-results` dibuat otomatis setiap kali test dijalankan.

Spec hanya berisi alur skenario dan assertion. Aksi teknisnya ada di `pages`, dan locator-nya ada di `selectors`.

## Menjalankan test

Install dependensi dan browser:

```bash
npm install
npx playwright install
```

Pengaturan environment ada di `.env.qa`, sesuaikan isinya bila perlu.

Jalankan semua test:

```bash
npx playwright test
```

Jalankan satu file, atau dengan browser terlihat dan berurutan:

```bash
npx playwright test resizable.spec.ts
npx playwright test --headed --workers=1
```

Secara default test berjalan paralel, jadi beberapa browser bisa terbuka bersamaan.

## Hasil test

Selama test berjalan, setiap step muncul di terminal sebagai checklist:

```
should resize restricted box to 400x200
  ✓ Given the restricted box is visible on the Resizable page (120 ms)
  ✓ When the restricted box is resized (1.4 s)
  ✓ Then the restricted box size is 400x200 (60 ms)
  -> passed (3.1 s)
```

Report HTML dibuka dengan:

```bash
npx playwright show-report
```

## Catatan

- Iklan di DemoQA dimuat belakangan dan bisa menggeser layout. Karena itu test Droppable dan Resizable menunggu posisi elemen diam sebelum drag.
- Droppable dan Resizable memakai gerakan mouse manual, bukan `dragTo()`, karena komponennya butuh event mouse bertahap.