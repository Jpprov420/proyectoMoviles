import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../api/firebaseConfig";

const PerfilScreen = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPerfil(docSnap.data());
        }
      }
      setLoading(false);
    };

    fetchPerfil();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6A5ACD" />;
  }

  return (
    <View>
      {perfil ? (
        <>
          <Image source={{ uri: perfil.fotoPerfil || "https://via.placeholder.com/150" }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text>Nombre: {perfil.nombre}</Text>
          <Text>Email: {perfil.email}</Text>
        </>
      ) : (
        <Text>No se encontró el perfil.</Text>
      )}
    </View>
  );
};

export default PerfilScreen;
