import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSelector from "../language-selector";


const Footer01Page = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t("client.components.footer.a_propos"),
      links: [
        { title: t("client.components.footer.faq"), href: "/faq" },
        { title: t("client.components.footer.mentions_legales"), href: "/legal-notice" },
        { title: t("client.components.footer.notre_equipe"), href: "/our-teams" },
        { title: t("client.components.footer.securite"), href: "/security" },
        { title: t("client.components.footer.accessibilite"), href: "/accessibility" },
      ],
    },
    {
      title: t("client.components.footer.livraisons"),
      links: [
        { title: t("client.components.footer.devenir_livreur"), href: "/become-deliveryman" },
        { title: t("client.components.footer.trouver_des_livraisons"), href: "/deliveries" },
        { title: t("client.components.footer.suivre_mon_colis"), href: "/follow-packages" },
        { title: t("client.components.footer.faire_une_demande"), href: "/create-shipment" },
        { title: t("client.components.footer.solution_ecologique"), href: "/ecology" },
      ],
    },
    {
      title: t("client.components.footer.prestations"),
      links: [
        { title: t("client.components.footer.devenir_prestataire"), href: "/become-provider" },
        { title: t("client.components.footer.les_decouvrir"), href: "/services" },
      ],
    },
    {
      title: t("client.components.footer.nous_contacter"),
      links: [
        { title: t("client.components.footer.email"), href: "mailto:contact.ecodeli@gmail.com" },
        { title: t("client.components.footer.telephone"), href: "tel:+331234567890" },
        { title: t("client.components.footer.adresse"), href: "https://maps.google.com/?q=242+Rue+du+Faubourg+Saint-Antoine,+75012+Paris" },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <footer className="border-t">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10">
          <div className="col-span-full xl:col-span-2">
            <h4 className="text-2xl font-bold">
              {t("client.components.footer.ecodeli")}
            </h4>
            <p className="mt-4 text-muted-foreground">
              {t("client.components.footer.description")}
            </p>
            <div className="mt-6">
              <LanguageSelector mode="text" className="w-60" />
            </div>
          </div>

            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h6 className="font-semibold text-primary">{title}</h6>
                <ul className="mt-6 space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        to={href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-4 sm:px-6 lg:px-8">
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link to="/" target="_blank">
                {t("client.components.footer.ecodeli")}
              </Link>
              , {t("client.components.footer.tous_droits_reserves")}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer01Page;
