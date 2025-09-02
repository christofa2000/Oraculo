import { useState, useEffect, useRef, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./index.css";
import BlurText from "./BlurText";

export default function App() {
  const [frases, setFrases] = useState<string[]>([]);
  const [mensaje] = useState("ORÁCULO SAGRADO");
  const [revelacion, setRevelacion] = useState("");
  const [nuevaFrase, setNuevaFrase] = useState("");
  const [msgExito, setMsgExito] = useState("");
  const navigate = useNavigate();
  const shootingRef = useRef<HTMLDivElement>(null);

  // 👁️ ref para el seguimiento del ojo en el título
  const badgeWrapRef = useRef<HTMLSpanElement>(null);

  // Carga inicial de frases
  useEffect(() => {
    async function fetchFrases() {
      const { data, error } = await supabase.from("frases").select("texto");
      if (error) {
        console.error("Error cargando frases:", error);
        return;
      }
      setFrases(data.map((f) => f.texto));
    }
    fetchFrases();
  }, []);

  // Estrellas fugaces
  useEffect(() => {
    const interval = setInterval(() => {
      if (!shootingRef.current) return;
      const star = document.createElement("div");
      star.className = "shooting-star";

      const startX = Math.random() * 100;
      star.style.left = `${startX}vw`;
      star.style.top = `-5vh`;

      const distance = 120 + Math.random() * 80;
      star.style.setProperty("--distance", `${distance}vh`);

      const scale = 0.5 + Math.random() * 0.7;
      const duration = 2 + Math.random() * 2;
      star.style.setProperty("--scale", `${scale}`);
      star.style.setProperty("--duration", `${duration}s`);

      shootingRef.current.appendChild(star);
      setTimeout(() => star.remove(), duration * 1000);
    }, 1000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (!frases.length) return;
    const aleatoria = frases[Math.floor(Math.random() * frases.length)];
    setRevelacion(aleatoria);
  };

  const handleAddFrase = async () => {
    if (!nuevaFrase.trim()) return;
    if (
      frases.some((f) => f.toLowerCase() === nuevaFrase.trim().toLowerCase())
    ) {
      alert("Esa frase ya está agregada.");
      return;
    }
    const { error } = await supabase
      .from("frases")
      .insert([{ texto: nuevaFrase.trim() }]);
    if (error) {
      alert("Error al guardar la frase");
      return;
    }
    setFrases([...frases, nuevaFrase.trim()]);
    setNuevaFrase("");
    setMsgExito("¡Frase agregada con éxito!");
    setTimeout(() => setMsgExito(""), 3000);
  };

  // === OJO EN EL TÍTULO: tracking hacia el mouse ===
  const handleTitleMove = (e: MouseEvent<HTMLHeadingElement>) => {
    const wrap = badgeWrapRef.current;
    if (!wrap) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = 10; // desplazamiento máximo en px
    const dx = Math.max(-max, Math.min(max, (e.clientX - cx) * 0.05));
    const dy = Math.max(-max, Math.min(max, (e.clientY - cy) * 0.05));
    wrap.style.setProperty("--dx", `${dx}px`);
    wrap.style.setProperty("--dy", `${dy}px`);
  };

  const handleTitleLeave = () => {
    const wrap = badgeWrapRef.current;
    if (!wrap) return;
    wrap.style.setProperty("--dx", `0px`);
    wrap.style.setProperty("--dy", `0px`);
  };

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
        {/* Título con ojo en el medio */}
        <h1
          className="glow-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-10 mb-8 text-center
                     flex items-center justify-center gap-3 select-none"
          onMouseMove={handleTitleMove}
          onMouseLeave={handleTitleLeave}
        >
          <span>ORÁCULO</span>

          {/* envolturas anidadas para combinar translate (tracking) + pulse + blink */}
          <span ref={badgeWrapRef} className="oracle-badge-wrap">
            <span className="oracle-badge-pulse">
              <img
                src="/ojo-mano.png"
                alt=""
                aria-hidden="true"
                className="oracle-badge h-20 sm:h-24 md:h-32 lg:h-40 xl:h-48 w-auto"
                draggable={false}
              />
            </span>
          </span>

          <span>SAGRADO</span>
        </h1>

        <input
          id="frase-input"
          type="text"
          placeholder="Escribe tu frase cósmica..."
          className="px-4 py-4 rounded-xl w-full max-w-md mb-2 text-white bg-transparent border-2 border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-violet-300"
          value={nuevaFrase}
          onChange={(e) => setNuevaFrase(e.target.value)}
        />

        {msgExito && (
          <p className="text-violet-400 mb-4 animate-fadeIn">{msgExito}</p>
        )}

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
          <BlurText
            key={revelacion}
            as="p"
            text={revelacion}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-purple-300 text-center max-w-3xl font-semibold px-4"
            animateBy={revelacion.length <= 42 ? "chars" : "words"}
            delay={revelacion.length <= 42 ? 25 : 55}
            direction="top"
            stepDuration={0.35}
            rootMargin="0px 0px -10% 0px"
          />
        )}

        <button
          onClick={() => navigate("/frases")}
          className="fixed bottom-6 right-6 px-3 py-1 text-sm bg-purple-500/80 text-white rounded-lg backdrop-blur-sm shadow-md transition opacity-0 pointer-events-auto"
          title="Ver frases"
        >
          Ver frases
        </button>
      </main>
    </>
  );
}
