import Spacer from '@/components/spacer';
import { ThemedText } from '@/components/themed-text';
import { AuthContext } from '@/contexts/AuthContext';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Profile() {
    const authContext = useContext(AuthContext)!;
  
    return (
        <SafeAreaView style={styles.container}>
            <ThemedText type='title'>Perfil de usuario</ThemedText>
            <Spacer />
            <ThemedText>Usuario: {authContext.user}</ThemedText>
            <Spacer />
            <TouchableOpacity onPress={authContext.logout}>
                <ThemedText type='link'>Cerrar sesión</ThemedText>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    }
});

export default Profile