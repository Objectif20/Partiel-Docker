import { Hero } from "@/components/public/landing/hero";
import deliveriesScreen from '@/assets/screen/deliveries.png'
import deliveryPerson from "@/assets/illustrations/deliveryPerson.svg"
import { useTranslation } from "react-i18next";
import { TestimonialsSection } from "@/components/public/landing/testimonials";
import Tutoriel from "@/components/public/landing/tuto";
import Faq from "@/components/public/landing/faq";


export default function LandingPage() {


        const { t } = useTranslation();

        const testimonials = [
            {
              author: {
                name: "Emma Thompson",
                handle: "@emmaai",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
              },
              text: t("client.pages.public.landing.testimonials.avis.message1"),
            },
            {
              author: {
                name: "David Park",
                handle: "@davidtech",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              },
              text: t("client.pages.public.landing.testimonials.avis.message2"),
            },
            {
              author: {
                name: "Sofia Rodriguez",
                handle: "@sofiaml",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
              },
              text: t("client.pages.public.landing.testimonials.avis.message3"),
            }
          ]

        return (
            <>
                <Hero
                    title={t("client.pages.public.landing.titre")}
                    description={t("client.pages.public.landing.description")}
                    primaryCta={{
                        text: t("client.pages.public.landing.bouton-action"),
                        href: "/deliveries",
                    }}
                    mockupImage={{
                        alt: "AI Platform Dashboard",
                        width: 500,
                        height: 500,
                        src: deliveryPerson,
                    }}
                    additionalImage={{
                        alt: "AI Platform Dashboard",
                        src: deliveriesScreen
                    }}
                />
                <Tutoriel />

                <TestimonialsSection
                    title={t("client.pages.public.landing.testimonials.titre")}
                    description={t("client.pages.public.landing.testimonials.description")}
                    testimonials={testimonials}
                    />

                <Faq />
            
            
            </>
        )


}
