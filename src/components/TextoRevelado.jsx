import React from "react";
import { motion } from "motion/react";

export function RevealText({ 
  textos = [], 
  className, 
  textClassName,
  staggerChildren = 0.05,
  delayAnimation = 0,
  once= true
}) {
  
  // Variantes para los caracteres (puedes ajustar el blur o el y aquí)
  const charVariants = {
    oculto: { 
      opacity: 0, 
      y: 15, 
      filter: "blur(10px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9], // Un ease-out suave y moderno
      }
    }
  };

  return (
    <motion.div className={"flex flex-col"+ className}
    >
      {textos.map((texto, indexLinea) => (
        <motion.h1
          key={indexLinea}
          initial="oculto"
          whileInView="visible" // Se activa al hacer scroll o al cargar
          viewport={{ once: once }} // Solo se anima una vez
          transition={{
            staggerChildren: staggerChildren ?? 0.05,
            delayChildren: indexLinea * 0.3 + (delayAnimation ?? 0) // Cascada entre líneas
          }}
          className={"flex flex-col"+ className + textClassName}
        >
          {/* Separamos por letras, pero manteniendo los espacios */}
          {texto.split("").map((char, indexChar) => (
            <motion.span
              key={`${indexLinea}-${indexChar}`}
              variants={charVariants}
              className="inline-block"
              style={{ whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      ))}
    </motion.div>
  );
}