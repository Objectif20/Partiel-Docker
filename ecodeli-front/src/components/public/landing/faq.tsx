import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Faq() {
    const { t } = useTranslation();
  const faqItems = [
    {
      id: "faq-1",
      question: t("client.pages.public.landing.FAQ.questions.question1.question"),
      answer: t("client.pages.public.landing.FAQ.questions.question1.reponse"),
    },
    {
      id: "faq-2",
      question: t("client.pages.public.landing.FAQ.questions.question2.question"),
      answer: t("client.pages.public.landing.FAQ.questions.question2.reponse"),
    },
    {
      id: "faq-3",
      question: t("client.pages.public.landing.FAQ.questions.question3.question"),
      answer: t("client.pages.public.landing.FAQ.questions.question3.reponse"),
    },
    {
      id: "faq-4",
      question: t("client.pages.public.landing.FAQ.questions.question4.question"),
      answer: t("client.pages.public.landing.FAQ.questions.question4.reponse"),
    },
    {
      id: "faq-5",
      question: t("client.pages.public.landing.FAQ.questions.question5.question"),
      answer: t("client.pages.public.landing.FAQ.questions.question5.reponse"),
    },
  ];

  const heading = t("client.pages.public.landing.FAQ.titre");
  const description = t("client.pages.public.landing.FAQ.description");
  const supportButtonText = t("client.pages.public.landing.FAQ.bouton");
  const supportButtonUrl = "/faq";

  return (
    <section className="py-32">
      <div className="container space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-3xl"
        >
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-lg p-4 text-center md:p-6 lg:p-8">
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button className="w-5/4 sm:w-auto" asChild>
              <Link to={supportButtonUrl} rel="noopener noreferrer">
                {supportButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
