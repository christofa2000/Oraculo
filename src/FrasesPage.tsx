import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'  // Ajusta la ruta según tu estructura

type Frase = {
  id: string
  texto: string
}

export default function FrasesPage() {
  const navigate = useNavigate()
  const [frases, setFrases] = useState<Frase[]>([])

  useEffect(() => {
    const fetchFrases = async () => {
      const { data, error } = await supabase.from('frases').select('id, texto')
      if (error) {
        console.error(error)
        return
      }
      setFrases(data || [])
    }
    fetchFrases()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro quieres eliminar esta frase?')) return

    const { error } = await supabase.from('frases').delete().eq('id', id)
    if (error) {
      alert('Error al eliminar la frase')
      return
    }
    setFrases(frases.filter(f => f.id !== id))
  }

  return (
    <>
      {/* Fondo cósmico */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-black"></div>
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white">
        <h1 className="glow-text text-4xl font-bold mb-8 text-center drop-shadow-lg">
          Frases guardadas
        </h1>

        <div className="flex flex-col gap-4 max-w-md w-full">
          {frases.length === 0 && (
            <p className="text-white/80 text-center">No hay frases guardadas</p>
          )}

          {frases.map((frase) => (
            <div
              key={frase.id}
              className="flex justify-between items-center px-4 py-4 rounded-xl text-white bg-transparent border-2 border-violet-500 backdrop-blur-sm"
            >
              <span className="break-words">{frase.texto}</span>
              <button
                onClick={() => handleDelete(frase.id)}
                className="ml-4 text-violet-400 hover:text-red-500 transition"
                title="Eliminar frase"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-purple-500/80 text-white rounded-xl hover:bg-purple-600/90 backdrop-blur-sm shadow-md transition"
        >
          Volver
        </button>
      </main>
    </>
  )
}
