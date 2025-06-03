import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mockup } from "@/components/ui/mockup"
import { Glow } from "@/components/ui/glow"

interface HeroWithMockupProps {
  title: string
  description: string
  primaryCta?: {
    text: string
    href: string
  }
  mockupImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  additionalImage?: {
    src: string
    alt: string
  }
  className?: string
}

export function Hero({
  title,
  description,
  primaryCta = {
    text: "Get Started",
    href: "/get-started",
  },
  mockupImage,
  additionalImage,
  className,
}: HeroWithMockupProps) {
  return (
    <section
      className={cn(
        "relative py-4 px-4 md:py-8 lg:py-12",
        "overflow-hidden",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[900px] flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="relative flex flex-col items-center lg:items-start gap-4 text-center lg:text-left w-full lg:w-1/2">
          {/* Heading */}
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl",
              "leading-[1.1] sm:leading-[1.1]",
            )}
          >
            {title}
          </h1>

          {/* Description */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p
              className={cn(
                "max-w-[550px]",
                "text-base sm:text-lg md:text-xl",
                "font-medium",
              )}
            >
              {description}
            </p>

            {/* Primary CTA */}
            <div
              className="relative flex justify-center lg:justify-start gap-4"
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  "shadow-lg",
                  "transition-all duration-300",
                )}
              >
                <a href={primaryCta.href}>{primaryCta.text}</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative w-full lg:w-1/2 hidden lg:block pt-8 px-4 sm:px-6 lg:px-8">
          <Mockup
            className={cn(
              "max-w-[80%] mx-auto" // Réduit la taille de l'image
            )}
          >
            <img
              {...mockupImage}
              className="w-full h-auto"
              loading="lazy"
              decoding="async"
            />
          </Mockup>
        </div>
      </div>

      {/* Additional Image */}
      {additionalImage && (
        <div className="relative w-full pt-8 px-4 sm:px-6 lg:px-8 flex justify-center">
          <img
            src={additionalImage.src}
            alt={additionalImage.alt}
            className="w-full h-auto lg:max-w-[70%]" // 100% de la largeur sur mobile
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow
          variant="above"
        />
      </div>
    </section>
  )
}
