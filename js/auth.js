
let isLoginMode = true;

document.addEventListener('DOMContentLoaded', function() {
    setupAuthForm();
});

function setupAuthForm() {
    const authForm = document.getElementById('authForm');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    const authSwitchText = document.getElementById('authSwitchText');
    const authTitle = document.getElementById('authTitle');
    const authButton = document.getElementById('authButton');

    authForm.addEventListener('submit', handleAuthSubmit);
    authSwitchBtn.addEventListener('click', toggleAuthMode);

    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            authTitle.textContent = 'Iniciar Sesión';
            authButton.textContent = 'Iniciar Sesión';
            authSwitchText.textContent = '¿No tienes cuenta?';
            authSwitchBtn.textContent = 'Regístrate';
            document.getElementById('nameGroup').style.display = 'none';
        } else {
            authTitle.textContent = 'Crear Cuenta';
            authButton.textContent = 'Registrarse';
            authSwitchText.textContent = '¿Ya tienes cuenta?';
            authSwitchBtn.textContent = 'Inicia Sesión';
            document.getElementById('nameGroup').style.display = 'block';
        }
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    if (!isLoginMode) {
        data.name = formData.get('name');
        data.role = 'user';
    }

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {

            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            currentUser = result.user;
            
            updateUIForAuth(true);
            showPage('home');
            showMessage(
                isLoginMode ? '¡Bienvenido de nuevo!' : '¡Cuenta creada exitosamente!',
                'success'
            );
        } else {
            showMessage(result.error || 'Error en la autenticación', 'error');
        }
    } catch (error) {
        console.error('Auth error:', error);
        showMessage('Error de conexión', 'error');
    }
}


function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}


function isAuthenticated() {
    return currentUser !== null;
}