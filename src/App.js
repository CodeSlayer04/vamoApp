// src/App.jsx (Router Central)

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

// 1. Importar las pantallas (Vistas)
import PerfilPage from './pages/PerfilPage';
// Placeholder para pantallas futuras
import EditarPerfilPage from './pages/EditarPerfilPage';
import DetallePublicacionPage from './pages/DetallePublicacionPage'; 

// 2. Crear el Navegador Stack (Pilas)
const Stack = createNativeStackNavigator();

/**
 * Componente App: Define las rutas principales de navegación.
 * Este es el "Controlador" de navegación.
 */
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Perfil"
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#fff',
          headerTitleStyle: styles.headerTitleStyle,
          headerBackTitleVisible: false,
        }}
      >
        {/* Rutas Principales */}
        
        {/* Pantalla 1: Perfil de Usuario */}
        <Stack.Screen
          name="Perfil"
          component={PerfilPage}
          options={{ title: 'Mi Perfil' }}
        />
        
        {/* Pantalla 2: Edición del Perfil (Para el botón 'Editar Perfil') */}
        <Stack.Screen
          name="EditarPerfil"
          component={EditarPerfilPage} // Los compañeros harán esta página
          options={{ title: 'Editar Información' }}
        />

        {/* Pantalla 3: Detalle de la Publicación (Para el click en el post) */}
        <Stack.Screen
          name="DetallePublicacion"
          component={DetallePublicacionPage} // Los compañeros harán esta página
          options={{ title: 'Publicación' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#4CAF50', // Color primario de Vamo
    },
    headerTitleStyle: {
        fontWeight: 'bold',
    },
});

export default App;

// NOTA: Recuerda crear los archivos placeholder en src/pages/ 
// (Ej. EditarPerfilPage.jsx) para que el código compile, aunque estén vacíos.