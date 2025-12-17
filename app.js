const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const yearSort = document.getElementById('yearSort');

let allData = [];

// 1. Veri Çekme ve Başlatma
const init = async () => {
    try {
        const res = await fetch('data.json');
        allData = await res.json();
        renderCards(allData);
    } catch (err) {
        console.error("Veriler yuklenemedi:", err);
    }
};

// 2. Liste/Grid Görünümü (Zorunlu İşlev 1)
const renderCards = (items) => {
    if (items.length === 0) {
        mediaGrid.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">Aradığınız kriterlere uygun içerik bulunamadı.</p>`;
        return;
    }
    mediaGrid.innerHTML = items.map(item => `
        <div class="card" onclick="showDetails(${item.id})">
            <div class="rating-badge">★ ${item.rating}</div>
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x450?text=Resim+Yok'">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.category}</p>
                <button class="fav-btn" onclick="event.stopPropagation(); addToFav(${item.id})">Favorilere Ekle</button>
            </div>
        </div>
    `).join('');
};

// 3. Arama, Kategori Filtreleme ve Yıla Göre Sıralama (Zorunlu İşlev 2)
const handleFiltersAndSort = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryTerm = categoryFilter.value;
    const sortTerm = yearSort.value;

    // Önce filtrele
    let result = allData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === "all" || item.category === categoryTerm;
        return matchesSearch && matchesCategory;
    });

    // Sonra Yıla Göre Sırala (Eskiden Yeniye / Yeniden Eskiye)
    if (sortTerm === "newest") {
        result.sort((a, b) => b.year - a.year);
    } else if (sortTerm === "oldest") {
        result.sort((a, b) => a.year - b.year);
    }

    renderCards(result);
};

// Olay Dinleyicileri
[searchInput, categoryFilter, yearSort].forEach(el => {
    if(el) el.addEventListener('input', handleFiltersAndSort);
});

// 4. Detay Sayfası - SPA (Zorunlu İşlev 3)
const showDetails = (id) => {
    const item = allData.find(m => m.id === id);
    
    // Kitap ise Yazar, Medya ise Oyuncular bilgisini goster
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

// 5. Favorilerim - LocalStorage (Zorunlu İşlev 4)
const addToFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('userFavs')) || [];
    if (!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem('userFavs', JSON.stringify(favs));
        alert("Favorilere eklendi!");
    } else {
        alert("Bu zaten favorilerinizde.");
    }
};

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

init();