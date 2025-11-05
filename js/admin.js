async function loadAdminData() {
  await loadAdminCategories();
  await loadPendingRestaurants();
}

async function loadAdminCategories() {
  try {
    const categories = await api.get('/categories');
    displayAdminCategories(categories);
  } catch (error) {
    showMessage('Error cargando categorías: ' + error.message, 'error');
  }
}

function displayAdminCategories(categories) {
  const container = document.getElementById('categoriesList');
  if (!container) return;
  
  container.innerHTML = categories.map(category => `
    <div class="admin-item">
      <div>
        <h4>${category.name}</h4>
        <p>${category.description || 'Sin descripción'}</p>
        <small>Creado: ${formatDate(category.createdAt)}</small>
      </div>
      <div class="admin-actions">
        <button class="btn-edit" onclick="editCategory('${category._id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" onclick="deleteCategory('${category._id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

async function loadPendingRestaurants() {
  try {

    const pending = await api.get('/restaurants?status=pending');
    displayPendingRestaurants(pending);
  } catch (error) {
    console.error('Error cargando restaurantes pendientes:', error);
  }
}

function displayPendingRestaurants(restaurants) {
  const container = document.getElementById('pendingRestaurants');
  if (!container) return;
  
  if (!restaurants || restaurants.length === 0) {
    container.innerHTML = '<p>No hay restaurantes pendientes de aprobación.</p>';
    return;
  }

  container.innerHTML = restaurants.map(restaurant => `
    <div class="admin-item">
      <div>
        <h4>${restaurant.name}</h4>
        <p>${restaurant.description || 'Sin descripción'}</p>
        <p><strong>Ubicación:</strong> ${restaurant.location || 'No especificada'}</p>
        <p><strong>Categoría:</strong> ${getCategoryName(restaurant.category)}</p>
        <small>Solicitado: ${formatDate(restaurant.createdAt)}</small>
      </div>
      <div class="admin-actions">
        <button class="btn-success" onclick="approveRestaurant('${restaurant._id}')">
          <i class="fas fa-check"></i> Aprobar
        </button>
        <button class="btn-delete" onclick="rejectRestaurant('${restaurant._id}')">
          <i class="fas fa-times"></i> Rechazar
        </button>
      </div>
    </div>
  `).join('');
}


function editCategory(categoryId) {
  showMessage('Función de editar categoría pronto disponible', 'info');
}

function deleteCategory(categoryId) {
  showMessage('Función de eliminar categoría pronto disponible', 'info');
}

function rejectRestaurant(restaurantId) {
  showMessage('Función de rechazar restaurante pronto disponible', 'info');
}