import Header from "./components/Header";
import Hero from "./components/Hero";
import ScrollText from "./components/ScrollText";
import Scroll from "./components/scrollUse";
import Carta from "./components/Carta";
import ParallaxZoom from "./components/ParallaxZoom";
import { FooterE } from "./components/Footer";

import { useEffect } from "react";
import Lenis from "lenis";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2, // qué tan "largo" se siente el scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease out expo
      smoothWheel: true, // suaviza rueda del mouse
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup: destruye lenis y cancela el loop al desmontar
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="">
        <div className="overflow-hidden">
          {/* <Header />*/}
          <Hero />
          <ScrollText />
          <Carta />
        </div>
          <ParallaxZoom />
      </div>
      <FooterE />
    </>
  );
}

export default App;
