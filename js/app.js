
const API_BASE = 'http://localhost:4000/api';

let currentUser = null;
let currentPage = 'home';


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

function initializeApp() {

    showPage('home');
}

function setupEventListeners() {

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });


    document.getElementById('navToggle').addEventListener('click', toggleMobileMenu);


    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') {
            closeModal();
        }
    });
}

function showPage(pageName) {

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });


    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });


    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;

        loadPageData(pageName);
    }


    document.getElementById('navMenu').classList.remove('active');
}

function loadPageData(pageName) {
    switch(pageName) {
        case 'restaurants':
            loadRestaurants();
            loadCategories();
            break;
        case 'admin':
            if (currentUser && currentUser.role === 'admin') {
                loadAdminData();
            } else {
                showPage('home');
            }
            break;
    }
}

function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUIForAuth(true);
        } catch (e) {
            console.error('Error parsing user data:', e);
            logout();
        }
    } else {
        updateUIForAuth(false);
    }
}

function updateUIForAuth(isAuthenticated) {
    const authLink = document.getElementById('authLink');
    const addRestaurantBtn = document.getElementById('addRestaurantBtn');
    const adminLinks = document.querySelectorAll('.admin-only');

    if (isAuthenticated) {
        authLink.textContent = 'Cerrar Sesión';
        authLink.onclick = logout;
        
        if (addRestaurantBtn) {
            addRestaurantBtn.style.display = 'block';
        }

        if (currentUser.role === 'admin') {
            adminLinks.forEach(link => link.style.display = 'block');
        }
    } else {
        authLink.textContent = 'Iniciar Sesión';
        authLink.onclick = () => showPage('login');
        
        if (addRestaurantBtn) {
            addRestaurantBtn.style.display = 'none';
        }

        adminLinks.forEach(link => link.style.display = 'none');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    updateUIForAuth(false);
    showPage('home');
    showMessage('Sesión cerrada correctamente', 'success');
}

function showModal(content) {
    const modal = document.querySelector('.modal');
    modal.innerHTML = content;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function showMessage(text, type = 'info') {

    let messageContainer = document.getElementById('globalMessage');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'globalMessage';
        messageContainer.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            z-index: 3000;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s;
        `;
        document.body.appendChild(messageContainer);
    }

    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };

    messageContainer.style.backgroundColor = colors[type] || colors.info;
    messageContainer.textContent = text;
    messageContainer.style.display = 'block';


    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function generateStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(`<i class="fas fa-star ${i <= rating ? 'filled' : ''}"></i>`);
    }
    return stars.join('');
}