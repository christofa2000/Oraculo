# 🎁 Oráculo Sagrado

> **Proyecto de regalo de cumpleaños de Ceci**

---

## 📝 Descripción

Oráculo Sagrado es una aplicación web interactiva que muestra frases cósmicas aleatorias y permite a los usuarios agregar sus propias frases. Cuenta con un **fondo estrellado animado** y **estrellas fugaces** que atraviesan la pantalla para ofrecer una experiencia mágica.

---

## 🚀 Tecnologías

* **React + TypeScript**
* **Vite**
* **Tailwind CSS**
* **Supabase** (base de datos y autenticación)
* **React Router** (navegación)

---

## 🔧 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/<TU-USUARIO>/oraculo.git
   cd oraculo
   ```
2. Instala dependencias:

   ```bash
   npm install
   ```
3. Configura Supabase:

   * Crea un proyecto en [https://supabase.com](https://supabase.com)
   * Copia la URL y la **anon key** en un archivo `.env`:

     ```env
     VITE_SUPABASE_URL=https://xyz.supabase.co
     VITE_SUPABASE_ANON_KEY=tu_anon_key
     ```
4. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```
5. Abre `http://localhost:5173` en tu navegador.

---

## 📋 Uso

* **ILUMÍNAME**: Obtener una frase aleatoria del oráculo.
* **Agrega tu magia**: Insertar una nueva frase cósmica en la base de datos.
* **Ver frases**: Ver todas las frases almacenadas (botón invisible en la esquina inferior derecha).

---

## ✨ Características destacadas

* **Fondo estrellado animado** con capas de estrellas y parpadeo.
* **Estrellas fugaces** dinámicas con trayectoria inclinada (30°) y velocidad aleatoria.
* **Animaciones suaves**: texto glow y aparición gradual de elementos.
* **Responsive**: adaptado a diferentes tamaños de pantalla.

---

## 🎨 Personalización

* Ángulo de caída de meteoros: modificar `--angle` en `index.css`.
* Frecuencia y duración: ajustar `--duration`, `--distance` y el intervalo en `App.tsx`.
* Colores y degradados: editar clases de Tailwind o estilos en CSS.

---

## 🏷️ License

MIT © 2025 Ceci & Christian Oscar Papa

---

*¡Gracias por usar Oráculo Sagrado! 🌌✨*
