async function loadRestaurantReviews(restaurantId) {
    try {
        const response = await fetch(`${API_BASE}/restaurants/${restaurantId}/reviews`);
        if (response.ok) {
            const reviews = await response.json();
            displayReviews(reviews);
        }
    } catch (error) {
        console.error('Error cargando reseñas:', error);
    }
}

function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p class="no-reviews">Aún no hay reseñas para este restaurante.</p>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <strong>${review.userId.name}</strong>
                    <div class="stars">${generateStars(review.rating)}</div>
                </div>
                <span class="review-date">${formatDate(review.createdAt)}</span>
            </div>
            
            <p class="review-comment">${review.comment}</p>
            
            <div class="review-actions">
                <button class="btn-like ${review.userLiked ? 'liked' : ''}" 
                        onclick="handleReviewReaction('${review._id}', 'like')"
                        ${review.userId._id === currentUser?._id ? 'disabled' : ''}>
                    <i class="fas fa-thumbs-up"></i>
                    <span>${review.likes || 0}</span>
                </button>
                
                <button class="btn-dislike ${review.userDisliked ? 'disliked' : ''}" 
                        onclick="handleReviewReaction('${review._id}', 'dislike')"
                        ${review.userId._id === currentUser?._id ? 'disabled' : ''}>
                    <i class="fas fa-thumbs-down"></i>
                    <span>${review.dislikes || 0}</span>
                </button>

                ${review.userId._id === currentUser?._id ? `
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

function showAddReviewModal(restaurantId) {
    const modalContent = `
        <h2>Agregar Reseña</h2>
        <form id="addReviewForm">
            <input type="hidden" name="restaurantId" value="${restaurantId}">
            
            <div class="form-group">
                <label>Calificación</label>
                <div class="rating-input">
                    ${[1,2,3,4,5].map(star => `
                        <i class="fas fa-star rating-star" data-rating="${star}"></i>
                    `).join('')}
                </div>
                <input type="hidden" name="rating" id="selectedRating" required>
            </div>

            <div class="form-group">
                <label for="comment">Comentario</label>
                <textarea name="comment" id="comment" rows="4" placeholder="Comparte tu experiencia..." required></textarea>
            </div>

            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Publicar Reseña</button>
            </div>
        </form>
    `;

    showModal(modalContent);
    setupRatingStars();
    setupReviewForm();
}

function setupRatingStars() {
    const stars = document.querySelectorAll('.rating-star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });

        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });

        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('selectedRating').value = selectedRating;
            highlightStars(selectedRating);
        });
    });

    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }
}

function setupReviewForm() {
    const form = document.getElementById('addReviewForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            restaurantId: formData.get('restaurantId'),
            rating: parseInt(formData.get('rating')),
            comment: formData.get('comment')
        };

        try {
            const response = await fetch(`${API_BASE}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                closeModal();
                showMessage('Reseña publicada exitosamente', 'success');

                const restaurantId = data.restaurantId;
                loadRestaurantReviews(restaurantId);
            } else {
                const error = await response.json();
                showMessage(error.error || 'Error publicando reseña', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión', 'error');
        }
    });
}

async function handleReviewReaction(reviewId, reaction) {
    if (!isAuthenticated()) {
        showMessage('Debes iniciar sesión para reaccionar', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/reviews/${reviewId}/${reaction}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {

            const restaurantDetail = document.querySelector('.restaurant-detail');
            if (restaurantDetail) {

                window.location.reload();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al procesar reacción', 'error');
    }
}