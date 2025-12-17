/**
 * SineLib - Medya Kitaplığı Uygulaması
 * Bu dosya; Veri çekme, Filtreleme, Sıralama, SPA Detay Sayfası 
 * ve LocalStorage Favori yönetimini gerçekleştirir.
 */

const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const yearSort = document.getElementById('yearSort');

let allData = [];

// 1. Veri Çekme
const init = async () => {
    try {
        const res = await fetch('data.json');
        allData = await res.json();
        renderCards(allData);
    } catch (err) {
        console.error("Hata:", err);
    }
};

// 2. Kartları Ekrana Basma (Erişilebilirlik Destekli)
const renderCards = (items) => {
    const favIds = JSON.parse(localStorage.getItem('userFavs')) || [];

    if (items.length === 0) {
        mediaGrid.innerHTML = `
            <div style="text-align:center; grid-column: 1/-1; padding: 50px;">
                <h2 style="color: #555;">Üzgünüz, aradığınız kriterlere uygun içerik bulunamadı.</h2>
                <button onclick="location.reload()" style="margin-top:20px;">Listeyi Sıfırla</button>
            </div>`;
        return;
    }

    mediaGrid.innerHTML = items.map(item => {
        const isFav = favIds.includes(item.id);
        
        return `
        <div class="card" onclick="showDetails(${item.id})" role="button" aria-label="${item.title} detaylarını gör">
            <div class="rating-badge">★ ${item.rating}</div>
            <img src="${item.image}" alt="${item.title} afişi" onerror="this.src='https://via.placeholder.com/300x450?text=Resim+Yok'">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.category}</p>
                ${isFav 
                    ? `<button class="fav-btn" style="background-color: #444;" onclick="event.stopPropagation(); removeFromFav(${item.id})" aria-label="Favorilerden çıkar">Favorilerden Çıkar</button>`
                    : `<button class="fav-btn" onclick="event.stopPropagation(); addToFav(${item.id})" aria-label="Favorilere ekle">Favorilere Ekle</button>`
                }
            </div>
        </div>
        `;
    }).join('');
};

// 3. Filtreleme ve Sıralama
const handleFiltersAndSort = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryTerm = categoryFilter.value;
    const sortTerm = yearSort.value;

    let result = allData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === "all" || item.category === categoryTerm;
        return matchesSearch && matchesCategory;
    });

    if (sortTerm === "newest") result.sort((a, b) => b.year - a.year);
    else if (sortTerm === "oldest") result.sort((a, b) => a.year - b.year);

    renderCards(result);
};

[searchInput, categoryFilter, yearSort].forEach(el => {
    if(el) el.addEventListener('input', handleFiltersAndSort);
});

// 4. Detay Sayfası - SPA
const showDetails = (id) => {
    const item = allData.find(m => m.id === id);
    const infoLabel = item.category === "Kitap" ? "Yazar" : "Oyuncular";
    const infoValue = item.category === "Kitap" ? item.writer : item.actors;

    document.getElementById('modalBody').innerHTML = `
        <img src="${item.image}" style="width:100%; border-radius:10px; max-height:350px; object-fit:contain;">
        <h2 style="margin-top:20px; color:#e50914;">${item.title}</h2>
        <p style="font-size: 1.2rem; margin-bottom:10px;">${item.year} | ★${item.rating}</p>
        <p><strong>${infoLabel}:</strong> ${infoValue}</p>
        <hr style="border: 0.5px solid #333; margin: 15px 0;">
        <p style="color: #ccc; font-style: italic;">${item.desc}</p>
    `;
    document.getElementById('modalOverlay').classList.remove('hidden');
};

// 5. Favori Yönetimi
const addToFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('userFavs')) || [];
    if (!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem('userFavs', JSON.stringify(favs));
        handleFiltersAndSort(); // Sayfayı yenilemeden butonu güncelle
    }
};

const removeFromFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('userFavs')) || [];
    favs = favs.filter(favId => favId !== id);
    localStorage.setItem('userFavs', JSON.stringify(favs));
    handleFiltersAndSort(); 
};

document.getElementById('showFavsBtn').onclick = () => {
    const favIds = JSON.parse(localStorage.getItem('userFavs')) || [];
    const favItems = allData.filter(item => favIds.includes(item.id));
    renderCards(favItems);
};

document.getElementById('showAllBtn').onclick = () => renderCards(allData);

document.getElementById('closeModal').onclick = () => {
    document.getElementById('modalOverlay').classList.add('hidden');
};

init();