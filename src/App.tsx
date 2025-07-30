import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './index.css'

export default function App() {
  const [frases, setFrases] = useState<string[]>([])
  const [mensaje] = useState('ORÁCULO SAGRADO')
  const [revelacion, setRevelacion] = useState('')
  const [nuevaFrase, setNuevaFrase] = useState('')
  const [msgExito, setMsgExito] = useState('')
  const navigate = useNavigate()
  const shootingRef = useRef<HTMLDivElement>(null)

  // Carga inicial de frases
  useEffect(() => {
    async function fetchFrases() {
      const { data, error } = await supabase.from('frases').select('texto')
      if (error) {
        console.error('Error cargando frases:', error)
        return
      }
      setFrases(data.map(f => f.texto))
    }
    fetchFrases()
  }, [])

  // Generación de estrellas fugaces aleatorias, ángulo fijo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!shootingRef.current) return

      const star = document.createElement('div')
      star.className = 'shooting-star'

      // Posición de inicio aleatoria en X y ligeramente arriba
      const startX = Math.random() * 100
      star.style.left = `${startX}vw`
      star.style.top = `-5vh`

      // Distancia de recorrido (120–200 vh)
      const distance = 120 + Math.random() * 80
      star.style.setProperty('--distance', `${distance}vh`)

      // Escala variable (0.5–1.2) y duración lenta (2–4 s)
      const scale = 0.5 + Math.random() * 0.7
      const duration = 2 + Math.random() * 2
      star.style.setProperty('--scale', `${scale}`)
      star.style.setProperty('--duration', `${duration}s`)

      shootingRef.current.appendChild(star)
      // Lo quitamos tras completar la animación
      setTimeout(() => star.remove(), duration * 1000)
    }, 1000 + Math.random() * 2000) // cada 1–3 s

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (!frases.length) return
    const aleatoria = frases[Math.floor(Math.random() * frases.length)]
    setRevelacion(aleatoria)
  }

  const handleAddFrase = async () => {
    if (!nuevaFrase.trim()) return
    if (frases.some(f => f.toLowerCase() === nuevaFrase.trim().toLowerCase())) {
      alert('Esa frase ya está agregada.')
      return
    }
    const { error } = await supabase.from('frases').insert([{ texto: nuevaFrase.trim() }])
    if (error) {
      alert('Error al guardar la frase')
      return
    }
    setFrases([...frases, nuevaFrase.trim()])
    setNuevaFrase('')
    setMsgExito('¡Frase agregada con éxito!')
    setTimeout(() => setMsgExito(''), 3000)
  }

  return (
    <>
      {/* Fondo + shooting stars */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-black" />
        <div className="stars" />
        <div className="twinkling" />
        <div ref={shootingRef} className="shooting-stars" />
      </div>

      <main className="relative z-10 flex flex-col items-center min-h-screen px-4 py-12 text-white">
        <h1 className="glow-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-10 mb-8 text-center">
          {mensaje}
        </h1>

        <input
          id="frase-input"
          type="text"
          placeholder="Escribe tu frase cósmica..."
          className="px-4 py-4 rounded-xl w-full max-w-md mb-2 text-white bg-transparent border-2 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-violet-300"
          value={nuevaFrase}
          onChange={e => setNuevaFrase(e.target.value)}
        />

        {msgExito && <p className="text-violet-400 mb-4 animate-fadeIn">{msgExito}</p>}

        <div className="flex justify-center gap-6 w-full max-w-md mb-8">
          <button
            onClick={handleClick}
            className="px-8 py-4 bg-purple-500/80 text-white rounded-xl hover:bg-purple-600/90 backdrop-blur-sm shadow-md transition"
          >
            ILUMÍNAME
          </button>
          <button
            onClick={handleAddFrase}
            className="px-8 py-4 bg-purple-500/80 text-white rounded-xl hover:bg-purple-600/90 backdrop-blur-sm shadow-md transition"
          >
            Agrega tu magia
          </button>
        </div>

        {revelacion && (
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-purple-300 text-center max-w-3xl animate-fadeIn font-semibold px-4">
            {revelacion}
          </p>
        )}

         <button
             onClick={() => navigate('/frases')}
             className="fixed bottom-6 right-6 px-3 py-1 text-sm bg-purple-500/80 text-white rounded-lg backdrop-blur-sm shadow-md transition opacity-0 pointer-events-auto"
             title="Ver frases"
          >
                 Ver frases
          </button>

      </main>
    </>
  )
}
