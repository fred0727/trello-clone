# Guía de Deployment en Netlify

## 🚀 Configuración para Netlify

### Archivos agregados para deployment:

1. **`netlify.toml`** - Configuración principal
2. **`public/_redirects`** - Manejo de rutas SPA

### ⚙️ Configuración de Netlify

Si aún no se ve en Netlify, sigue estos pasos:

#### 1. **Conectar repositorio en Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Login con tu cuenta
   - Clic en "New site from Git"
   - Conecta tu repositorio GitHub: `fred0727/trello-clone`

#### 2. **Configuración de Build:**
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

#### 3. **Variables de entorno (si es necesario):**
   ```
   NODE_VERSION=18
   ```

### 📁 Estructura de archivos para deployment:

```
trello-fullstack/
├── netlify.toml          # ← Configuración de Netlify
├── public/
│   └── _redirects        # ← Redirecciones para SPA
├── dist/                 # ← Carpeta de build (generada)
│   ├── index.html
│   ├── assets/
│   └── _redirects        # ← Copiado automáticamente
└── ... otros archivos
```

### 🔧 Comandos importantes:

```bash
# Build local para testing
npm run build

# Preview del build local
npm run preview

# Verificar que _redirects se copie
ls dist/_redirects
```

### 🐛 Solución de problemas comunes:

#### **Problema: "Page not found" en rutas**
**Solución:** Archivo `_redirects` configurado ✅

#### **Problema: "Build failed"**
**Solución:** 
- Verificar Node version (18)
- Comando build correcto: `npm run build`
- Directory: `dist`

#### **Problema: "Blank page"**
**Solución:**
- Verificar que `dist/index.html` existe
- Verificar que assets se generaron correctamente

### 📋 Checklist de deployment:

- ✅ `netlify.toml` configurado
- ✅ `public/_redirects` creado
- ✅ Build exitoso (`npm run build`)
- ✅ Archivos pusheados a GitHub
- ✅ Netlify conectado al repositorio

### 🌐 URLs esperadas:

Una vez configurado correctamente:
- **URL de producción:** `https://[site-name].netlify.app`
- **URL personalizada:** (opcional) configurar dominio custom

### 📝 Notas importantes:

1. **SPA Routing:** El archivo `_redirects` es crucial para que las rutas funcionen
2. **Assets:** Vite optimiza automáticamente CSS y JS
3. **Cache:** Headers configurados para mejor performance
4. **Build automático:** Netlify rebuildeará en cada push a main

### 🔄 Proceso de deployment:

1. **Push a GitHub** → Trigger automático
2. **Netlify build** → `npm run build`
3. **Deploy** → Carpeta `dist` se publica
4. **URL live** → Aplicación disponible

Si después de estos pasos aún no funciona, verifica:
- Logs de build en Netlify dashboard
- Configuración del repositorio en Netlify
- Que la branch sea `main` (no `master`)

### 🎯 Estado actual:

- ✅ Build configurado correctamente
- ✅ Archivos de configuración agregados
- ✅ Push realizado a GitHub
- 🔄 Pendiente: Conectar en Netlify dashboard
