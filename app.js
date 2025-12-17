const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const yearFilter = document.getElementById('yearFilter');

let allData = [];

// 1. Verileri data.json'dan Çekme
const init = async () => {
    try {
        const res = await fetch('data.json');
        allData = await res.json();
        renderCards(allData);
    } catch (error) {
        console.error("Veri yükleme hatası:", error);
    }
};

// 2. Kartları Ekrana Basma (Grid Görünümü)
const renderCards = (items) => {
    if (items.length === 0) {
        mediaGrid.innerHTML = "<p>Sonuç bulunamadı.</p>";
        return;
    }
    mediaGrid.innerHTML = items.map(item => `
        <div class="card" onclick="showDetails(${item.id})">
            <div class="rating-badge">★ ${item.rating}</div>
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x450?text=Resim+Bulunamadi'">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.category}</p>
                <button onclick="event.stopPropagation(); addToFav(${item.id})">Favorilere Ekle</button>
            </div>
        </div>
    `).join('');
};

// 3. Arama ve Filtreleme Mantığı
const handleFilters = () => {
    const searchVal = searchInput.value.toLowerCase();
    const catVal = categoryFilter.value;
    const yearVal = yearFilter.value;

    const filtered = allData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchVal);
        const matchesCategory = catVal === "all" || item.category === catVal;
        const matchesYear = !yearVal || item.year.toString() === yearVal;
        return matchesSearch && matchesCategory && matchesYear;
    });
    renderCards(filtered);
};

// Filtre tetikleyicileri
[searchInput, categoryFilter, yearFilter].forEach(el => {
    if(el) el.addEventListener('input', handleFilters);
});

// 4. Detay Sayfası (SPA - Modal)
const showDetails = (id) => {
    const item = allData.find(m => m.id === id);
    
    // Kitap ise Yazar, değilse Oyuncular bilgisini seç
    const extraLabel = item.category === "Kitap" ? "Yazar" : "Oyuncular";
    const extraContent = item.category === "Kitap" ? (item.writer || "Bilinmiyor") : (item.actors || "Bilinmiyor");

    document.getElementById('modalBody').innerHTML = `
        <img src="${item.image}" style="width:100%; border-radius:10px; max-height:300px; object-fit:contain; margin-bottom:15px;">
        <h2>${item.title} (${item.year})</h2>
        <p><strong>Tür:</strong> ${item.category} | <strong>Puan:</strong> ★${item.rating}</p>
        <p><strong>${extraLabel}:</strong> ${extraContent}</p>
        <p style="margin-top:10px;"><strong>Özet:</strong> ${item.desc || "Açıklama bulunmuyor."}</p>
    `;
    document.getElementById('modalOverlay').classList.remove('hidden');
};

// 5. Favorilerim (LocalStorage)
const addToFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('myFavs')) || [];
    if (!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem('myFavs', JSON.stringify(favs));
        alert("Favorilere başarıyla eklendi!");
    } else {
        alert("Bu içerik zaten favorilerinizde.");
    }
};

// Favorileri Göster
document.getElementById('showFavsBtn').onclick = () => {
    const favIds = JSON.parse(localStorage.getItem('myFavs')) || [];
    const favItems = allData.filter(item => favIds.includes(item.id));
    renderCards(favItems);
};

// Tüm Listeye Dön
document.getElementById('showAllBtn').onclick = () => renderCards(allData);

// Modal Kapat
document.getElementById('closeModal').onclick = () => {
    document.getElementById('modalOverlay').classList.add('hidden');
};

init();