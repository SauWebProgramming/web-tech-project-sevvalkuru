const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('searchInput');

// 1. Veriyi Fetch ile Çekme [cite: 49]
const loadMedia = async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderCards(data);
        setupSearch(data);
    } catch (err) {
        console.error("Hata:", err);
    }
};

// 2. Kartları DOM'a Basma [cite: 50]
const renderCards = (items) => {
    mediaGrid.innerHTML = items.map(item => `
        <div class="card">
            <img src="${item.image}" alt="${item.title}">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.category}</p>
                <button onclick="addToFav(${item.id})">Favorilere Ekle</button>
            </div>
        </div>
    `).join('');
};

// 3. Arama Fonksiyonu [cite: 24]
const setupSearch = (data) => {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = data.filter(m => m.title.toLowerCase().includes(term));
        renderCards(filtered);
    });
};

// 4. LocalStorage Kullanımı (Favoriler) [cite: 28, 52]
const addToFav = (id) => {
    let favs = JSON.parse(localStorage.getItem('myFavs')) || [];
    if(!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem('myFavs', JSON.stringify(favs));
        alert("Favorilere eklendi!");
    }
};

loadMedia();