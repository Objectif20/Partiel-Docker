import { useEffect, useState } from 'react';
import AppRoutes from './routes/routes';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from './api/auth.api';
import { UserApi } from './api/user.api';
import { Spinner } from './components/ui/spinner';
import { AppDispatch, RootState } from './redux/store';
import OneSignalInit from './config/oneSignalInit';
import i18n, { loadTranslations } from './i18n';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const tokenResponse = await getAccessToken();

        if (tokenResponse?.accessToken) {
          await dispatch(UserApi.getUserData());
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'application", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const setupLanguage = async () => {
      const localLang = localStorage.getItem("i18nextLng");
      const userLang = localLang || user?.language || "fr";

      const translations = await loadTranslations(userLang);
      i18n.addResourceBundle(userLang, "translation", translations, true, true);

      if (i18n.language !== userLang) {
        await i18n.changeLanguage(userLang);
      }

      localStorage.setItem("i18nextLng", userLang);
      setI18nReady(true);
    };

    setupLanguage();
  }, [user]);

  if (!i18nReady || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <OneSignalInit />}
      <AppRoutes />
    </>
  );
}

export default App;
