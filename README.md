# ContaQuiz — Proyecto Web (con Firebase conectado)

¡Hola Alexandra! 👋 Este es el proyecto completo de ContaQuiz, ya conectado
a tu Firebase real (proyecto `contaquiz-60320`). Sigue estos pasos para
publicarlo — **no necesitas usar la terminal ni instalar nada en tu compu**.

---

## 🔐 PASO 0 — Configurar las variables de entorno de Binance Pay (HACER ANTES DE DESPLEGAR)

Antes de subir el proyecto, necesitas guardar tus credenciales de Binance Pay
de forma segura en Vercel. **Nunca las escribas directamente en el código.**

1. Ve a tu proyecto en Vercel → **Settings → Environment Variables**
2. Agrega estas dos variables:

```
Nombre: BINANCE_PAY_API_KEY
Valor:  (tu Clave API de Binance Pay)

Nombre: BINANCE_PAY_SECRET_KEY
Valor:  (tu Clave Secreta de Binance Pay)
```

3. En "Environment", marca las 3 opciones: Production, Preview y Development
4. Guarda cada una con el botón "Save"
5. **Importante:** si ya tenías el proyecto desplegado, necesitas hacer un nuevo
   deploy (Deployments → ⋯ → Redeploy) después de agregar las variables, para
   que la función serverless las pueda leer.

⚠️ Estas variables son privadas — solo viven en la configuración de Vercel,
nunca aparecen en GitHub ni en el código visible del navegador.

---

## 🚀 PASO 1 — Crear cuenta en Vercel (2 minutos)

1. Ve a **https://vercel.com**
2. Haz clic en **"Sign Up"**
3. Elige **"Continue with Google"** y usa tu correo `@contaquiz.com`

---

## 🚀 PASO 2 — Subir el proyecto

1. Una vez dentro de Vercel, haz clic en **"Add New..." → "Project"**
2. Busca la opción **"Deploy without Git"** o **"Import a template/folder"**
   (Vercel también permite arrastrar la carpeta directamente en algunos planes;
   si no la ves, usa la opción de la Terminal del Paso 2-B más abajo)
3. Arrastra **toda esta carpeta** (`contaquiz-web`) al área indicada
4. Vercel detectará automáticamente que es un proyecto Vite + React
5. Haz clic en **"Deploy"**
6. Espera 1-2 minutos — ¡Listo! Te dará una URL como `contaquiz-web.vercel.app`

### 🔧 PASO 2-B (alternativa si Vercel pide usar terminal)

Si Vercel te pide conectar un repositorio de GitHub en lugar de arrastrar
la carpeta, la ruta más simple es:

1. Crea una cuenta gratis en **github.com**
2. Crea un repositorio nuevo llamado `contaquiz-web` (privado o público)
3. Sube todos los archivos de esta carpeta usando el botón
   **"uploading an existing file"** en la página del repositorio (arrastra
   los archivos ahí, sin necesidad de comandos)
4. Vuelve a Vercel → "Add New Project" → conecta tu cuenta de GitHub →
   selecciona el repositorio `contaquiz-web` → Deploy

---

## 🌐 PASO 3 — Conectar tu dominio contaquiz.com

1. En el proyecto ya desplegado en Vercel, ve a **Settings → Domains**
2. Escribe `contaquiz.com` y haz clic en **"Add"**
3. Vercel te mostrará 1-2 registros DNS para agregar (tipo A o CNAME)
4. Ve a tu **Google Workspace / Google Domains** → DNS de tu dominio →
   agrega esos registros exactamente como Vercel los indica
5. Espera unas horas (puede tardar hasta 24h) y listo:
   **https://contaquiz.com estará en vivo** 🎉

---

## ⚠️ IMPORTANTE — Seguridad de Firestore antes de lanzar

Antes de recibir usuarios reales, ve a tu consola de Firebase:

`Firestore Database → Reglas`

Y reemplaza las reglas con esto (protege los datos de cada usuario):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /preguntas/{preguntaId} {
      allow read: if true;
      allow write: if false; // solo se edita desde el Panel de Superusuario
    }
  }
}
```

Esto evita que cualquier persona pueda leer o modificar los datos de otro
usuario directamente desde el navegador.

---

## 📁 Qué contiene esta carpeta

```
contaquiz-web/
├── index.html              ← Punto de entrada HTML
├── package.json             ← Lista de dependencias (incluye firebase)
├── vite.config.js           ← Configuración del proyecto
└── src/
    ├── main.jsx              ← Inicia la app React
    ├── firebaseConfig.js     ← Conexión a tu Firebase (ya con tus credenciales)
    └── ContaQuiz.jsx         ← La aplicación completa de ContaQuiz
```

---

¿Dudas en cualquier paso? Vuelve al chat con Claude y dile en cuál paso
te quedaste — con gusto seguimos desde ahí. 🚀
