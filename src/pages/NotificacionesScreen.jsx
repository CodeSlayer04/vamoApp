import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebaseconfig'; 
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 


const NotificacionesScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

 
  useEffect(() => {
    if (!currentUserId) return;
    
   
    const q = query(
      collection(db, 'notificaciones'),
      where('userId', '==', currentUserId),
      orderBy('createdAt', 'desc'),
      limit(50)

    );

    const subscriber = onSnapshot(q, (querySnapshot) => {
      const notificationsData = [];
      querySnapshot.forEach(documentSnapshot => {
        notificationsData.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
          createdAt: documentSnapshot.data().createdAt?.toDate(), // Convertir a Date para UI
        });
      });
      setNotifications(notificationsData);
      setLoading(false);
    }, (error) => {
      console.error("Error al suscribirse a notificaciones:", error);
      setLoading(false);
    });

    return () => subscriber();
  }, [currentUserId]);

  
  const handleNotificationPress = async (item) => {
    
    if (!item.isRead) {
      try {
        const notificationDocRef = doc(db, 'notificaciones', item.id);
   
        await updateDoc(notificationDocRef, { isRead: true });
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }

  
    if (item.postId) {
      
      navigation.navigate('DetallePublicacion', { postId: item.postId });
    }
  };

  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, item.isRead ? styles.readCard : styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.type === 'like' ? '❤️' : '💬'}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.notificationText}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.createdAt ? item.createdAt.toLocaleTimeString() + ' ' + item.createdAt.toLocaleDateString() : 'Fecha desconocida'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  
  if (loading || currentUserId === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>{currentUserId === null ? "Inicia sesión para ver notificaciones" : "Cargando..."}</Text>
      </View>
    );
  }
  
  if (notifications.length === 0) {
      return (
          <View style={styles.centered}>
              <Text>No tienes notificaciones pendientes. </Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notificationCard: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  unreadCard: { backgroundColor: '#e3f2fd', borderLeftWidth: 4, borderLeftColor: '#007bff' },
  readCard: { backgroundColor: '#fff' },
  iconContainer: { marginRight: 15 },
  icon: { fontSize: 24 },
  textContainer: { flex: 1 },
  notificationText: { fontSize: 14, color: '#333', lineHeight: 20 },
  timestamp: { fontSize: 10, color: 'gray', marginTop: 4 },
});

export default NotificacionesScreen;