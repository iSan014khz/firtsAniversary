import { useScroll, useTransform, motion } from "motion/react";
import { useRef } from "react";

export default function StackedTripleParallax() {
  const containerRef = useRef(null);

  // 1. Rastreo del scroll en el contenedor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 2. TUS TRES NIVELES (Diferentes velocidades)
  // El fondo (izquierda) se mueve poco
  const sm = useTransform(scrollYProgress, [0, 1], [10, 400]);
  // El medio (derecha) se mueve un poco más
  const md = useTransform(scrollYProgress, [0, 1], [150, -150]);
  // El frente (centro) se mueve mucho (muy rápido)
  const lg = useTransform(scrollYProgress, [0, 1], [300, -300]);

  const divs = [
    { 
      id: "atrás-izq", 
      y: sm, 
      color: "#FF0080", 
      zIndex: 3, 
      label: "Lento",
      style: { left: "30%", width: "220px", height: "320px", opacity: 1 } 
    },
    { 
      id: "atrás-der", 
      y: md, 
      color: "#0070F3", 
      zIndex: 3, 
      label: "Medio",
      style: { right: "30%", width: "220px", height: "320px", opacity: 1 } 
    },
    { 
      id: "frente-centro", 
      y: lg, 
      color: "#7928CA", 
      zIndex: 2, 
      label: "Rápido",
      style: { left: "50%", x: "-50%", width: "380px", height: "500px", opacity: 1 } 
    },
  ];

  return (
    <div className="bg-white min-h-[300vh]">
      <div style={{ height: "100vh" }} />

      <div 
        ref={containerRef} 
        style={{ 
          height: "80vh", 
          position: "relative", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible" 
        }}
      >
        {divs.map((item) => (
          <motion.div
            key={item.id}
            style={{ 
              y: item.y, // Aquí aplicamos el nivel de parallax único
              zIndex: item.zIndex,
              position: "absolute",
              background: item.color,
              borderRadius: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              ...item.style 
            }}
          >
            <span style={{ fontSize: "1.5rem", fontWeight: "900" }}>{item.id.split('-')[0].toUpperCase()}</span>
            <span style={{ fontSize: "0.9rem", opacity: 0.7 }}>{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ height: "120vh" }} />
    </div>
  );
}