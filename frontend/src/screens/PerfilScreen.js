import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebaseConfig";

const PerfilScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    address: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);

          // Obtener datos del usuario desde Firestore
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
      await updateDoc(docRef, {
        name: userData.name,
        age: userData.age,
        address: userData.address,
        gender: userData.gender,
      });
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
      setEditing(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const docRef = doc(db, "users", user.uid);
              await deleteDoc(docRef); // Eliminar datos de Firestore
              await deleteUser(auth.currentUser); // Eliminar cuenta del usuario
              Alert.alert("Éxito", "Cuenta eliminada correctamente.");
              navigation.replace("Login");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cuenta.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6A5ACD" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>
      <Text style={styles.label}>Correo:</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Text style={styles.label}>Nombre completo:</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
        editable={editing}
      />

      <Text style={styles.label}>Edad:</Text>
      <TextInput
        style={styles.input}
        value={String(userData.age)}
        onChangeText={(text) => setUserData({ ...userData, age: text })}
        keyboardType="numeric"
        editable={editing}
      />

      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        style={styles.input}
        value={userData.address}
        onChangeText={(text) => setUserData({ ...userData, address: text })}
        editable={editing}
      />

      <Text style={styles.label}>Sexo:</Text>
      <TextInput
        style={styles.input}
        value={userData.gender}
        onChangeText={(text) => setUserData({ ...userData, gender: text })}
        editable={editing}
      />

      <View style={styles.buttonContainer}>
        {editing ? (
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#555",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FFA500",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
  },
});

export default PerfilScreen;
