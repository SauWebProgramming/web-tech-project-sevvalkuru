const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const yearFilter = document.getElementById('yearFilter');

let allData = [];

// 1. Veri Çekme ve Başlatma
const init = async () => {
    const res = await fetch('data.json');
    allData = await res.json();
    renderCards(allData);
};

// 2. Liste/Grid Görünümü (Zorunlu İşlev 1)
const renderCards = (items) => {
    mediaGrid.innerHTML = items.map(item => `
        <div class="card" onclick="showDetails(${item.id})">
            <div class="rating-badge">★ ${item.rating}</div>
            <img src="${item.image}" alt="${item.title}">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.category}</p>
                <button class="fav-btn" onclick="event.stopPropagation(); addToFav(${item.id})">Favorilere Ekle</button>
            </div>
        </div>
    `).join('');
};

// 3. Arama ve Filtreleme (Zorunlu İşlev 2)
const filterData = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryTerm = categoryFilter.value;
    const yearTerm = yearFilter.value;

    const filtered = allData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === "all" || item.category === categoryTerm;
        const matchesYear = !yearTerm || item.year === yearTerm;
        return matchesSearch && matchesCategory && matchesYear;
    });
    renderCards(filtered);
};

[searchInput, categoryFilter, yearFilter].forEach(el => el.addEventListener('input', filterData));

// 4. Detay Sayfası - SPA (Zorunlu İşlev 3)
const showDetails = (id) => {
    const item = allData.find(m => m.id === id);
    document.getElementById('modalBody').innerHTML = `
        <img src="${item.image}" style="width:100%; border-radius:10px;">
        <h2>${item.title}</h2>
        <p><strong>Puan:</strong> ${item.rating} | <strong>Yıl:</strong> ${item.year}</p>
        <p><strong>Özet:</strong> ${item.desc}</p>
        <p><strong>Oyuncular:</strong> ${item.actors || 'Belirtilmemiş'}</p>
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
document.getElementById('closeModal').onclick = () => document.getElementById('modalOverlay').classList.add('hidden');

init();