# 💊 Recordatorios de medicación

App para el primer parcial de la materia "Aplicaciones Móviles", hecho utilizando React Native + Expo.

## Ejecución

Antes de abrir la app, es necesario instalar las dependencias ejecutando `pnpm install` en una terminal.

Para abrir la app es necesario tener la aplicación "Expo Go" instalada en un dispositivo movil, o contar con un Android Studio instalado con un emulador configurado. Para abrir la app en el emulador, ejecutar el siguiente comando en una terminal: `pnpm run android`

Para ejecutar los tests, basta con simplemente ejecutar el comando `pnpm test` en una terminal.

## Funciones

- Registro e inicio de sesión con almacenamiento local
- Agregado y eliminación de recordatorios con almacenamiento local y notificaciones programadas
- Integración con la galería de fotos del dispositivo para asociar fotos del medicamento con el recordatorio
- Integración con el calendario para agregar recordatorios
- Integración con la ubicación en tiempo real para asociar una ubicación al recordatorio
- Integración con los contactos guardados del dispositivo para asociar un contacto al recordatorio
- Estado global utilizando [Zustand](https://zustand.site/en/) para manejar los recordatorios de forma global
- Tests del estado global, lógica del negocio y componentes claves utilizando [Jest](https://jestjs.io/) + [React Native Testing Library](https://oss.callstack.com/react-native-testing-library/)

## Uso de IA

La inteligencia artifical fue utilizada en este proyecto unicamente para generar los tests, haciendo uso de la integración de GitHub Copilot dentro del editor Visual Studio Code, con el siguiente prompt:

```
Utilizando jest y react native testing library, crea los siguientes tests en el proyecto:

- Un test que verifique que el componente "MedicatioNReminder" se renderize correctamente y responda a la interacción.
- Un test que verifique que el estado de zustand "reminders" se actualice correctamente cuando se ejecutan sus funciones.
- Un test que pruebe alguna función o lógica de negocio.
```

El código generado esta en `store/reminders.test.ts` y `components/__tests__/medication-reminder.test.tsx`, y fue modificado ligeramente para arreglar errores cometidos por la IA.

## Video de demostración

- [Demo](https://youtu.be/kUJ1RLTDOAA)
- [Demo notificaciones](https://youtu.be/svg8eWyCU8A)
- [Demo 2](https://youtu.be/byjrCb_Y9Tg)
