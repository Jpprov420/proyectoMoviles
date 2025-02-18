import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const PerfilScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: "", age: "", address: "", gender: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            Alert.alert("Error", "No se encontraron datos del usuario.");
          }
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
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

  const handleUpdate = async () => {
    if (!userData.name || !userData.age || !userData.address || !userData.gender) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(userData.age) || userData.age < 18) {
      Alert.alert("Error", "Por favor, ingresa una edad válida y mayor a 18 años.");
      return;
    }
    try {
      setLoading(true);
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, userData);
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
      setEditing(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3b49e9" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <FontAwesome name="user-circle" size={100} color="#666" />
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#1e4188" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={userData.name}
          placeholder="Nombre completo"
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          editable={editing}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="calendar-today" size={20} color="#1e4188" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={String(userData.age)}
          placeholder="Edad"
          keyboardType="numeric"
          onChangeText={(text) => setUserData({ ...userData, age: text })}
          editable={editing}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="location-on" size={20} color="#1e4188" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={userData.address}
          placeholder="Dirección"
          onChangeText={(text) => setUserData({ ...userData, address: text })}
          editable={editing}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="wc" size={20} color="#1e4188" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={userData.gender}
          placeholder="Sexo"
          onChangeText={(text) => setUserData({ ...userData, gender: text })}
          editable={editing}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={editing ? handleUpdate : () => setEditing(true)}>
        <MaterialIcons name="edit" size={20} color="#fff" />
        <Text style={styles.buttonText}>{editing ? "Guardar Cambios" : "Editar Perfil"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteButton]}>
        <MaterialIcons name="delete" size={20} color="#fff" />
        <Text style={styles.buttonText}>Eliminar Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    paddingTop: 40
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userEmail: {
    fontSize: 18,
    color: "#171a1f",
    fontWeight: "bold",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#154bbb",
    marginBottom: 10,  

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  }
});

export default PerfilScreen;