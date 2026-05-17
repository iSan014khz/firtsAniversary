import { useState, useEffect } from "react";
import split_array_of_strings from "../utils/splitTextUsingRegex";
import { motion } from 'motion/react';
import "@fontsource/geist-sans";
import "@fontsource/geist-mono";

// Funcion para precargar el audio
function preloadAudio(url) {
    const audio = new Audio();
    audio.src = url;
    audio.load();
    return audio;
}

// ─── Variantes ───────────────────────────────────────────────────────────────

const charVariants = {
    oculto: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
        opacity: 1, y: 0, filter: "none",
        transition: { duration: 0.5, type: "spring", stiffness: 100, damping: 10 }
    },
};

// ─── Configuración de imágenes ───────────────────────────────────────────────

const imagenes = [
    { src: "/imgs/foto1.webp", top: "15%", left: "5%", width: "200px" },
    { src: "/imgs/foto2.webp", top: "40%", left: "25%", width: "280px" },
    { src: "/imgs/foto3.webp", top: "8%", left: "42%", width: "150px" },
    { src: "/imgs/foto4.webp", top: "50%", left: "55%", width: "240px" },
    { src: "/imgs/foto6.webp", top: "22%", left: "72%", width: "130px" },
    { src: "/imgs/foto5.webp", top: "5%", left: "69%", width: "150px" },
];

// ─── Precarga de imágenes y audio ────────────────────────────────────────────

imagenes.forEach(img => {
    const preload = new Image();
    preload.src = img.src;
});


// ─── Componente por imagen ────────────────────────────────────────────────────
function ImagenItem({ src, top, left, width, index }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            preloadAudio("/sounds/pop1.mp3").play();
        }, (3.5 + index * 0.4)* 820);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            style={{ position: "absolute", top, left, width }}
            animate={{ y: [0, -10, 0] }}
            transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: 3.5 + index 
            }}
        >
            <motion.div
                className="[perspective::1000px] transform-3d"
                whileHover={{
                    scale: 1.2, rotateX: 25, rotateY: 20,
                    transition: { duration: 0.7, type: "spring", stiffness: 300, damping: 30 }
                }}
                whileTap={{
                    scale: 0.9, rotateY: 360, transition: { duration: 0.5, type: "spring", stiffness: 300, damping: 20 }
                }}
                style={{ translateZ: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <motion.img
                    loading="eager"
                    src={src}
                    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                    className="shadow-ragnarok rounded-2xl object-cover select-none w-full"
                    initial={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "none" }}
                    transition={{ delay: 3.5 + index * 0.35, type: "spring", stiffness: 100, damping: 15 }}
                    draggable={false}
                />
            </motion.div>
        </motion.div>
    );
}

// ─── Componente contenedor de imágenes ───────────────────────────────────────

function ImagenDispersada() {
    return (
        <>
            {imagenes.map((img, index) => (
                <ImagenItem key={index} {...img} index={index} />
            ))}
        </>
    );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
    const [comenzar, setComenzar] = useState(false);

    const textos = ["HOLA", "CORAZ❤️N.", "YA PASÓ", "UN AÑO..."];
    const textoChars = split_array_of_strings(textos);

    return (
        <div
            className="relative flex items-center justify-between min-h-screen px-4 w-full cursor-pointer bg-fondo"
            onClick={() => { if (!comenzar) setComenzar(true); }}
        >
            {/* Mensaje inicial */}
            {!comenzar && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <p className="text-xl text-texto animate-pulse font-lexend tracking-widest text-center">
                        Haz clic en cualquier lugar para comenzar
                    </p>
                </div>
            )}

            {comenzar && (
                <>
                    {/* Bloque de texto */}
                    <div className="w-[60%]">
                        {textos.map((texto, indexLinea) => (
                            <motion.h1
                                key={indexLinea}
                                className={`font-lexend font-bold tracking-tighter leading-tight text-left
                                    text-[4.3rem] md:text-8xl lg:text-[10rem] select-none  touch-manipulation
                                    ${indexLinea === 0 ? 'pt-10 px-4 lg:pt-0' : 'py-2 px-4 md:py-4 lg:py-0'}`}
                                style={{ color: "#3D2314" }}
                                initial="oculto"
                                animate="visible"
                                transition={{ staggerChildren: 0.05, delayChildren: indexLinea * 0.7 }}
                            >
                                {textoChars[indexLinea].map((char, indexChar) => (
                                    <motion.span
                                        key={indexChar}
                                        className="inline-block text-shadow-ragnarok"
                                        style={{ whiteSpace: 'pre' }}
                                        variants={charVariants}
                                        drag
                                        dragConstraints={{ top: -10, right: 150, bottom: -10, left: 50 }}
                                        dragTransition={{ bounceStiffness: 150, bounceDamping: 25 }}
                                        dragElastic={0.1}
                                        whileHover={{
                                            scale: 0.8, y: -5,
                                            transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 15 }
                                        }}
                                        whileTap={{
                                            color: [
                                                "#ff0000", "#ff4000", "#ff7700", "#ffaa00", "#ffff00",
                                                "#aaff00", "#00ff00", "#00ff88", "#00ffff", "#00aaff",
                                                "#0055ff", "#4400ff", "#8800ff", "#cc00ff", "#ff00cc",
                                                "#ff0088", "#ff0044", "#ff0000"
                                            ],
                                            x: [0, 5, -5, 0, 5, -5],
                                            y: [0, 5, -5],
                                            rotate: [0, 20, -20, 0],
                                            transition: {
                                                color: { duration: 0.3, ease: "linear", repeat: Infinity, repeatType: "loop" },
                                                default: { duration: 0.2, repeat: Infinity, repeatDelay: 0, repeatType: "mirror" }
                                            }
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.h1>
                        ))}
                    </div>

                    {/* Imágenes dispersadas */}
                    <div className="absolute right-0 top-0 w-[40%] h-full" style={{ willChange: "transform" }}>
                        <ImagenDispersada />
                    </div>
                </>
            )}
        </div>
    );
}