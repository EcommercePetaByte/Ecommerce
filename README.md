# React + Vite

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🧾 Configuración de Mercado Pago (Sandbox)

Para que el sistema pueda generar pagos de prueba con Mercado Pago, es necesario configurar las credenciales de sandbox (modo de desarrollo).
Esto evita usar dinero real durante las pruebas.

## 🔑 1. Crear una aplicación en Mercado Pago Developers

Iniciá sesión en Mercado Pago Developers
.

Entrá en el panel de “Tus aplicaciones” y hacé clic en “Crear aplicación”.

Elegí el tipo de integración Billetera Mercado Pago.

Una vez creada, entrá a tu aplicación y buscá el apartado Credenciales.

Copiá tu Access Token de Sandbox y tu Public Key de Sandbox (no las de producción).

## ⚙️ 2. Guardar las credenciales como variables de entorno

No pongas las claves directamente en el código.
En su lugar, guardalas como variables de entorno en tu sistema:

Windows

Abrí el menú Inicio y escribí “Variables de entorno”.

En la sección de variables de usuario, creá una nueva variable:

Nombre: MERCADO_PAGO_ACCESS_TOKEN

Valor: tu token de sandbox (por ejemplo, APP_USR-xxxxxxxxxx)

Guardá los cambios y reiniciá IntelliJ o tu terminal.

Linux / macOS

En tu terminal, ejecutá:

export MERCADO_PAGO_ACCESS_TOKEN="APP_USR-xxxxxxxxxx"


Para hacerlo permanente, agregalo al final de tu archivo ~/.bashrc o ~/.zshrc.

##  💻 3. Configurar el backend (Spring Boot)

En tu código, el controlador de pagos ya lee esta variable automáticamente:

MercadoPagoConfig.setAccessToken(System.getenv("MERCADO_PAGO_ACCESS_TOKEN"));


De esta forma, el token nunca se guarda en el repositorio, lo que protege tus credenciales.

## 🧩 4. Cómo usarlo en el frontend (React)

El frontend solo necesita la Public Key de Sandbox para inicializar Mercado Pago:

import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago('TEST-xxxxxxxxxx'); // Tu public key de sandbox


Con eso, podés crear pagos de prueba desde tu app React sin usar dinero real.

# 🤝 5. Si otra persona clona tu proyecto

Cada desarrollador debe crear su propia aplicación en Mercado Pago y repetir estos pasos con su propio Access Token y Public Key.
El proyecto no funcionará si el token no está configurado en su entorno.

# 🧪 6. Usuarios y tarjetas de prueba

Mercado Pago ofrece usuarios de prueba y tarjetas falsas
 para simular transacciones.
Ninguna operación realizada en sandbox genera cargos reales.