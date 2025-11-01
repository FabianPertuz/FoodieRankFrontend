let restaurants = [];
let categories = [];

async function loadRestaurants() {
    try {
        const response = await fetch(`${API_BASE}/restaurants`);
        if (response.ok) {
            restaurants = await response.json();
            displayRestaurants(restaurants);
        } else {
            throw new Error('Error cargando restaurantes');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error cargando restaurantes', 'error');
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (response.ok) {
            categories = await response.json();
            populateCategoryFilter();
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

function populateCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = '<option value="">Todas las categorías</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category._id;
        option.textContent = category.name;
        filter.appendChild(option);
    });
}

function displayRestaurants(restaurantsToShow) {
    const grid = document.getElementById('restaurantsGrid');
    
    if (restaurantsToShow.length === 0) {
        grid.innerHTML = '<div class="no-results">No se encontraron restaurantes</div>';
        return;
    }

    grid.innerHTML = restaurantsToShow.map(restaurant => `
        <div class="restaurant-card" onclick="showRestaurantDetail('${restaurant._id}')">
            <div class="restaurant-image">
                ${restaurant.image ? 
                    `<img src="${restaurant.image}" alt="${restaurant.name}" style="width:100%;height:100%;object-fit:cover;">` :
                    `<i class="fas fa-utensils fa-3x"></i>`
                }
            </div>
            <div class="restaurant-info">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <span class="restaurant-category">${getCategoryName(restaurant.category)}</span>
                <p class="restaurant-description">${restaurant.description}</p>
                <div class="restaurant-rating">
                    <div class="stars">${generateStars(restaurant.averageRating || 0)}</div>
                    <span>(${restaurant.reviewCount || 0} reseñas)</span>
                </div>
                <p class="restaurant-location"><i class="fas fa-map-marker-alt"></i> ${restaurant.location}</p>
            </div>
        </div>
    `).join('');
}

function getCategoryName(categoryId) {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Sin categoría';
}


document.addEventListener('DOMContentLoaded', function() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchFilter = document.getElementById('searchFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    if (searchFilter) {
        searchFilter.addEventListener('input', applyFilters);
    }
});

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    const search = document.getElementById('searchFilter').value.toLowerCase();

    let filtered = restaurants.filter(restaurant => {
        const matchesCategory = !category || restaurant.category === category;
        const matchesSearch = !search || 
            restaurant.name.toLowerCase().includes(search) ||
            restaurant.description.toLowerCase().includes(search);
        
        return matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
        switch(sortBy) {
            case 'rating':
                return (b.averageRating || 0) - (a.averageRating || 0);
            case 'popularity':
                return (b.reviewCount || 0) - (a.reviewCount || 0);
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    displayRestaurants(filtered);
}


async function showRestaurantDetail(restaurantId) {
    try {
        const response = await fetch(`${API_BASE}/restaurants/${restaurantId}`);
        if (response.ok) {
            const restaurant = await response.json();
            displayRestaurantDetail(restaurant);
            showPage('restaurantDetail');
        } else {
            throw new Error('Error cargando restaurante');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error cargando restaurante', 'error');
    }
}

function displayRestaurantDetail(restaurant) {
    const container = document.getElementById('restaurantDetail');
    
    container.innerHTML = `
        <div class="restaurant-detail">
            <div class="detail-header">
                <div class="detail-image">
                    ${restaurant.image ? 
                        `<img src="${restaurant.image}" alt="${restaurant.name}">` :
                        `<div class="no-image"><i class="fas fa-utensils fa-5x"></i></div>`
                    }
                </div>
                <div class="detail-info">
                    <h1>${restaurant.name}</h1>
                    <span class="category-badge">${getCategoryName(restaurant.category)}</span>
                    <div class="rating-display">
                        <div class="stars">${generateStars(restaurant.averageRating || 0)}</div>
                        <span class="rating-text">${restaurant.averageRating ? restaurant.averageRating.toFixed(1) : '0'} (${restaurant.reviewCount || 0} reseñas)</span>
                    </div>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${restaurant.location}</p>
                    <p class="description">${restaurant.description}</p>
                </div>
            </div>

            <div class="detail-actions">
                ${isAuthenticated() ? `
                    <button class="btn-primary" onclick="showAddReviewModal('${restaurant._id}')">
                        <i class="fas fa-plus"></i> Agregar Reseña
                    </button>
                ` : `
                    <p>Inicia sesión para agregar una reseña</p>
                `}
            </div>

            <div class="reviews-section">
                <h2>Reseñas</h2>
                <div id="reviewsList">
                    <!-- Las reseñas se cargan aquí -->
                </div>
            </div>
        </div>
    `;


    loadRestaurantReviews(restaurant._id);
}