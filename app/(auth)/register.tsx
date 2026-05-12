import Spacer from '@/components/spacer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthContext } from '@/contexts/AuthContext';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function Register() {
  const authContext = React.useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  async function handleRegister() {
    if (!email || !password || !authContext) return;

    try {
      await authContext.register(email, password);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error registering:', error);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>Registrarse</ThemedText>
        <Spacer />
        <TextInput style={styles.input} placeholder='Email' keyboardType='email-address' value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='Contraseña' secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <ThemedText>Registrarse</ThemedText>
      </TouchableOpacity>
      <Spacer/>
      <Link href="/login">
        <Link.Trigger>
          <ThemedText type='link'>¿Ya tienes cuenta? Inicia sesión</ThemedText>
        </Link.Trigger>
        <Link.Preview />
      </Link>
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  input: {
    width: '80%',
    padding: 10,
    backgroundColor: 'lightorange',
    borderRadius: 5,
    marginBottom: 10,
  }
})