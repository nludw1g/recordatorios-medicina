import { AuthProvider } from '@/contexts/AuthContext'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

export default function Layout() {
  return (
      <AuthProvider>
          <StatusBar style='auto' />
          <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </AuthProvider>
  )
}
