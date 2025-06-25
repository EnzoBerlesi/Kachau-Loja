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
      dragSpeed: 0.6, // Velocidade do arraste manual, não do autoplay
      created() {
        setLoaded(true);
      },
      mode: "snap",
      rubberband: false,
    },
    [
      // ✨ COMEÇO DA CORREÇÃO NO PLUGIN DO AUTOPLAY
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;

        // Função para iniciar o próximo timeout
        function startAutoPlay() {
          // 1. SEMPRE LIMPE O TIMEOUT ANTERIOR ANTES DE CRIAR UM NOVO
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 3000); // ✨ Ajuste este valor (em milissegundos) para a velocidade desejada (ex: 3000ms = 3 segundos)
        }

        // Funções para pausar o autoplay
        function stopAutoPlay() {
          clearTimeout(timeout);
        }

        // Eventos que interagem com o autoplay
        slider.on("created", startAutoPlay);
        slider.on("dragStarted", stopAutoPlay); // Pausa ao começar a arrastar
        slider.on("animationEnded", startAutoPlay); // Reinicia após a animação terminar
        slider.on("detailsChanged", startAutoPlay); // Garante que o autoplay é reiniciado em mudanças de detalhes (como navegação manual via botões)

        // Limpeza do timeout quando o componente é desmontado
        slider.on("destroyed", stopAutoPlay);
      },
      // ✨ FIM DA CORREÇÃO NO PLUGIN DO AUTOPLAY
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
        {[
          notepromo,
          tecladogamer,
          notebookfoda,
          MouseGamer,
          fonegamer,
        ].map((imageSrc, index) => (
          <div
            key={index}
            className="keen-slider__slide !min-w-full flex items-center justify-center bg-black"
          >
            <img
              src={imageSrc}
              alt={`Produto ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => {
              instanceRef.current?.prev();
              // ✨ Adicionei uma pausa/reinício do autoplay após clique nos botões
              // Isso é importante para que o autoplay não continue imediatamente após a interação manual
              // e para garantir que o timeout seja limpo e reiniciado corretamente.
              // Você pode chamar a função 'startAutoPlay' diretamente se a tiver no escopo
              // ou simular o evento 'detailsChanged' que já é escutado.
              // Uma forma simples é chamar 'instanceRef.current.emit("detailsChanged")'
              // se você quiser que o KeenSlider reinicie o autoplay por você.
              instanceRef.current?.emit("detailsChanged");
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-black/80 transition-colors"
            aria-label="Slide anterior"
          >
            ◀
          </button>
          <button
            onClick={() => {
              instanceRef.current?.next();
              // ✨ Mesmo para o botão "Próximo"
              instanceRef.current?.emit("detailsChanged");
            }}
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