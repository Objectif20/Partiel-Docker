"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IntroDisclosure } from "@/components/ui/intro-disclosure";
import { UserApi } from "@/api/user.api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
  language: string;
  iso_code: string;
  profile: string[];
  otp?: boolean | false;
  updgradablePlan?: boolean | false;
  planName?: string;
  validateProfile?: boolean | false;
}

const clientSteps = [
  {
    title: "Devenir Partenaire Livreur",
    short_description: "Commencez votre parcours en tant que partenaire livreur avec nous.",
    full_description:
      "Rejoignez notre équipe de partenaires livreurs et profitez d'horaires flexibles et d'une rémunération compétitive. Inscrivez-vous dès aujourd'hui et commencez à livrer en toute simplicité.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Devenir partenaire livreur",
    },
  },
  {
    title: "Compléter Votre Profil",
    short_description: "Remplissez votre profil avec les détails nécessaires.",
    full_description:
      "Assurez-vous que votre profil est complet avec des informations précises. Cela inclut vos coordonnées, les informations sur votre véhicule et vos disponibilités.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Compléter votre profil",
    },
    action: {
      label: "Mettre à Jour le Profil",
      href: "/profil/mettre-a-jour",
    },
  },
  {
    title: "Accepter les Demandes de Livraison",
    short_description: "Commencez à accepter les demandes de livraison dans votre zone.",
    full_description:
      "Une fois votre profil complet, vous pouvez commencer à accepter les demandes de livraison. Utilisez notre application pour voir les livraisons disponibles et accepter celles qui correspondent à votre emploi du temps.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Accepter les demandes de livraison",
    },
  },
  {
    title: "Récupérer le Colis",
    short_description: "Récupérez le colis à l'emplacement désigné.",
    full_description:
      "Utilisez l'application pour vous rendre au lieu de récupération. Assurez-vous d'avoir le bon colis et scannez-le avec l'application avant de partir.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Récupérer le colis",
    },
  },
  {
    title: "Livrer le Colis",
    short_description: "Livrez le colis au destinataire.",
    full_description:
      "Suivez les indications de l'application pour vous rendre au lieu de livraison. Assurez-vous que le colis est livré en toute sécurité et obtenez une signature ou une confirmation photo si nécessaire.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Livrer le colis",
    },
  },
  {
    title: "Finaliser la Livraison",
    short_description: "Marquez la livraison comme terminée dans l'application.",
    full_description:
      "Une fois le colis livré, marquez la livraison comme terminée dans l'application. Vous pouvez également laisser un retour sur votre expérience.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Finaliser la livraison",
    },
    action: {
      label: "Voir l'Historique des Livraisons",
      href: "/livraisons/historique",
    },
  },
];

const merchantSteps = [
  {
    title: "Créer une Demande de Livraison",
    short_description: "Créez des demandes de livraison pour vos produits.",
    full_description:
      "Utilisez notre plateforme pour créer des demandes de livraison pour vos produits. Spécifiez les détails de livraison et choisissez les options qui conviennent le mieux à vos besoins.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Créer une demande de livraison",
    },
  },
  {
    title: "Demander une Livraison Spéciale",
    short_description: "Faites des demandes de livraison spéciale comme le lâcher de chariot.",
    full_description:
      "Pour des besoins spécifiques, vous pouvez demander des livraisons spéciales comme le lâcher de chariot. Indiquez les détails spécifiques et nous nous occuperons du reste.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Demander une livraison spéciale",
    },
  },
  {
    title: "Suivre les Livraisons",
    short_description: "Suivez l'état de vos livraisons en temps réel.",
    full_description:
      "Utilisez notre application pour suivre l'état de vos livraisons en temps réel. Recevez des notifications à chaque étape du processus de livraison.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Suivre les livraisons",
    },
  },
  {
    title: "Gérer les Retours",
    short_description: "Gérez les retours de produits facilement.",
    full_description:
      "Notre plateforme vous permet de gérer les retours de produits de manière efficace. Suivez les retours et traitez-les rapidement pour assurer la satisfaction de vos clients.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Gérer les retours",
    },
  },
];

const providerSteps = [
  {
    title: "Publier des Services",
    short_description: "Publiez les services que vous proposez.",
    full_description:
      "Utilisez notre plateforme pour publier les services que vous proposez. Décrivez vos services en détail pour attirer plus de clients.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Publier des services",
    },
  },
  {
    title: "Définir les Plannings",
    short_description: "Définissez vos horaires de disponibilité.",
    full_description:
      "Indiquez vos horaires de disponibilité pour que les clients puissent réserver vos services aux moments qui vous conviennent le mieux.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Définir les plannings",
    },
  },
  {
    title: "Discuter avec les Clients",
    short_description: "Communiquez avec vos clients via notre plateforme.",
    full_description:
      "Utilisez notre système de messagerie intégré pour discuter avec vos clients, répondre à leurs questions et confirmer les détails des services.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Discuter avec les clients",
    },
  },
  {
    title: "Gérer les Réservations",
    short_description: "Gérez les réservations de vos services.",
    full_description:
      "Consultez et gérez les réservations de vos services directement depuis notre plateforme. Acceptez ou refusez les réservations en fonction de votre disponibilité.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Gérer les réservations",
    },
  },
];

export function IntroDisclosureDemo() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const checkFirstLogin = async () => {
      try {
        const isFirstLogin = await UserApi.isFirstLogin();
        setOpen(!isFirstLogin);
      } catch (error) {
        console.error("Erreur lors du check first login", error);
      }
    };

    checkFirstLogin();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSteps = () => {
    if (user?.profile.includes("MERCHANT")) {
      return merchantSteps;
    } else if (user?.profile.includes("PROVIDER")) {
      return providerSteps;
    } else {
      return clientSteps;
    }
  };

  return (
    <div>
      {open && (
        <IntroDisclosure
          open={open}
          setOpen={setOpen}
          steps={getSteps()}
          featureId={isMobile ? "intro-demo-mobile" : "intro-demo"}
          onSkip={() => toast.info("Tour skipped")}
          forceVariant={isMobile ? "mobile" : undefined}
        />
      )}
    </div>
  );
}
