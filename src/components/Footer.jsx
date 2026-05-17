import { motion, useInView, animate, cubicBezier } from "motion/react";
import { useRef, useEffect } from "react";
import FallingText from "../utils/GravityBox";
import { RevealText } from "./TextoRevelado";

const TEXT = "S & D";

function getCenterOutOrder(length) {
  const animated = Array.from({ length }, (_, i) => i);
  const center = (length - 1) / 2;
  return animated
    .map((i) => ({ i, dist: Math.abs(i - center) }))
    .sort((a, b) => a.dist - b.dist || a.i - b.i)
    .map((x, rank) => ({ index: x.i, rank }))
    .sort((a, b) => a.index - b.index)
    .map((x) => x.rank);
}

export function FooterE() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });
  const charRefs = useRef([]);
  const chars = Array.from(TEXT);
  const ranks = getCenterOutOrder(chars.length);

  useEffect(() => {
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      const rank = ranks[i];
      if (isInView) {
        animate(
          el,
          {
            opacity: [0, 1],
            filter: ["blur(3px)", "blur(0px)"],
            transform: ["translate3d(0, 7px, 0)", "translate3d(0, 0px, 0)"],
          },
          {
            duration: 0.446,
            delay: rank * 0.022,
            ease: cubicBezier(0.22, 1, 0.36, 1),
          },
        );
      } else {
        animate(
          el,
          {
            opacity: [1, 0],
            filter: ["blur(0px)", "blur(3px)"],
            transform: ["translate3d(0, 0px, 0)", "translate3d(0, -5px, 0)"],
          },
          {
            duration: 0.302,
            delay: rank * 0.016,
            ease: cubicBezier(0.64, 0, 0.78, 0),
          },
        );
      }
    });
  }, [isInView]);

  return (
    <div
      className="relative h-[800px] bg-footer select-none"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[800px] sticky top-[calc(100vh-800px)] flex flex-col items-center justify-end font-lexend font-bold">
    
          {/* Zona superior — corazones + RevealText pegado al fondo de esta zona */}
          <div className="absolute inset-0 bottom-100 flex items-end justify-center pb-4 z-10">
            <RevealText
              textos={["Feliz aniversario corazón"]}
              once={true}
              staggerChildren={0.02}
              textClassName=" text-card font-lexend text-2xl font-extrabold tracking-tight text-[4rem]"
            />
          </div>
          <div className="absolute inset-0 bottom-80 flex items-end justify-center pb-4 z-10">
            <RevealText
              textos={["Eres lo mejor que me ha pasado"]}
              once={true}
              delayAnimation={1.5}
              staggerChildren={0.02}
              textClassName=" text-card font-lexend text-2xl font-thin tracking-tight text-[2.5rem]"
            />
          </div>
    
          {/* S & D — título grande */}
          <p
            ref={containerRef}
            className="relative -bottom-60 text-[37rem] text-card flex overflow-hidden z-10 opacity-50"
          >
            {chars.map((char, i) => (
              <span
                key={i}
                ref={(el) => (charRefs.current[i] = el)}
                style={{
                  opacity: 0,
                  display: "inline-block",
                  whiteSpace: "pre",
                }}
              >
                {char}
              </span>
            ))}
          </p>
    
        </div>
      </div>
    </div>
  );
}
