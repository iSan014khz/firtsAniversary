import { motion, AnimatePresence, scale } from 'motion/react'
import { useState } from 'react'

export default function Header() {
    const [estaAbierto, setAbierto] = useState(false);
    const [estaAbierto2, setAbierto2] = useState(false);

    const variantesNav = {
        oculto: { opacity: 0, y: -10, scaleY:0.6, filter: "blur(10px)", transition: { duration: 0 } },
        visible: { opacity: 1, y: 0, scaleY: 1, scaleX: 1, filter: "none", transition: { duration: 0.3, type: "spring", stiffness: 100, damping: 15 } },
    }

    const navs = ['Sala de Recuerdos', 'Nosotros', 'Más']


    const variantesRayitas = [
        { cerrado: { rotate: 0, y: 0 }, abierto: { rotate: 45, y: 12 } },   // Superior
        { cerrado: { opacity: 1, x: 0 }, abierto: { opacity: 0, x: -20, transition: { duration: 0.1 } } }, // Media
        { cerrado: { rotate: 0, y: 0 }, abierto: { rotate: -45, y: -8 } }  // Inferior
    ];

    // Variastes de las a del Nav
    const contenedorVariantes = {
        oculto: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                // Aquí ocurre la magia: espera 0.2s entre cada hijo
                staggerChildren: 0.15,
                delayChildren: 0.2 // Espera un poco antes de empezar con el primer hijo
            }
        },
        salida: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };
    const itemVariantes = {
        oculto: { opacity: 0, x: -40, scaleY: 0.2, filter: "blur(10px)" },
        visible: {
            filter: "none",
            opacity: 1,
            x: [40, 0],
            scaleY: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            }
        },

    };

    return (
        <nav className='fixed top-0 left-0 w-full z-50'>
            <motion.div
                className='shadow-ragnarok flex items-center justify-between px-6 h-16 bg-white mx-6 my-3 rounded-3xl relative z-50'
                variants={variantesNav}
                animate={estaAbierto2 ? "visible" : "oculto"}
                exit="salida"
                onClick={() => setAbierto2(!estaAbierto2)}

                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
                <div className="text-neutral-500 font-bold">Logo</div>

                {/* Contenedor del Botón */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation()  // 👈 evita que suba al motion.div
                        setAbierto(!estaAbierto)
                    }}
                    className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
                    whileTap={{ scaleX: 1.5 }}
                    whileHover={{ scale: 0.9, transition: { type: "spring", stiffness: 800, damping: 15 } }}
                >
                    {variantesRayitas.map((variante, index) => (
                        <motion.div
                            key={index}
                            className="shadow-[0_0.5px_1px_rgb(0,0,0,0.12)] w-9 h-1 bg-neutral-400 rounded-full"
                            variants={variante}
                            animate={estaAbierto ? "abierto" : "cerrado"}
                            transition={{ type: "spring", stiffness: 200 }}
                        />
                    ))}
                </motion.button>

                {/* Menú Desplegable */}
                <AnimatePresence>
                    {estaAbierto && (
                        <motion.div
                            variants={contenedorVariantes}
                            initial="oculto"
                            animate="visible"
                            exit="salida"
                            className="shadow-aceternity absolute top-20 left-0 w-full bg-white rounded-2xl p-4 flex flex-col gap-4 shadow-xl overflow-hidden"
                        >
                            {navs.map((nav, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    variants={itemVariantes} // No necesitas initial/animate aquí, lo hereda del padre
                                    whileHover={{
                                        scale: 1.1, // Un poco de escala para resaltar
                                        opacity: 0.8,

                                        transition: {
                                            // Configuración para el degradado de color
                                            backgroundPosition: {
                                                duration: 2, // Tardará medio segundo en ponerse rojo de izq a der
                                                ease: "easeIn"
                                            },
                                            // Configuración por defecto para el scale
                                            default: {
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20
                                            }
                                        }
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                        transition: {
                                            type: "spring",
                                            stiffness: 400,  // más rígido = respuesta más inmediata
                                            damping: 25,     // más amortiguado = sin rebote
                                            duration: 0.15   // duration se ignora en spring, puedes quitarlo
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log('click!'); // 👈
                                        setTimeout(() => setAbierto(false));
                                    }}
                                    className="text-neutral-500 font-semibold origin-left block py-1 px-4 rounded-lg 
                                active:text-red-400 transition-colors duration-150 pointer-events-auto"
                                >
                                    {nav}
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </nav>
    )
}