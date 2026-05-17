import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import UnderlinedText from "../utils/CrayonUnderline";

export default function ParallaxComponent() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale7 = useTransform(scrollYProgress, [0, 1], [1, 7]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  const opacityText = useTransform(scrollYProgress, [0.65, 1], [0, 1]);
  const opacityText2 = useTransform(scrollYProgress, [0.45, 0.5, 1], [0, 1, 0]);

  // ✅ strings directamente — Motion los interpola solo
  const blur5 = useTransform(
    scrollYProgress,
    [0.4, 1],
    ["blur(0px)", "blur(10px)"],
  );
  const blur6 = useTransform(
    scrollYProgress,
    [0.4, 1],
    ["blur(0px)", "blur(10px)"],
  );
  const blur7 = useTransform(
    scrollYProgress,
    [0.4, 1],
    ["blur(0px)", "blur(10px)"],
  );
  const blur8 = useTransform(
    scrollYProgress,
    [0.4, 1],
    ["blur(0px)", "blur(10px)"],
  );
  const blur9 = useTransform(
    scrollYProgress,
    [0.4, 1],
    ["blur(0px)", "blur(12px)"],
  );

  const images = [
    {
      src: "/imgs/us4k2.webp",
      scale: scale4,
      width: "45vw",
      height: "55vh",
      top: "0vh",
      left: "0vw",
      zIndex: 3,
      opacity: opacity,
      filter: "blur(0px)", // ✅ central sin blur, string fijo
    },
    {
      src: "/imgs/foto15.webp",
      scale: scale5,
      width: "20vw",
      height: "65vh",
      top: "-20vh",
      left: "-35vw",
      zIndex: 4,
      opacity: 1,
      filter: blur5,
    },
    {
      src: "/imgs/foto9.webp",
      scale: scale6,
      width: "35vw",
      height: "55vh",
      top: "50vh",
      left: "-20vw",
      zIndex: 4,
      opacity: 1,
      filter: blur6,
    },
    {
      src: "/imgs/foto11.webp",
      scale: scale7,
      width: "25vw",
      height: "60vh",
      top: "-5vh",
      left: "35vw",
      zIndex: 4,
      opacity: 1,
      filter: blur7,
    },
    {
      src: "/imgs/foto14.webp",
      scale: scale8,
      width: "35vw",
      height: "35vh",
      top: "-37.5vh",
      left: "-5vw",
      zIndex: 4,
      opacity: 1,
      filter: blur8,
    },
    {
      src: "/imgs/foto13.webp",
      scale: scale9,
      width: "12vw",
      height: "45vh",
      top: "30.5vh",
      left: "10.5vw",
      zIndex: 4,
      opacity: 1,
      filter: blur9,
    },
  ];

  return (
    <div ref={container} className="relative mt-[50vh] bg-fondo">
      <div className="h-[1000vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {images.map((img, index) => (
            <motion.div
              key={index}
              style={{ scale: img.scale, zIndex: img.zIndex }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.img
                src={img.src}
                alt={`Foto ${index + 1}`}
                className="absolute object-cover shadow-aceternity rounded-sm"
                style={{
                  width: img.width,
                  height: img.height,
                  top: `calc(50% + ${img.top})`,
                  left: `calc(50% + ${img.left})`,
                  transform: "translate(-50%, -50%)",
                  opacity: img.opacity,
                  filter: img.filter,
                }}
              />
            </motion.div>
          ))}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              style={{ opacity: opacityText2 }}
              className="absolute text-[5.5rem] font-bold text-card flex items-center justify-center text-center z-10 pt-50"
            >
              <UnderlinedText color="#B85C38" duration={2000} thickness={6}>
                <p>One Year Page !!</p>
              </UnderlinedText>
            </motion.div>

            <motion.div
              style={{ opacity: opacityText }}
              className="absolute text-[7rem] font-bold text-texto flex items-center justify-center text-center"
            >
              <p>
                Eres el amor de mi vida <br /> ;)
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
