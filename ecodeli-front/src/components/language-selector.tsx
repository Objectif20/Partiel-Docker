"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { RegisterApi } from "@/api/register.api"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { updateLang } from "@/redux/slices/userSlice"
import { UserApi } from "@/api/user.api"

interface Language {
  language_id: string
  language_name: string
  iso_code: string
  active: boolean
}

interface LanguageSelectorProps {
  mode: "text" | "flag" | "sidebar"
  className?: string
}

export default function LanguageSelector({ mode = "text", className }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fr")
  const { i18n } = useTranslation()
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await RegisterApi.getLanguage()
        const activeLanguages = response.filter((lang) => lang.active)
        setLanguages(activeLanguages)

        const storedLang = i18n.language;

        const matchedLang = activeLanguages.find((lang) => lang.iso_code === storedLang)

        const initialLang = matchedLang ? matchedLang.iso_code : "fr"

        setSelectedLanguage(initialLang)
        i18n.changeLanguage(initialLang)
      } catch (error) {
        console.error("Failed to fetch languages:", error)
      }
    }

    fetchLanguages()
  }, [user?.language])

  const getFlag = (isoCode: string) => {
    if (!isoCode || isoCode.length !== 2) return "🌐"
    const codePoints = Array.from(isoCode.toUpperCase()).map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const handleLanguageChange = async (isoCode: string) => {
    setSelectedLanguage(isoCode)
    dispatch(updateLang(isoCode))
    localStorage.setItem("i18nextLng", isoCode)
  
    const selectedLang = languages.find((lang) => lang.iso_code === isoCode)
  
    if (user && selectedLang) {
      try {
        await UserApi.updateLanguage(selectedLang.language_id)
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la langue sur le serveur :", error)
      }
    }
  
    i18n.changeLanguage(isoCode)
  }

  if (mode === "text") {
    return (
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={cn(className)}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{getFlag(selectedLanguage)}</span>
              <span>{languages.find((l) => l.iso_code === selectedLanguage)?.language_name || selectedLanguage}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.language_id} value={language.iso_code}>
              <div className="flex items-center gap-2">
                <span>{getFlag(language.iso_code)}</span>
                <span>{language.language_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{getFlag(selectedLanguage)}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choisir la langue</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.language_id}
            onClick={() => handleLanguageChange(language.iso_code)}
            className="flex cursor-pointer items-center gap-2"
          >
            <span>{getFlag(language.iso_code)}</span>
            <span>{language.language_name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
