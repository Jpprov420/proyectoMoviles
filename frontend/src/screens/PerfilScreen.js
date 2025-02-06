import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc} from 'firebase/firestore';

const PerfilScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().displayName || "Usuario Anónimo");
          } else {
            setUserName("Usuario Anónimo");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setUserName("Usuario Anónimo");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6A5ACD" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
       <Text style={styles.name}>{userName}</Text>

      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
};

export default PerfilScreen;
