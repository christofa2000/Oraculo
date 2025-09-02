import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import BlurText from "./BlurText"; // 👈 ajustá la ruta si está en /components

type Frase = {
  id: string;
  texto: string;
};

// Hook: respeta el prefers-reduced-motion del SO/navegador
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    const update = () => setReduce(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduce;
}

export default function FrasesPage() {
  const navigate = useNavigate();
  const [frases, setFrases] = useState<Frase[]>([]);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const fetchFrases = async () => {
      const { data, error } = await supabase.from("frases").select("id, texto");
      if (error) {
        console.error(error);
        return;
      }
      setFrases(data || []);
    };
    fetchFrases();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro quieres eliminar esta frase?")) return;
    const { error } = await supabase.from("frases").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar la frase");
      return;
    }
    setFrases((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <>
      {/* Fondo cósmico */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-black"></div>
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white">
        {/* Título animado con BlurText */}
        <BlurText
          text="Frases guardadas"
          className="glow-text text-4xl font-bold mb-8 text-center drop-shadow-lg"
          animateBy="words"
          delay={reduceMotion ? 0 : 70}
          direction="top"
          rootMargin="0px 0px -20% 0px"
          stepDuration={reduceMotion ? 0.001 : 0.35}
        />

        <div className="flex flex-col gap-4 max-w-md w-full">
          {frases.length === 0 && (
            <p className="text-white/80 text-center">No hay frases guardadas</p>
          )}

          {frases.map((frase) => {
            const corta = frase.texto.length <= 42; // umbral simple
            return (
              <div
                key={frase.id}
                className="flex items-center justify-between px-4 py-4 rounded-xl text-white bg-transparent border-2 border-violet-500 backdrop-blur-sm"
              >
                {/* Frase animada */}
                <BlurText
                  key={frase.id + "-" + frase.texto} // re-monta si cambia el texto
                  text={frase.texto}
                  className="break-words flex-1 pr-3 text-xl sm:text-2xl"
                  animateBy={corta ? "chars" : "words"}
                  delay={reduceMotion ? 0 : corta ? 25 : 55}
                  direction="top"
                  rootMargin="0px 0px -15% 0px"
                  stepDuration={reduceMotion ? 0.001 : 0.3}
                />

                {/* Botón eliminar */}
                <button
                  onClick={() => handleDelete(frase.id)}
                  className="ml-4 text-violet-400 hover:text-red-500 transition"
                  title="Eliminar frase"
                  aria-label="Eliminar frase"
                >
                  ❌
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 bg-purple-500/80 text-white rounded-xl hover:bg-purple-600/90 backdrop-blur-sm shadow-md transition"
        >
          Volver
        </button>
      </main>
    </>
  );
}
