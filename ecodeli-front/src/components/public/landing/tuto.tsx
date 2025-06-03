import React from 'react';
import notifSVG from '@/assets/illustrations/notif.svg';
import commandeSVG from '@/assets/illustrations/commande.svg';
import ReceiveSVG from '@/assets/illustrations/receive.svg';
import { useTranslation } from 'react-i18next';


interface SquareProps {
  title: string;
  imageUrl: string;
}

const Square: React.FC<SquareProps> = ({ title, imageUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center w-72 h-80 bg-secondary p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <img src={imageUrl} alt={title} className="w-40 h-40 object-cover mt-8" />
    </div>
  );
};

const Tutoriel: React.FC = () => {

    const {t } = useTranslation();


  const squares = [
    { title: t("client.pages.public.landing.tuto.titre1"), imageUrl: commandeSVG },
    { title: t("client.pages.public.landing.tuto.titre2"), imageUrl: notifSVG },
    { title: t("client.pages.public.landing.tuto.titre3"), imageUrl: ReceiveSVG },
  ];

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8 w-full text-center">{t("client.pages.public.landing.tuto.titre")}</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {squares.map((square, index) => (
          <Square key={index} title={square.title} imageUrl={square.imageUrl} />
        ))}
      </div>
    </div>
  );
};

export default Tutoriel;
