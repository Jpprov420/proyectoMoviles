import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from "react-native";

const equipo = [
    {
        id: "1",
        nombre: "Jorge Proaño",
        linkedin: "JorgeFacebook",
        foto: require("../../assets/IngeJorge.png")
    },
    {
        id: "2",
        nombre: "Jhonatan Solórzano",
        linkedin: "https://www.linkedin.com/in/jhona-tan-922430294",
        foto: require("../../assets/IngeJhonatan.jpeg")
    },
    {
        id: "3",
        nombre: "Jenny Rosero",
        linkedin: "JennyFacebook",
        foto: require("../../assets/IngeJenny.png")
    },
    {
        id: "4",
        nombre: "Karol Ruiz",
        linkedin: "KaronFacebook",
        foto: require("../../assets/IngeKaro.png")
    },
];

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Quiénes somos?</Text>
            <Text style={{marginTop: 15}}>
                Somos un grupo de desarrolladores móviles que buscan dar una solución a una problemática del transporte del sector público en la capital como es la movilización eficiente de los usuario. Sabemos que tu tiempo es valioso, por lo tanto te presentamos una herramienta que te ayudará a llegar a tu destino de la forma más rápida posible.
            </Text>
            <Text style={[styles.title, { marginTop: 45 } ]}>Equipo de trabajo</Text>

            <FlatList
                data={equipo}
                keyExtractor={(item) => item.id}
                numColumns={2} // Muestra dos elementos por fila
                contentContainerStyle={styles.teamContainer}
                renderItem={({ item }) => (
                    <View style={styles.memberCard}>
                        <Image source={item.foto} style={styles.avatar} />
                        <Text style={styles.name}>{item.nombre}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(item.linkedin)} style={
                            styles.socialButton}>
                            <Text style={styles.socialText}>LinkedIn</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 20,
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        color: "#444",
    },
    teamContainer: {
        justifyContent: "center",
    },
    memberCard: {
        alignItems: "center",
        margin: 10,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3, // Sombra en Android
        width: 130,
        marginBottom: 40
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50, // Hace que la imagen sea circular
        borderWidth: 2,
        borderColor: "#6A5ACD",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        color: "#444",
    },
    socialButton: {
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: "#0E76A8", // Color azul de LinkedIn
        borderRadius: 8,
        position: "absolute", // Para poder posicionar al boton fuera de la  card
        bottom: -35,
        justifyContent: "space-between"
    },
    socialText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default AboutScreen;