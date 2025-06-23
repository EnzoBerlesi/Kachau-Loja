import  { useEffect, useState } from "react"; // Adicione useState aqui
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
    <div className="relative w-full max-w-[900px] mx-auto h-[300px] md:h-[400px]"> {/* Container principal com altura fixa */}
  {/* Slider (cobre 100% do container pai) */}
  <div
    ref={sliderRef}
    className="keen-slider w-full h-full rounded-lg"
  >
    {[1, 2, 3, 4, 5, 6].map((num) => (
<div key={num} className="keen-slider__slide !min-w-full flex items-center justify-center rounded-lg">
  <img
    src={`/assets/promo${num}.png`}
    alt={`Promoção ${num}`}
    className="max-w-[90%] max-h-[90%] object-contain mx-auto" // Imagem nunca ultrapassa 90% do slide
  />
</div>
    ))}
  </div>

  {/* Botões (agora ficam POR CIMA da imagem) */}
  <button
    onClick={() => instanceRef.current?.prev()}
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/80"
  >
    ◀
  </button>
  <button
    onClick={() => instanceRef.current?.next()}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/80"
  >
    ▶
  </button>
</div>
  );
};

export default Carousel;