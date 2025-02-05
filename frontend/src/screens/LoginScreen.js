import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../api/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar iconos

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.replace("Chat");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No existe una cuenta con este correo.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "La contraseña es incorrecta.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "El formato del correo no es válido.");
      } else {
        Alert.alert("Error", "No se pudo iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/train.png')} style={styles.icon} />
      <Text style={styles.title}>Movilízate UIO!</Text>
      <Text style={styles.subtitle}>Planifica tu viaje en transporte público con precisión.</Text>
      
      {/* Campo de correo */}
      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={24} color="#6A5ACD" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Campo de contraseña */}
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={24} color="#6A5ACD" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
          <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#6A5ACD" />
        </TouchableOpacity>
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#6A5ACD" />}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordToggle: {
    padding: 5,
  },
  linksContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },
  linkText: {
    color: '#6A5ACD',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6A5ACD',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
};

export default LoginScreen;
