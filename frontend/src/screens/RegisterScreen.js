import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Importa funciones de Firestore
import { auth, db } from "../api/firebaseConfig"; // Importa la configuración de Firebase
import Icon from "react-native-vector-icons/Ionicons";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  //función para manejar la validación del registro en FireBase
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !age || !address || !gender) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    if (isNaN(age) || age < 18) {
      Alert.alert("Error", "Por favor, ingresa una edad válida y mayor a 18 años.");
      return;
    }

    //Si pasa todas las validaciónes establecemos la variable de estado Loading en true para que se active el ActivityIndicatory aparezca el spinner de carga
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Agregar los datos del usuario a Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        age: parseInt(age, 10), // Guardar la edad como número
        address,
        gender,
      });

      setLoading(false);
      Alert.alert("Cuenta creada", "Tu cuenta ha sido registrada correctamente.");
      navigation.replace("Login"); // Evita bucles
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "El correo no es válido.");
      } else {
        Alert.alert("Error", "No se pudo registrar la cuenta. Inténtalo más tarde.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="calendar-outline" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="location-outline" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="male-female" size={24} color="#6A5ACD" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Sexo (Masculino/Femenino)"
          value={gender}
          onChangeText={setGender}
        />
      </View>

      {/*Agregamos un indicador de carga mientras se registra el usuario*/}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    marginTop: 15,
    color: "#6A5ACD",
    fontSize: 14,
  },
};

export default RegisterScreen;
