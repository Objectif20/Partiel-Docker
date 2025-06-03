import { Link, Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PublicLayout() {
  return (
    <div className="flex flex-col">
      <div className="flex-grow">
      <BannerGame />
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export function PublicNavbar() {
  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <BannerGame />
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export function BannerGame() {

    const { t } = useTranslation();
    return (
        <div className="dark bg-muted text-foreground px-4 py-3 mb-4">
            <p className="flex flex-col items-center text-sm sm:flex-row sm:justify-center">
                <a href="#" className="group">
                    <span className="me-1 text-base leading-none">✨</span>
                    {t('client.components.navbar.game')}
                </a>
                <Link
                    to="/game"
                    className="font-medium underline hover:no-underline mt-2 sm:mt-0 sm:ms-2"
                >
                    {t('client.components.navbar.gameLink')}
                    <ArrowRightIcon
                        className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
                        size={16}
                        aria-hidden="true"
                    />
                </Link>
            </p>
        </div>
    );
}
