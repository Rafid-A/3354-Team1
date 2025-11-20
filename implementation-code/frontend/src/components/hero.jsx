import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { heroContent } from "@/lib/data";

const Hero = () => {
  const navigate = useNavigate();

  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const handleButtonClick = (id) => {
    navigate(`#`);
  };

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-5xl flex items-center justify-between px-4">
        <Carousel
          className="w-full bg-slate-100 rounded-lg shadow-sm"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {heroContent.map((product) => (
              <CarouselItem key={product.id} className="px-10 md:px-20 py-10">
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between">
                  <div className="flex flex-col max-w-xl h-40 justify-between">
                    <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl text-slate-700">
                      {product.product} - {product.tagline}
                    </h1>

                    <Button
                      onClick={() => handleButtonClick(product.id)}
                      className="w-32 h-12 rounded-xl hover:cursor-pointer text-xl"
                    >
                      {product.cta}
                    </Button>
                  </div>

                  <div>
                    <img className="w-full h-60 object-contain" src={product.imageUrl} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
