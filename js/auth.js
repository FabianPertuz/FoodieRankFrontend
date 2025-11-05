let isLoginMode = true;


document.addEventListener('DOMContentLoaded', function() {
  initializeAuthForm();
});

function initializeAuthForm() {
  const authForm = document.getElementById('authForm');
  const authSwitchBtn = document.getElementById('authSwitchBtn');
  const authSwitchText = document.getElementById('authSwitchText');
  const authTitle = document.getElementById('authTitle');
  const authButton = document.getElementById('authButton');
  const nameGroup = document.getElementById('nameGroup');

  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }

  if (authSwitchBtn) {
    authSwitchBtn.addEventListener('click', function() {
      isLoginMode = !isLoginMode;
      
      if (isLoginMode) {
        authTitle.textContent = 'Iniciar Sesión';
        authButton.textContent = 'Iniciar Sesión';
        authSwitchText.textContent = '¿No tienes cuenta?';
        authSwitchBtn.textContent = 'Regístrate';
        if (nameGroup) nameGroup.style.display = 'none';
      } else {
        authTitle.textContent = 'Crear Cuenta';
        authButton.textContent = 'Registrarse';
        authSwitchText.textContent = '¿Ya tienes cuenta?';
        authSwitchBtn.textContent = 'Inicia Sesión';
        if (nameGroup) nameGroup.style.display = 'block';
      }
    });
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
    data.nombre = formData.get('name');
  }

  try {
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    console.log('📤 Enviando autenticación a:', endpoint, data);
    
    const result = await api.post(endpoint, data);
    console.log('📥 Respuesta de autenticación:', result);

   
    if (result.token) {
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
      throw new Error('No se recibió token de autenticación');
    }
    
  } catch (error) {
    console.error('❌ Error de autenticación:', error);
    showMessage(error.message, 'error');
  }
}