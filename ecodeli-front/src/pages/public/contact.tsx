import image from "@/assets/illustrations/deliveryPerson.svg";
import {DisplaySVG}  from "@/utils/svg-display";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
    const { t } = useTranslation();

    const sections = [
        {
            image: image,
            title: t("client.pages.public.contact.sections.faq.title"),
            description: t("client.pages.public.contact.sections.faq.description"),
            buttonText: t("client.pages.public.contact.sections.faq.button"),
            buttonLink: "/faq",
        },
        {
            image: image,
            title: t("client.pages.public.contact.sections.userIssue.title"),
            description: t("client.pages.public.contact.sections.userIssue.description"),
        },
        {
            image: image,
            title: t("client.pages.public.contact.sections.bugReport.title"),
            description: t("client.pages.public.contact.sections.bugReport.description"),
            email: "contact.ecodeli@gmail.com",
        },
    ];

      const colorMapping = {
            'st0': '#FFFFFF',
            'st1': '#FFFFFF',
            'st2': '#FFFFFF',
        };

    return (
        <div className="flex flex-col items-center py-32 container">
            <h1 className="text-4xl font-bold text-center mb-8">
                {t("client.pages.public.contact.title")}
            </h1>
            <p className="text-lg text-center max-w-2xl mb-12">
                {t("client.pages.public.contact.description")}
            </p>

            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 w-full ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                        <DisplaySVG svgPath={section.image} colorMapping={colorMapping} />                    
                        <div className={`md:w-1/3 ${index % 2 === 0 ? "md:text-right mr-32" : "md:text-left ml-32"}`}>
                        <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                        <p className="mb-6">{section.description}</p>
                        {section.buttonText && (
                            <a
                                href={section.buttonLink}
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                {section.buttonText}
                            </a>
                        )}
                        {section.email && (
                            <a
                                href={`mailto:${section.email}`}
                                className="text-primary underline"
                            >
                                {section.email}
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactPage;
