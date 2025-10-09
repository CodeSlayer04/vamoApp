// src/App.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Importamos la pantalla de perfil que creaste
import PerfilPage from './pages/PerfilPage'; 

const App = () => {
  // Cuando uses React Navigation, aquí irá el componente <NavigationContainer>
  // Pero por ahora, renderizaremos PerfilPage directamente para probar:
  return (
    // Usa un contenedor simple para centrar o asegurar el padding superior
    <View style={styles.container}>
      <PerfilPage />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // El padding top ayuda a que el contenido no quede debajo de la barra de estado del teléfono
    paddingTop: 40, 
    backgroundColor: '#fff',
  },
});

export default App;

// NOTA IMPORTANTE: Si estás usando Expo/React Native, asegúrate de que tu 
// archivo `index.js` en la raíz del proyecto esté importando este archivo:
// import App from './src/App';