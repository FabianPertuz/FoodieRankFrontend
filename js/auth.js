async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  // Estructura que espera tu backend
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  };

  if (!isLoginMode) {
    data.name = formData.get('name');
  }

  try {
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    console.log('📤 Enviando autenticación a:', endpoint, data);
    
    const result = await api.post(endpoint, data);
    console.log('📥 Respuesta de autenticación:', result);

    // Tu backend debería devolver un token
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