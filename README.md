# Star Defender: Evolution 🚀

https://github.com/hugorollan/JuegoDisparosDefinitivo

Un emocionante juego de disparos espacial estilo arcade de los años 90, desarrollado con Next.js y Firebase Studio. Defiende la galaxia destruyendo oleadas de enemigos cada vez más difíciles mientras recolectas power-ups y acumulas puntos.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Características

### Funcionalidades del Juego
- **Sistema de Puntuación**: Acumula puntos destruyendo enemigos y avanzando de nivel
- **Sistema de Vidas**: Gestiona tus vidas cuidadosamente - el juego termina cuando llegas a cero
- **Enemigos Progresivos**: Enfrenta diferentes tipos de enemigos con dificultad creciente:
  - Triángulos (enemigos básicos)
  - Pentágonos (enemigos avanzados)
  - Cuadrados, Hexágonos y Octágonos
  - Jefes finales con patrones de ataque únicos
- **Power-ups Coleccionables**:
  - 🛡️ **Escudo**: Protección temporal contra daño
  - ⚡ **Disparo Rápido**: Aumenta tu velocidad de disparo
  - ❤️ **Vida Extra**: Recupera una vida perdida
- **Detección de Colisiones**: Sistema preciso de física del juego
- **Estados de Juego**: Pantallas de inicio, game over, victoria y transición entre niveles
- **Sistema de Pausa**: Pausa el juego en cualquier momento
- **Efectos de Sonido**: Audio retro generado mediante Web Audio API
- **Música de Fondo**: Ambientación musical durante el juego
- **Dificultad Escalable**: Cada nivel aumenta el desafío progresivamente

### Diseño Estético
- 🎨 **Estilo Retro 90s**: Inspirado en los clásicos juegos arcade
- **Paleta de Colores**:
  - Rosa vibrante (#FF69B4) - Color primario
  - Aguamarina (#7DF9FF) - Color secundario
  - Negro (#000000) - Fondo
- **Tipografía**: Fuentes pixeladas que evocan la era arcade
- **Animaciones**: Explosiones y efectos visuales simples pero impactantes

## 🎮 Controles

### Teclado
- **Mover a la Izquierda**: Flecha Izquierda o `A`
- **Mover a la Derecha**: Flecha Derecha o `D`
- **Disparar**: Barra Espaciadora, Flecha Arriba o `W`
- **Pausar**: `P` o `Esc`

### Dispositivos Móviles
- Toca los botones en pantalla para moverte y disparar
- Interfaz táctil optimizada para jugar en cualquier dispositivo

## 🚀 Tecnologías Utilizadas

- **Framework**: [Next.js 15.3.3](https://nextjs.org/) con App Router
- **Lenguaje**: TypeScript 5
- **UI Library**: React 18.3.1
- **Estilos**: Tailwind CSS 3.4.1
- **Componentes UI**: Radix UI
- **Backend**: Firebase 11.9.1
- **Iconos**: Lucide React
- **Desarrollo**: Turbopack para builds ultra-rápidos

## 📦 Instalación

### Requisitos Previos
- Node.js 20 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/hugorollan/JuegoDisparosDefinitivo.git
cd JuegoDisparosDefinitivo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:9002
```

## 🛠️ Scripts Disponibles

```bash
# Iniciar servidor de desarrollo con Turbopack
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint

# Verificar tipos de TypeScript
npm run typecheck
```

## 📁 Estructura del Proyecto

```
JuegoDisparosDefinitivo/
├── src/
│   ├── app/
│   │   └── page.tsx          # Componente principal del juego
│   ├── components/
│   │   ├── game/             # Componentes del juego
│   │   │   ├── game-area.tsx
│   │   │   ├── hud.tsx
│   │   │   ├── start-screen.tsx
│   │   │   ├── game-over-screen.tsx
│   │   │   ├── win-screen.tsx
│   │   │   ├── level-transition-screen.tsx
│   │   │   └── pause-screen.tsx
│   │   ├── game-icons.tsx    # Iconos personalizados del juego
│   │   └── ui/               # Componentes UI reutilizables
│   ├── hooks/                # React hooks personalizados
│   └── lib/
│       ├── types.ts          # Definiciones de tipos TypeScript
│       ├── constants.ts      # Constantes del juego
│       └── utils.ts          # Funciones utilitarias
├── docs/
│   └── blueprint.md          # Documentación de diseño
├── public/                   # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎯 Cómo Jugar

1. **Inicio**: Haz clic en "Start Game" o presiona Espacio en la pantalla de inicio
2. **Objetivo**: Destruye todos los enemigos en cada nivel
3. **Estrategia**: 
   - Evita los disparos enemigos
   - Recolecta power-ups para ventajas temporales
   - Usa el escudo en momentos críticos
   - Derrota a los jefes finales para ganar
4. **Puntuación**: Acumula la mayor puntuación posible antes de perder todas tus vidas

## 🔧 Desarrollo

### Para comenzar a desarrollar

El archivo principal del juego está en `src/app/page.tsx`. Este contiene toda la lógica del juego, incluyendo:
- Gestión de estados
- Física y colisiones
- Generación de enemigos
- Sistema de power-ups
- Controles y eventos

### Personalización

Puedes personalizar fácilmente:
- **Colores**: Modifica `tailwind.config.ts`
- **Constantes del juego**: Edita `src/lib/constants.ts`
- **Tipos de enemigos**: Añade nuevos en `src/components/game-icons.tsx`
- **Power-ups**: Agrega más tipos en `src/lib/types.ts`

## 🐛 Solución de Problemas

### El juego no se inicia
- Verifica que Node.js 20+ esté instalado
- Elimina `node_modules` y `.next`, luego ejecuta `npm install` nuevamente

### Problemas de audio
- Asegúrate de que tu navegador soporte Web Audio API
- Algunos navegadores requieren interacción del usuario antes de reproducir audio

### Problemas de rendimiento
- El juego usa canvas HTML5, asegúrate de tener una GPU habilitada en el navegador

## 📝 Licencia

© 2025 Hugo Rollán. Todos los derechos reservados.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Hugo Rollán - [@hugorollan](https://github.com/hugorollan)

Project Link: [https://github.com/hugorollan/JuegoDisparosDefinitivo](https://github.com/hugorollan/JuegoDisparosDefinitivo)

---

**¡Disfruta el juego y que la fuerza esté contigo! 🚀✨**
