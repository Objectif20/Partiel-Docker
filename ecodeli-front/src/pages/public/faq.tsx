import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

function FAQPage() {
  const { t } = useTranslation();

  const tabs = [
    { value: "delivery", label: t("client.pages.public.faq.tabs.delivery.title") },
    { value: "service", label: t("client.pages.public.faq.tabs.service.title") },
    { value: "subscription", label: t("client.pages.public.faq.tabs.subscription.title") },
    { value: "security", label: t("client.pages.public.faq.tabs.security.title") },
  ];

  const faqItems = {
    delivery: [
      { id: "1", title: t("client.pages.public.faq.tabs.delivery.q1.title"), content: t("client.pages.public.faq.tabs.delivery.q1.content") },
      { id: "2", title: t("client.pages.public.faq.tabs.delivery.q2.title"), content: t("client.pages.public.faq.tabs.delivery.q2.content") },
      { id: "3", title: t("client.pages.public.faq.tabs.delivery.q3.title"), content: t("client.pages.public.faq.tabs.delivery.q3.content") },
      { id: "4", title: t("client.pages.public.faq.tabs.delivery.q4.title"), content: t("client.pages.public.faq.tabs.delivery.q4.content") },
      { id: "5", title: t("client.pages.public.faq.tabs.delivery.q5.title"), content: t("client.pages.public.faq.tabs.delivery.q5.content") },
    ],
    service: [
      { id: "1", title: t("client.pages.public.faq.tabs.service.q1.title"), content: t("client.pages.public.faq.tabs.service.q1.content") },
      { id: "2", title: t("client.pages.public.faq.tabs.service.q2.title"), content: t("client.pages.public.faq.tabs.service.q2.content") },
      { id: "3", title: t("client.pages.public.faq.tabs.service.q3.title"), content: t("client.pages.public.faq.tabs.service.q3.content") },
      { id: "4", title: t("client.pages.public.faq.tabs.service.q4.title"), content: t("client.pages.public.faq.tabs.service.q4.content") },
      { id: "5", title: t("client.pages.public.faq.tabs.service.q5.title"), content: t("client.pages.public.faq.tabs.service.q5.content") },
    ],
    subscription: [
      { id: "1", title: t("client.pages.public.faq.tabs.subscription.q1.title"), content: t("client.pages.public.faq.tabs.subscription.q1.content") },
      { id: "2", title: t("client.pages.public.faq.tabs.subscription.q2.title"), content: t("client.pages.public.faq.tabs.subscription.q2.content") },
      { id: "3", title: t("client.pages.public.faq.tabs.subscription.q3.title"), content: t("client.pages.public.faq.tabs.subscription.q3.content") },
      { id: "4", title: t("client.pages.public.faq.tabs.subscription.q4.title"), content: t("client.pages.public.faq.tabs.subscription.q4.content") },
      { id: "5", title: t("client.pages.public.faq.tabs.subscription.q5.title"), content: t("client.pages.public.faq.tabs.subscription.q5.content") },
    ],
    security: [
      { id: "1", title: t("client.pages.public.faq.tabs.security.q1.title"), content: t("client.pages.public.faq.tabs.security.q1.content") },
      { id: "2", title: t("client.pages.public.faq.tabs.security.q2.title"), content: t("client.pages.public.faq.tabs.security.q2.content") },
      { id: "3", title: t("client.pages.public.faq.tabs.security.q3.title"), content: t("client.pages.public.faq.tabs.security.q3.content") },
      { id: "4", title: t("client.pages.public.faq.tabs.security.q4.title"), content: t("client.pages.public.faq.tabs.security.q4.content") },
      { id: "5", title: t("client.pages.public.faq.tabs.security.q5.title"), content: t("client.pages.public.faq.tabs.security.q5.content") },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 mb-16 px-4 sm:px-0">
      <h1 className="text-4xl font-bold text-center">
        {t("client.pages.public.faq.titre")}
      </h1>
      <Tabs defaultValue="delivery" className="w-full max-w-3xl sm:max-w-xl">
        <TabsList className="gap-1 bg-transparent justify-center w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Accordion type="single" collapsible className="w-full px-4">
              {faqItems[tab.value as keyof typeof faqItems].map((item) => (
                <AccordionItem value={item.id} key={item.id} className="py-2">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex flex-1 items-center gap-3 py-2 text-left text-[15px] font-semibold leading-6 transition-all [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&>svg]:-order-1 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
                      {item.title}
                      <Plus
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 opacity-60 transition-transform duration-200"
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="pb-2 ps-7 text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default FAQPage;
