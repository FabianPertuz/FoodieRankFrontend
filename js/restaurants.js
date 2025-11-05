let restaurants = [];

async function loadRestaurants() {
  try {
    console.log('🔄 Cargando restaurantes...');
    
    const restaurants = await api.get('/restaurants');
    displayRestaurants(restaurants);
  } catch (error) {
    console.error('❌ Error cargando restaurantes:', error);
    showMessage('Error cargando restaurantes: ' + error.message, 'error');
  }
}

async function loadCategories() {
  try {
    console.log('🔄 Cargando categorías...');
    
    const categoriesData = await api.get('/categories');
    categories = categoriesData; 
    populateCategoryFilter(categories);
  } catch (error) {
    console.error('❌ Error cargando categorías:', error);
  }
}

function populateCategoryFilter(categories) {
  const filter = document.getElementById('categoryFilter');
  if (!filter) return;
  
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
  if (!grid) return;
  
  if (!restaurantsToShow || restaurantsToShow.length === 0) {
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
        <p class="restaurant-description">${restaurant.description || 'Sin descripción'}</p>
        <div class="restaurant-rating">
          <div class="stars">${generateStars(restaurant.averageRating || 0)}</div>
          <span>(${restaurant.reviewCount || 0} reseñas)</span>
        </div>
        <p class="restaurant-location">
          <i class="fas fa-map-marker-alt"></i> ${restaurant.location || 'Ubicación no especificada'}
        </p>
        ${restaurant.status === 'pending' ? '<span class="pending-badge">Pendiente</span>' : ''}
      </div>
    </div>
  `).join('');
}


async function showRestaurantDetail(restaurantId) {
  try {
    const restaurant = await api.get(`/restaurants/${restaurantId}`);
    displayRestaurantDetail(restaurant);
    showPage('restaurantDetail');
  } catch (error) {
    showMessage('Error cargando restaurante: ' + error.message, 'error');
  }
}

function displayRestaurantDetail(restaurant) {
  const container = document.getElementById('restaurantDetail');
  if (!container) return;
  
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
          ${restaurant.status === 'pending' ? '<span class="pending-badge large">Pendiente de aprobación</span>' : ''}
          <div class="rating-display">
            <div class="stars">${generateStars(restaurant.averageRating || 0)}</div>
            <span class="rating-text">${restaurant.averageRating ? restaurant.averageRating.toFixed(1) : '0'} (${restaurant.reviewCount || 0} reseñas)</span>
          </div>
          <p class="location"><i class="fas fa-map-marker-alt"></i> ${restaurant.location || 'Ubicación no especificada'}</p>
          <p class="description">${restaurant.description || 'Sin descripción'}</p>
        </div>
      </div>

      <div class="detail-actions">
        ${isAuthenticated() ? `
          <button class="btn-primary" onclick="showAddReviewModal('${restaurant._id}')">
            <i class="fas fa-plus"></i> Agregar Reseña
          </button>
          ${isAdmin() ? `
            <button class="btn-secondary" onclick="approveRestaurant('${restaurant._id}')">
              <i class="fas fa-check"></i> Aprobar
            </button>
          ` : ''}
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


async function approveRestaurant(restaurantId) {
  try {
    await api.patch(`/restaurants/${restaurantId}`, { status: 'approved' });
    showMessage('Restaurante aprobado exitosamente', 'success');
    showPage('restaurants');
  } catch (error) {
    showMessage('Error aprobando restaurante: ' + error.message, 'error');
  }
}

function showAddReviewModal(restaurantId) {
  showMessage('Función de agregar reseña pronto disponible', 'info');
}

function loadRestaurantReviews(restaurantId) {

  const reviewsList = document.getElementById('reviewsList');
  if (reviewsList) {
    reviewsList.innerHTML = '<p>Las reseñas se cargarán pronto...</p>';
  }
}