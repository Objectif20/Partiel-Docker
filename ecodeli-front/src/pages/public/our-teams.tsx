import { useTranslation } from "react-i18next";
import user1 from "@/assets/illustrations/remy.svg";
import user2 from "@/assets/illustrations/damien.svg";
import user3 from "@/assets/illustrations/quentin.svg";
import user4 from "@/assets/illustrations/frederic.svg";
import user5 from "@/assets/illustrations/kevin.svg";
import user6 from "@/assets/illustrations/christophe.svg";
import user7 from "@/assets/illustrations/maxime.svg";
import user8 from "@/assets/illustrations/john.svg";
import user9 from "@/assets/illustrations/gregoire.svg";
import user10 from "@/assets/illustrations/alice.svg";

const TeamPage = () => {
  const { t } = useTranslation();

  const teamMembers = [
    { id: 1, name: t("client.pages.public.teams.remy_thibaut"), role: t("client.pages.public.teams.developer"), image: user1 },
    { id: 2, name: t("client.pages.public.teams.damien_vaurette"), role: t("client.pages.public.teams.network_manager"), image: user2 },
    { id: 3, name: t("client.pages.public.teams.quentin_delneuf"), role: t("client.pages.public.teams.database_manager"), image: user3 },
    { id: 4, name: t("client.pages.public.teams.frederic_sananes"), role: t("client.pages.public.teams.pedagogical_director"), image: user4 },
    { id: 5, name: t("client.pages.public.teams.kevin_trancho"), role: t("client.pages.public.teams.accounting_expert"), image: user5 },
    { id: 6, name: t("client.pages.public.teams.christophe_delon"), role: t("client.pages.public.teams.mobile_specialist"), image: user6 },
    { id: 7, name: t("client.pages.public.teams.maxime_antoine"), role: t("client.pages.public.teams.api_referent"), image: user7 },
    { id: 8, name: t("client.pages.public.teams.john_doe"), role: t("client.pages.public.teams.sales"), image: user8 },
    { id: 9, name: t("client.pages.public.teams.gregoire_petit"), role: t("client.pages.public.teams.communication_manager"), image: user9 },
    { id: 10, name: t("client.pages.public.teams.alice_bob"), role: t("client.pages.public.teams.app_tester"), image: user10 },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("client.pages.public.teams.title")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className={`flex flex-col items-center bg-secondary p-6 border rounded-lg shadow-md h-full ${index >= 8 ? 'col-span-2 lg:col-span-1' : ''}`}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <div className="flex-grow flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold text-center">{member.name}</h2>
              <p className="text-center mt-2">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
