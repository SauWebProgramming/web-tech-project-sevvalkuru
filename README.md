[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Xg2jV1i2)
# SineLib: Gelişmiş Medya Kütüphanesi ve Yönetim Sistemi

Bu proje, **Sakarya Üniversitesi ** Web Programlama dersi projesi olarak geliştirilmiştir. Projenin temel amacı; modern JavaScript tekniklerini kullanarak, performanslı, erişilebilir ve kullanıcı dostu bir medya yönetim arayüzü sunmaktır.

---

##  Canlı Uygulama Linki
Projenin yayındaki haline buradan ulaşabilirsiniz: 
👉 [https://sauwebprogramming.github.io/web-tech-project-sevvalkuru/](https://sauwebprogramming.github.io/web-tech-project-sevvalkuru/)

---

## 🛠 Teknik Mimari ve Uygulanan Zorunlu Gereksinimler

### 1. Dinamik Veri Yönetimi (Fetch API)
Statik içerik yerine, veriler projenin kök dizininde bulunan `data.json` dosyasından **Fetch API** ve **Async/Await** yapısı kullanılarak çekilmektedir. Bu yaklaşım, uygulamanın gerçek zamanlı bir API ile çalışmaya hazır olduğunu gösterir.

### 2. Single Page Application (SPA) Yapısı
Uygulama içerisinde detay görünümleri için yeni bir HTML sayfası yüklenmez. JavaScript DOM manipülasyonu sayesinde, kullanıcı bir karta tıkladığında içerik dinamik olarak oluşturulan bir **Modal (Detay Penceresi)** içerisinde sunulur. Bu, sayfa yenileme hızını ortadan kaldırarak akıcı bir deneyim sağlar.

### 3. Gelişmiş Arama ve Filtreleme Algoritması
Kullanıcılar;
* **Arama Çubuğu:** İsim üzerinden anlık (real-time) arama yapabilir.
* **Kategori Filtresi:** Film, Dizi veya Kitap türlerine göre listeyi daraltabilir.
* **Sıralama Motoru:** Yıla göre "Eskiden Yeniye" veya "Yeniden Eskiye" sıralama yapabilir. (Zorunlu gereksinime eklenen fonksiyonel özelliktir).

### 4. LocalStorage ile Favori Sistemi
Kullanıcıların beğendiği içerikler, tarayıcının **LocalStorage** alanında JSON formatında saklanır. Bu sayede kullanıcı sayfayı kapatsa veya tarayıcıyı yeniden başlatsa dahi favori listesi korunur.

---

## 🌟 Bonus ve Yaratıcı Özellikler (Puan Artırıcı Detaylar)

### ♿ Erişilebilirlik (A11y - Accessibility)
* Tüm etkileşimli öğeler (butonlar, kartlar) için semantik etiketler ve `aria-label` tanımlamaları yapılmıştır.
* Resimlerin yüklenememesi durumunda `alt` etiketleri ve `onerror` kontrolü ile yedek görseller devreye girmektedir.

### 🎨 Modern UI ve Mikro Etkileşimler
* **CSS Animations:** Kartların üzerine gelindiğinde (hover) `cubic-bezier` geçişleri ile derinlik hissi veren yükselme efekti eklenmiştir.
* **Responsive Design:** CSS Grid ve Flexbox sistemleri ile uygulama; masaüstü, tablet ve mobil cihazlara tam uyumlu hale getirilmiştir.
* **Dinamik UI:** Medyanın türüne göre (Örn: Kitap ise 'Yazar', Film ise 'Oyuncular') arayüzdeki başlıklar otomatik olarak değişmektedir.

### ⚡ Performans Optimizasyonu
* Görsellerin yüklenme sürecinde sayfa düzeninin bozulmaması için sabit oranlı resim alanları tanımlanmıştır.
* DOM manipülasyonları, tarayıcıyı yormayacak şekilde optimize edilmiştir.

---

## 📂 Proje Yapısı
```text
/
├── index.html      # Ana yapı ve SEO uyumlu HTML5 iskeleti
├── style.css       # Özelleştirilmiş animasyonlar ve modern tasarım
├── app.js          # Uygulama mantığı ve dinamik süreçler
├── data.json       # 15 adet medya öğesini içeren veri tabanı
└── README.md       # Proje dökümantasyonu

Hazırlayan
Ad Soyad: Şevval Kuru

Öğrenci No: B241200036

Ders: Web Teknolojileri