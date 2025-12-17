/**
 * SineLib - Medya Kitaplığı Uygulaması
 * Bu dosya; Veri çekme, Filtreleme, Sıralama, SPA Detay Sayfası 
 * ve LocalStorage Favori yönetimini gerçekleştirir.
 */

const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const yearSort = document.getElementById('yearSort');

let allData = []; // Veritabanından çekilen tüm veriler

// 1. Veri Çekme ve Başlatma (Fetch API)
const init = async () => {
    try {
        const res = await fetch('data.json');
        allData = await res.json();
        renderCards(allData); // Sayfa açıldığında tüm listeyi göster
    } catch (err) {
        console.error("Veriler yuklenirken hata olustu:", err);
        mediaGrid.innerHTML = "<p>Veriler yuklenemedi, lütfen tekrar deneyin.</p>";
    }
};

// 2. Liste/Grid Görünümü (Zorunlu İşlev 1)
const renderCards = (items) => {
    const favIds = JSON.parse(localStorage.getItem('userFavs')) || [];

    if (items.length === 0) {
        mediaGrid.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">Aradığınız kriterlere uygun içerik bulunamadı.</p>`;
        return;
    }

    mediaGrid.innerHTML = items.map(item => {
        const isFav = favIds.includes(item.id);
        
        return `
        <div class="card" onclick="showDetails(${item.id})">
            <div class="rating-badge">★ ${item.rating}</div>
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x450?text=Resim+Yok'">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.category}</p>
                ${isFav 
                    ? `<button class="fav-btn" style="background-color: #555;" onclick="event.stopPropagation(); removeFromFav(${item.id})">Favorilerden Çıkar</button>`
                    : `<button class="fav-btn" onclick="event.stopPropagation(); addToFav(${item.id})">Favorilere Ekle</button>`
                }
            </div>
        </div>
        `;
    }).join('');
};

// 3. Arama, Kategori Filtreleme ve Sıralama (Zorunlu İşlev 2)
const handleFiltersAndSort = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryTerm = categoryFilter.value;
    const sortTerm = yearSort.value;

    // Önce Filtreleme
    let result = allData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === "all" || item.category === categoryTerm;
        return matchesSearch && matchesCategory;
    });

    // Sonra Sıralama (Eskiden Yeniye / Yeniden Eskiye)
    if (sortTerm === "newest") {
        result.sort((a, b) => b.year - a.year);
    } else if (sortTerm === "oldest") {
        result.sort((a, b) => a.year - b.year);
    }

    renderCards(result);
};

// Input ve Select değişimlerini dinle
[searchInput, categoryFilter, yearSort].forEach(el => {
    if(el) el.addEventListener('input', handleFiltersAndSort);
});

// 4. Detay Sayfası - SPA Mantığı (Zorunlu İşlev 3)
const showDetails = (id) => {
    const item = allData.find(m => m.id === id);
    
    // Kitaplar için Yazar, Film/Diziler için Oyuncular başlığı
    const infoLabel = item.category === "Kitap" ? "Yazar" : "Oyuncular";
    const infoValue = item.category === "Kitap" ? item.writer : item.actors;

    document.getElementById('modalBody').innerHTML = `
        <img src="${item.image}" style="width:100%; border-radius:10px; max-height:350px; object-fit:contain;">
        <h2 style="margin-top:15px;">${item.title} (${item.year})</h2>
        <p><strong>Tür:</strong> ${item.category} | <strong>Puan:</strong> ★${item.rating}</p>
        <p><strong>${infoLabel}:</strong> ${infoValue}</p>
        <p style="margin-top:10px;"><strong>Açıklama:</strong> ${item.desc}</p>
    `;
    document.getElementById('modalOverlay').classList.remove('hidden');
};

// 5. Favorilere Ekle - LocalStorage (Zorunlu İşlev 4)
const addToFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('userFavs')) || [];
    if (!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem('userFavs', JSON.stringify(favs));
        renderCards(allData); // Butonun "Çıkar"a dönüşmesi için listeyi yenile
    }
};

// 6. Favorilerden Çıkar
const removeFromFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('userFavs')) || [];
    favs = favs.filter(favId => favId !== id);
    localStorage.setItem('userFavs', JSON.stringify(favs));
    
    // Eğer o an favoriler listesini görüntülüyorsak listeyi güncelle
    const favItems = allData.filter(item => favs.includes(item.id));
    // Eğer tüm listeyi görüntülüyorsak listeyi yenile (butonun değişmesi için)
    handleFiltersAndSort(); 
};

// Buton Olayları (Favorileri Göster / Tüm Liste)
document.getElementById('showFavsBtn').onclick = () => {
    const favIds = JSON.parse(localStorage.getItem('userFavs')) || [];
    const favItems = allData.filter(item => favIds.includes(item.id));
    renderCards(favItems);
};

document.getElementById('showAllBtn').onclick = () => renderCards(allData);

// Modal Kapatma
document.getElementById('closeModal').onclick = () => {
    document.getElementById('modalOverlay').classList.add('hidden');
};

// Uygulamayı Başlat
init();