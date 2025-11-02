// Configuración flexible de endpoints
const ENDPOINT_CONFIGS = [
  {
    name: 'Con /api/v1/',
    base: '/api/v1',
    endpoints: {
      categories: '/categories',
      restaurants: '/restaurants',
      users: '/users',
      auth: {
        login: '/auth/login',
        register: '/auth/register'
      }
    }
  },
  {
    name: 'Con /api/',
    base: '/api', 
    endpoints: {
      categories: '/categories',
      restaurants: '/restaurants',
      users: '/users',
      auth: {
        login: '/auth/login',
        register: '/auth/register'
      }
    }
  },
  {
    name: 'Sin prefijo',
    base: '',
    endpoints: {
      categories: '/categories',
      restaurants: '/restaurants', 
      users: '/users',
      auth: {
        login: '/auth/login',
        register: '/auth/register'
      }
    }
  }
];

let currentConfig = ENDPOINT_CONFIGS[0];

// Función para probar y seleccionar configuración
async function autoConfigureEndpoints() {
  for (const config of ENDPOINT_CONFIGS) {
    console.log(`🧪 Probando configuración: ${config.name}`);
    
    try {
      const testUrl = `http://localhost:4000${config.base}${config.endpoints.categories}`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        console.log(`✅ Configuración funcionando: ${config.name}`);
        currentConfig = config;
        
        // Actualizar API_BASE
        window.API_BASE = `http://localhost:4000${config.base}`;
        console.log(`📍 Nueva API Base: ${window.API_BASE}`);
        
        return config;
      }
    } catch (error) {
      console.log(`❌ ${config.name} no funciona`);
    }
  }
  
  console.log('🚨 Ninguna configuración funcionó');
  return null;
}

// Función para obtener endpoints
function getEndpoint(type, subType = null) {
  if (subType && currentConfig.endpoints[type] && currentConfig.endpoints[type][subType]) {
    return currentConfig.endpoints[type][subType];
  }
  return currentConfig.endpoints[type] || `/${type}`;
}