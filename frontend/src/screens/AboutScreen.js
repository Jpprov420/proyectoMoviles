import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from "react-native";

const equipo = [
    {
        id: "1",
        nombre: "Jorge Proaño",
        linkedin: "https://www.linkedin.com/in/jorge-proa%C3%B1o-a80757294/",
        foto: require("../../assets/IngeJorge.jpeg")
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
        linkedin: "https://www.linkedin.com/in/jenny-rosero-4a0317204",
        foto: require("../../assets/IngeJenny.jpeg")
    },
];

const AboutScreen = () => {
    return (
        <FlatList
            data={equipo}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.container}
            ListHeaderComponent={(
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Movilízate UIO!</Text>
                    <Image source={require("../../assets/pikito.png")} style={styles.logo} />
                    <Text style={styles.sectionTitle}>¿Qué es Pikito?</Text>
                    <Text style={styles.text}>
                        Pikito es el asistente virtual de Movilízate UIO, diseñado para ayudarte a encontrar la mejor ruta y moverte de manera eficiente en Quito. Con Pikito, recibirás información en tiempo real sobre transporte público.
                    </Text>
                    <Text style={styles.sectionTitle}>¿Cómo te ayuda Pikito?</Text>
                    <Text style={styles.text}>
                        Pikito responde tus preguntas sobre rutas, tiempos de llegada y medios de transporte disponibles en Quito. Además, si no sabes cómo es el bus que debes abordar, Pikito te mostrará una imagen para que puedas identificarlo con facilidad.
                    </Text>
                    <Text style={styles.sectionTitle}>¿Quiénes somos?</Text>
                    <Text style={styles.text}>
                       Somos un equipo de desarrolladores apasionados por mejorar la movilidad en la capital. Con Movilízate UIO y Pikito, queremos hacer que moverte por Quito sea más fácil, intuitivo y accesible para todos. 🚍✨
                    </Text>
                    <Text style={[styles.sectionTitle, styles.centerText]}>Equipo de trabajo</Text>
                </View>
            )}
            renderItem={({ item }) => (
                <View style={styles.memberCard}>
                    <Image source={item.foto} style={styles.avatar} />
                    <Text style={styles.name}>{item.nombre}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(item.linkedin)} style={styles.socialButton}>
                        <Text style={styles.socialText}>LinkedIn</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        paddingBottom: 40, 
    },
    innerContainer: {
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#444",
        textAlign: "center",
    },
    logo: {
        width: 150,
        height: 150,
        marginVertical: 10,
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#444",
        marginTop: 20,
    },
    centerText: {
        textAlign: "center",
        alignSelf: "center",
    },
    text: {
        textAlign: "justify",
        marginTop: 10,
        fontSize: 16,
        color: "#555",
    },
    memberCard: {
        alignItems: "center",
        margin: 20,         
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        width: 130,
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#1e4188",
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
        backgroundColor: "#1e4188",
        borderRadius: 8,
        position: "absolute",
        bottom: -35,
    },
    socialText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default AboutScreen;
