# Trello Clone - Aplicación de Gestión de Tareas

Una aplicación web moderna tipo Trello construida con React, TailwindCSS y react-beautiful-dnd para gestión de tareas con funcionalidad de drag & drop.

## 🚀 Características Principales

- **Tableros con listas de tareas**: Organiza tus proyectos en listas personalizables
- **Tarjetas arrastrables**: Mueve tarjetas entre listas con animaciones suaves
- **CRUD completo**: Crea, edita y elimina listas y tarjetas
- **Backend simulado**: Datos almacenados en JSON con persistencia local
- **Interfaz responsive**: Diseño adaptable para todos los dispositivos
- **Animaciones fluidas**: Transiciones suaves y efectos visuales
- **Comentarios detallados**: Código bien documentado para fácil mantenimiento

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **TailwindCSS** - Framework de CSS utilitario
- **@hello-pangea/dnd** - Biblioteca para drag & drop (fork actualizado de react-beautiful-dnd)
- **Lucide React** - Iconos modernos y ligeros

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ instalado
- npm o yarn como gestor de paquetes

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd trello-fullstack
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
trello-fullstack/
├── public/
├── src/
│   ├── components/
│   │   ├── Board.jsx      # Componente principal del tablero
│   │   ├── List.jsx       # Componente de lista de tareas
│   │   └── Card.jsx       # Componente de tarjeta individual
│   ├── data/
│   │   └── mockData.json  # Datos de ejemplo (backend simulado)
│   ├── App.jsx            # Componente principal de la aplicación
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales con TailwindCSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Funcionalidades Implementadas

### 1. Gestión de Listas
- ✅ Crear nuevas listas
- ✅ Editar títulos de listas
- ✅ Eliminar listas (con confirmación)
- ✅ Conteo automático de tarjetas

### 2. Gestión de Tarjetas
- ✅ Agregar tarjetas con título y descripción
- ✅ Editar tarjetas existentes
- ✅ Eliminar tarjetas (con confirmación)
- ✅ Arrastrar y soltar entre listas
- ✅ Animaciones durante el arrastre

### 3. Interfaz de Usuario
- ✅ Diseño responsive y moderno
- ✅ Efectos hover en tarjetas
- ✅ Menús contextuales
- ✅ Animaciones suaves
- ✅ Feedback visual para acciones

### 4. Backend Simulado
- ✅ Carga de datos desde JSON
- ✅ Simulación de guardado
- ✅ Función de restablecimiento
- ✅ Indicadores de cambios sin guardar

## 🎨 Características de Diseño

### Paleta de Colores
- **Primarios**: Azules (#3B82F6, #1D4ED8)
- **Secundarios**: Grises (#6B7280, #9CA3AF)
- **Estados**: Verde (#10B981), Rojo (#EF4444), Amarillo (#F59E0B)

### Animaciones
- Transiciones suaves de 200ms
- Efectos de hover y focus
- Animaciones de entrada (fade-in, slide-in)
- Efectos de arrastre con rotación y escala

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Scroll horizontal en dispositivos móviles
- Adaptación de botones y espaciados

## 📋 Datos de Ejemplo

El archivo `src/data/mockData.json` contiene datos de ejemplo con:

- **4 listas**: "Por Hacer", "En Progreso", "En Revisión", "Completado"
- **8 tarjetas** distribuidas entre las listas
- **Títulos y descripciones** realistas de un proyecto de desarrollo

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 🚀 Posibles Mejoras Futuras

### Funcionalidades
- [ ] Autenticación de usuarios
- [ ] Backend real con API REST
- [ ] Base de datos persistente
- [ ] Colaboración en tiempo real
- [ ] Notificaciones
- [ ] Fechas de vencimiento
- [ ] Etiquetas y categorías
- [ ] Búsqueda y filtros
- [ ] Archivos adjuntos
- [ ] Comentarios en tarjetas

### Técnicas
- [ ] Tests unitarios y de integración
- [ ] PWA (Progressive Web App)
- [ ] Optimización de rendimiento
- [ ] Internacionalización (i18n)
- [ ] Modo oscuro
- [ ] Accesibilidad mejorada

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de PostCSS**
   ```bash
   # Asegúrate de que postcss.config.js use export default
   export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
   ```

2. **Estilos de TailwindCSS no aparecen**
   ```bash
   # Verifica que index.css esté importado en main.jsx
   import './index.css'
   ```

3. **Drag & Drop no funciona**
   ```bash
   # Asegúrate de que @hello-pangea/dnd esté instalado
   npm install @hello-pangea/dnd
   ```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **LinkedIn**: [tu-linkedin]
- **GitHub**: [tu-github]

---

Desarrollado con ❤️ usando React y TailwindCSS

