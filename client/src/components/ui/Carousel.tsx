import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import type { KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";

// ✨ IMPORTAÇÕES DAS SUAS IMAGENS LOCAIS
import notepromo from "/assets/carrossel/notepromo.png";
import tecladogamer from "/assets/carrossel/tecladogamer.jpg";
import notebookfoda from "/assets/carrossel/notebookfoda.jpg";
import MouseGamer from "/assets/carrossel/MouseGamer.jpg";
import fonegamer from "/assets/carrossel/fonegamer.jpg";

const Carousel = () => {
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      dragSpeed: 0.6,
      created() {
        setLoaded(true);
      },
      mode: "snap",
      rubberband: false,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        function nextTimeout() {
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on("created", nextTimeout);
        slider.on("dragStarted", () => clearTimeout(timeout));
        slider.on("animationEnded", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    const handleResize = () => instanceRef.current?.update();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [instanceRef]);

  return (
    <div className="relative w-full max-w-[900px] mx-auto aspect-video h-[300px] md:h-[400px]">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-full rounded-lg overflow-hidden"
      >
        {/* ✨ UTILIZANDO AS IMAGENS IMPORTADAS */}
        {[
          notepromo, // Imagem de teste 1
          tecladogamer, // Imagem de teste 2
          notebookfoda, // Repetindo para ter 6 slides
          MouseGamer,
          fonegamer,
        ].map((imageSrc, index) => (
          <div
            key={index}
            className="keen-slider__slide !min-w-full flex items-center justify-center bg-black"
          >
            <img
              src={imageSrc} // Agora 'imageSrc' já é a URL correta após a importação
              alt={`Produto ${index + 1}`}
              className="w-full h-full object-cover" // Voltamos para object-cover
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/80 transition-colors"
            aria-label="Slide anterior"
          >
            ◀
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/80 transition-colors"
            aria-label="Próximo slide"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;