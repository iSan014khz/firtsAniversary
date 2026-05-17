import split_array_of_strings from "../utils/splitTextUsingRegex";
import { motion, useScroll, useSpring, AnimatePresence,} from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import "@fontsource/geist-sans";
import "@fontsource/geist-mono";

const charVariants = {
    oculto: { opacity: 0, x: -25, filter: "blur(20px)" },
    visible: {
        opacity: 1, x: 0, filter: "none",
        transition: { duration: 5, type: "spring", stiffness: 100, damping: 10 },
    },

    oculto2: { opacity: 0, y: -50, scaleY: 1, filter: "blur(20px)", },
    special: {
        opacity: 1, y: 0, filter: "none", scaleY: 0.2,
        transition: {
            scaleY: { delay: 1.7, duration: 1, type: "spring", stiffness: 300, damping: 5 },
            default: { duration: 1, type: "spring", stiffness: 100, damping: 10 }
        },
    },
};


const parrafos = ["Y CADA", "DÍA", "TE AMO", "MÁS."];
const charsParrafos = split_array_of_strings(parrafos);

export default function ScrollText() {
    const ref = useRef(null);

    // 1. Primero el scroll
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["end end", "end start"]
    });

    // 2. Luego el spring que depende de scrollYProgress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            {/* <div className="h-50 w-full bg-fondo"></div>*/}
            <div ref={ref} className="lg:pt-25 px-4 pb-[30vh] bg-fondo text-texto">
                {parrafos.map((parrafo, index) => (
                    index === parrafos.length - 1 ? // Si es el último párrafo, aplicamos la animación especial
                        <motion.h1
                            key={index}
                            initial="oculto2"
                            whileInView="special"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ staggerChildren: 0.05, delayChildren: index * 0.1 }}  // 👈 stagger
                            className={`font-lexend font-semibold tracking-tighter text-left
                                text-[4.3rem] md:text-8xl lg:text-[24rem] select-none touch-manipulation lg:pt-27 lg:pb-4`}
                        >
                            {charsParrafos[index].map((char, indexChar) => (
                                <motion.span
                                className="text-shadow-ragnarok "
                                    key={indexChar}
                                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                                    variants={charVariants}
                                    whileHover={{scale:0.8, transition: {duration: 0.3, type: "spring", stiffness:100}}}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.h1>

                        : <motion.h1 // Para los demás párrafos, la animación normal
                            key={index}
                            initial="oculto"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ staggerChildren: 0.05, delayChildren: index * 0.1 }}  // 👈 stagger
                            className={`font-lexend font-extrabold tracking-tighter text-left
                                text-[4.3rem] md:text-8xl lg:text-[11rem] select-none touch-manipulation lg:py-27`}
                        >
                            {charsParrafos[index].map((char, indexChar) => (
                                <motion.span
                                className="text-shadow-ragnarok"
                                    key={indexChar}
                                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                                    variants={charVariants}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.h1>
                ))}
            </div >
        </>
    )
}