import i18n, { InitOptions } from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import axiosInstance from "@/api/axiosInstance"

export const loadTranslations = async (lng: string) => {
  try {
    const [apiRes, fallbackRes] = await Promise.all([
      axiosInstance.get(`/client/languages/${lng}`).then((res) => res.data),
      fetch("/locales/fr.json").then((res) => res.json()),
    ])

    if (!apiRes || typeof apiRes !== "object") return fallbackRes

    const merged: Record<string, string> = { ...fallbackRes }

    for (const key in fallbackRes) {
      const apiValue = apiRes[key]

      merged[key] =
        typeof apiValue === "string" && apiValue.trim() !== ""
          ? apiValue
          : fallbackRes[key]
    }

    return merged
  } catch (error) {
    console.error("Erreur chargement des traductions :", error)
    return fetch("/locales/fr.json").then((res) => res.json())
  }
}

const options: InitOptions = {
  fallbackLng: "fr",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["querystring", "cookie", "localStorage", "navigator"],
    caches: ["localStorage", "cookie"],
    cookieOptions: {
      path: "/",
      sameSite: "strict",
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
  },
  resources: {},
  initImmediate: false,
}

i18n.use(LanguageDetector).use(initReactI18next).init(options)

i18n.on("languageChanged", async (lng) => {
  const translations = await loadTranslations(lng)
  i18n.addResourceBundle(lng, "translation", translations, true, true)
})

export default i18n
