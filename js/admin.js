function loadAdminData() {
    loadAdminCategories();
    loadPendingRestaurants();
}

async function loadAdminCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (response.ok) {
            const categories = await response.json();
            displayAdminCategories(categories);
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

function displayAdminCategories(categories) {
    const container = document.getElementById('categoriesList');
    
    container.innerHTML = categories.map(category => `
        <div class="admin-item">
            <div>
                <h4>${category.name}</h4>
                <p>${category.description || 'Sin descripción'}</p>
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


document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            

            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });


    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', showAddCategoryModal);
    }
});

function showAddCategoryModal() {
    const modalContent = `
        <h2>Nueva Categoría</h2>
        <form id="addCategoryForm">
            <div class="form-group">
                <label for="categoryName">Nombre</label>
                <input type="text" id="categoryName" name="name" required>
            </div>
            <div class="form-group">
                <label for="categoryDescription">Descripción</label>
                <textarea id="categoryDescription" name="description" rows="3"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Crear Categoría</button>
            </div>
        </form>
    `;

    showModal(modalContent);
    setupCategoryForm();
}

function setupCategoryForm() {
    const form = document.getElementById('addCategoryForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            description: formData.get('description')
        };

        try {
            const response = await fetch(`${API_BASE}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                closeModal();
                showMessage('Categoría creada exitosamente', 'success');
                loadAdminCategories();
                loadCategories(); 
            } else {
                const error = await response.json();
                showMessage(error.error || 'Error creando categoría', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión', 'error');
        }
    });
}