import { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useScroll } from "motion/react";
import Matter from "matter-js";
import UnderlinedText from "./CrayonUnderline";

const WordSpan = ({ word, isHighlighted, index }) => (
  <div className="inline-block select-none font-nunito text-texto">
    {isHighlighted ? (
      <UnderlinedText
        color="#B85C38"
        duration={2000}
        delay={index * 7}
        thickness={6}
      >
        {word}
      </UnderlinedText>
    ) : (
      <span>{word}</span>
    )}
  </div>
);

// Función pura fuera del componente: convierte una línea en chunks
// respetando las frases resaltadas completas
const chunkLine = (line, highlightPhrases, CHUNK_SIZE) => {
  const words = line.split(" ").filter(Boolean);
  const result = []; // [{ text: string, isHighlighted: boolean }]
  let i = 0;
  while (i < words.length) {
    let matched = false;
    for (const phrase of highlightPhrases) {
      const phraseWords = phrase.trim().split(" ");
      const slice = words.slice(i, i + phraseWords.length).join(" ");
      if (slice === phrase.trim()) {
        result.push({ text: slice, isHighlighted: true });
        i += phraseWords.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      let end = i;
      let count = 0;
      while (end < words.length && count < CHUNK_SIZE) {
        const startsPhrase = highlightPhrases.some((phrase) => {
          const phraseWords = phrase.trim().split(" ");
          return (
            words.slice(end, end + phraseWords.length).join(" ") ===
            phrase.trim()
          );
        });
        if (startsPhrase) break;
        end++;
        count++;
      }
      if (end > i) {
        result.push({
          text: words.slice(i, end).join(" "),
          isHighlighted: false,
        });
        i = end;
      }
    }
  }
  return result;
};

const FallingText = ({
  text = "",
  highlightPhrases = [],
  trigger = "scroll",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
  triggerThreshold = 1.8, // 👈 nuevo prop
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const rootsRef = useRef([]);
  const containersRef = useRef([]);
  const effectStartedRef = useRef(false);
  const startPhysicsRef = useRef(null);
  const cleanupPhysicsRef = useRef(null);

  const { scrollY } = useScroll();

  // ── Render del texto respetando \n ──
  useEffect(() => {
    if (!textRef.current) return;

    rootsRef.current.forEach((root) => setTimeout(() => root.unmount(), 0));
    rootsRef.current = [];
    containersRef.current = [];
    textRef.current.innerHTML = "";

    const CHUNK_SIZE = 4;
    const lines = text.split("\n");
    let highlightOrder = 0;

    lines.forEach((line, lineIdx) => {
      const chunks = chunkLine(line, highlightPhrases, CHUNK_SIZE);

      chunks.forEach((chunk, chunkIdx) => {
        const cascadeDelay = chunk.isHighlighted ? highlightOrder * 1250 : 0;
        if (chunk.isHighlighted) highlightOrder++;

        const container = document.createElement("span");
        container.className = "inline-block mx-[2px]";
        textRef.current.appendChild(container);

        // Espacio entre chunks de la misma línea
        if (chunkIdx < chunks.length - 1) {
          textRef.current.appendChild(document.createTextNode(" "));
        }

        const root = createRoot(container);
        root.render(
          <WordSpan
            word={chunk.text}
            isHighlighted={chunk.isHighlighted}
            index={cascadeDelay}
          />,
        );
        rootsRef.current.push(root);
        containersRef.current.push(container);
      });

      // <br> entre líneas — no después de la última
      if (lineIdx < lines.length - 1) {
        textRef.current.appendChild(document.createElement("br"));
      }
    });

    return () => {
      rootsRef.current.forEach((root) => setTimeout(() => root.unmount(), 0));
      rootsRef.current = [];
      containersRef.current = [];
    };
  }, [text, highlightPhrases]);

  const startPhysics = () => {
    if (effectStartedRef.current) return;
    effectStartedRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const {
          Engine,
          Render,
          World,
          Bodies,
          Runner,
          Mouse,
          MouseConstraint,
        } = Matter;

        const containerRect = containerRef.current.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;
        if (width <= 0 || height <= 0) return;

        const engine = Engine.create();
        engine.world.gravity.y = gravity;

        const render = Render.create({
          element: canvasContainerRef.current,
          engine,
          options: { width, height, background: backgroundColor, wireframes },
        });

        const boundaryOptions = {
          isStatic: true,
          render: { fillStyle: "transparent" },
        };
        const floor = Bodies.rectangle(
          width / 2,
          height + 25,
          width,
          50,
          boundaryOptions,
        );
        const leftWall = Bodies.rectangle(
          -25,
          height / 2,
          50,
          height,
          boundaryOptions,
        );
        const rightWall = Bodies.rectangle(
          width + 25,
          height / 2,
          50,
          height,
          boundaryOptions,
        );
        const ceiling = Bodies.rectangle(
          width / 2,
          -25,
          width,
          50,
          boundaryOptions,
        );

        const measurements = containersRef.current.map((container) => {
          const rect = container.getBoundingClientRect();
          return {
            container,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            w: rect.width,
            h: rect.height,
          };
        });

        const wordBodies = measurements.map(({ container, x, y, w, h }) => {
          const body = Bodies.rectangle(x, y, w, h, {
            render: { fillStyle: "transparent" },
            restitution: 0.8,
            frictionAir: 0.01,
            friction: 0.2,
          });
          Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 5,
            y: 0,
          });
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

          containerRef.current.appendChild(container);
          container.style.position = "absolute";
          container.style.fontSize = fontSize;
          container.style.margin = "0";
          container.style.left = `${x - w / 2}px`;
          container.style.top = `${y - h / 2}px`;
          container.style.transform = "none";
          container.style.pointerEvents = "none";

          return { container, body };
        });

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: mouseConstraintStiffness,
            render: { visible: false },
          },
        });
        render.mouse = mouse;
        mouse.element.removeEventListener("wheel", mouse.mousewheel);
        mouse.element.removeEventListener("touchstart", mouse.touchstart);
        mouse.element.removeEventListener("touchend", mouse.touchend);

        World.add(engine.world, [
          floor,
          leftWall,
          rightWall,
          ceiling,
          mouseConstraint,
          ...wordBodies.map((wb) => wb.body),
        ]);

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // ── Loop de posiciones ──
        let rafId;
        let isVisible = true;

        const updateLoop = () => {
          // Solo escribe al DOM si el componente está en el viewport
          // El engine de Matter sigue corriendo siempre (los bodies no se congelan),
          // pero evitamos el trabajo de layout/paint cuando no hay nadie mirando
          if (isVisible) {
            wordBodies.forEach(({ body, container }) => {
              const { x, y } = body.position;
              const w = container.offsetWidth;
              const h = container.offsetHeight;
              container.style.left = `${x - w / 2}px`;
              container.style.top = `${y - h / 2}px`;
              container.style.transform = `rotate(${body.angle}rad)`;
            });
          }
          rafId = requestAnimationFrame(updateLoop);
        };
        rafId = requestAnimationFrame(updateLoop);

        // ── IntersectionObserver: detecta visibilidad en el viewport ──
        // threshold: 0 → dispara en cuanto entra o sale cualquier píxel
        const observer = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
          },
          { threshold: 0 },
        );
        if (containerRef.current) observer.observe(containerRef.current);

        // ── Cleanup completo al desmontar ──
        cleanupPhysicsRef.current = () => {
          cancelAnimationFrame(rafId);
          observer.disconnect();
          Runner.stop(runner);
          Render.stop(render);
          render.canvas.remove();
          Engine.clear(engine);
          World.clear(engine.world);
        };
      });
    });
  };

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      cleanupPhysicsRef.current?.();
    };
  }, []);

  useEffect(() => {
    startPhysicsRef.current = startPhysics;
  });

  useEffect(() => {
    if (trigger !== "scroll") return;

    const unsubscribe = scrollY.on("change", () => {
      if (effectStartedRef.current) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom <= window.innerHeight * triggerThreshold) {
        startPhysicsRef.current?.();
      }
    });

    return () => unsubscribe();
  }, [trigger, scrollY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden text-center pt-8 px-50 bg-fondo"
      onClick={trigger === "click" ? startPhysics : undefined}
      onMouseEnter={trigger === "hover" ? startPhysics : undefined}
    >
      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
      <div
        ref={textRef}
        className="relative z-10 inline-block"
        style={{ fontSize, lineHeight: 1.4 }}
      />
    </div>
  );
};

export default FallingText;
