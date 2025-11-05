async function loadRestaurantReviews(restaurantId) {
  try {
    const reviews = await api.get(`/restaurants/${restaurantId}/reviews`);
    displayReviews(reviews);
  } catch (error) {
    console.error('Error cargando reseñas:', error);
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviewsList');
  if (!container) return;
  
  if (!reviews || reviews.length === 0) {
    container.innerHTML = '<p class="no-reviews">Aún no hay reseñas para este restaurante.</p>';
    return;
  }

  container.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-info">
          <strong>${review.userId?.name || 'Usuario anónimo'}</strong>
          <div class="stars">${generateStars(review.rating)}</div>
        </div>
        <span class="review-date">${formatDate(review.createdAt)}</span>
      </div>
      
      <p class="review-comment">${review.comment}</p>
      
      <div class="review-actions">
        <button class="btn-like ${review.userLiked ? 'liked' : ''}" 
                onclick="handleReviewReaction('${review._id}', 'like')"
                ${review.userId?._id === currentUser?._id ? 'disabled' : ''}>
          <i class="fas fa-thumbs-up"></i>
          <span>${review.likes || 0}</span>
        </button>
        
        <button class="btn-dislike ${review.userDisliked ? 'disliked' : ''}" 
                onclick="handleReviewReaction('${review._id}', 'dislike')"
                ${review.userId?._id === currentUser?._id ? 'disabled' : ''}>
          <i class="fas fa-thumbs-down"></i>
          <span>${review.dislikes || 0}</span>
        </button>

        ${review.userId?._id === currentUser?._id ? `
          <button class="btn-edit" onclick="editReview('${review._id}')">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-delete" onclick="deleteReview('${review._id}')">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}


async function submitReview(reviewData) {
  try {
    const newReview = await api.post('/reviews', reviewData);
    showMessage('Reseña publicada exitosamente', 'success');
    return newReview;
  } catch (error) {
    showMessage('Error publicando reseña: ' + error.message, 'error');
    throw error;
  }
}


async function handleReviewReaction(reviewId, reaction) {
  if (!isAuthenticated()) {
    showMessage('Debes iniciar sesión para reaccionar', 'warning');
    return;
  }

  try {
    const endpoint = reaction === 'like' ? `/reviews/${reviewId}/like` : `/reviews/${reviewId}/dislike`;
    await api.post(endpoint);

    const restaurantId = getCurrentRestaurantId();
    if (restaurantId) {
      loadRestaurantReviews(restaurantId);
    }
  } catch (error) {
    showMessage('Error al procesar reacción: ' + error.message, 'error');
  }
}

function editReview(reviewId) {
  showMessage('Función de editar reseña pronto disponible', 'info');
}

function deleteReview(reviewId) {
  showMessage('Función de eliminar reseña pronto disponible', 'info');
}

function getCurrentRestaurantId() {

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('restaurantId') || sessionStorage.getItem('currentRestaurantId');
}