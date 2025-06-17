import React, { useEffect, useState } from "react"; // Adicione useState aqui
import { useKeenSlider } from "keen-slider/react";
import type { KeenSliderInstance } from "keen-slider"; // Importação type-only
import "keen-slider/keen-slider.min.css";

// Plugin de animação personalizada
const Carousel = () => {
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
      created() {
        setLoaded(true); // Marca como carregado
      },
    },
    [
      // Plugin de autoplay (opcional)
      (slider) => {
        let timeout: NodeJS.Timeout;
        function nextTimeout() {
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        }
        slider.on("created", () => {
          nextTimeout();
        });
        slider.on("dragStarted", () => clearTimeout(timeout));
        slider.on("animationEnded", nextTimeout);
      },
    ]
  );

  // Resetar o slider quando a instância mudar
  useEffect(() => {
    instanceRef.current?.update();
  }, [instanceRef]);

  return (
    <div className="relative">
      {/* Overlay de loading (opcional) */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <p>Carregando...</p>
        </div>
      )}

      {/* Container do Slider */}
      <div
        ref={sliderRef}
        className={`keen-slider w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="keen-slider__slide">
            <img
              src={`/assets/promo${num}.png`}
              alt={`Promoção ${num}`}
              className="w-full h-full object-cover scale-100"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
      >
        ◀
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
      >
        ▶
      </button>
    </div>
  );
};

export default Carousel;