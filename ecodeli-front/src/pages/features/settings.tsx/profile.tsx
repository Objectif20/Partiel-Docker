"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { MoreVertical, Camera, X } from "lucide-react"
import { setUser } from "@/redux/slices/userSlice"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import type { RootState } from "@/redux/store"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ProfileAPI } from "@/api/profile.api"
import { toast } from "sonner"

interface BlockedUser {
  id: string
  name: string
  avatar: string
}

const ProfileSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user)

  const isProvider = user?.profile.includes("PROVIDER")
  const isClient = user?.profile.includes("CLIENT")
  const isMerchant = user?.profile.includes("MERCHANT")
  const isDeliveryman = user?.profile.includes("DELIVERYMAN")

  const [profileImage, setProfileImage] = useState<string | null>(user?.photo || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("client.pages.office.settings.profile.home"),
          t("client.pages.office.settings.profile.settings"),
          t("client.pages.office.settings.profile.profile"),
        ],
        links: ["/office/dashboard"],
      })
    )

    const fetchBlockedUsers = async () => {
      try {
        const data = await ProfileAPI.getAllBlockedUsers()
        setProfileImage(data.photo || null)
        const formatted = data.blocked.map((u) => ({
          id: u.user_id,
          name: `${u.first_name} ${u.last_name}`,
          avatar: u.photo || "/placeholder.svg?height=40&width=40",
        }))
        setBlockedUsers(formatted)
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs bloqués", err)
      }
    }

    fetchBlockedUsers()
  }, [dispatch, t])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfileImage = async () => {
    if (selectedFile) {
      try {
        const response = await ProfileAPI.updateMyProfileImage(selectedFile)
        if (response.url) {
          dispatch(setUser({ ...user, photo: response.url }))
          setProfileImage(response.url)
        }
        toast.success(t("client.pages.office.settings.profile.profileImageUpdateSuccess"))
      } catch (error) {
        toast.error(t("client.pages.office.settings.profile.profileImageUpdateError"))
        console.error(error)
      }
    } else {
      toast.error(t("client.pages.office.settings.profile.profileImageSelectError"))
    }
  }

  const removeProfileImage = () => {
    setProfileImage(null)
    setSelectedFile(null)
  }

  const unblockUser = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== userId))
    ProfileAPI.unblockUser(userId)
      .then(() => {
        toast.success(t("client.pages.office.settings.profile.unblockUserSuccess"))
      })
      .catch(() => {
        toast.error(t("client.pages.office.settings.profile.unblockUserError"))
      })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t("client.pages.office.settings.profile.profile")}</h1>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t("client.pages.office.settings.profile.generalSettings")}</Link>
          <Link to="/office/profile" className="font-semibold text-primary active-link">
            {t("client.pages.office.settings.profile.profile")}
          </Link>
          <Link to="/office/privacy">{t("client.pages.office.settings.profile.privacy")}</Link>
          <Link to="/office/contact-details">{t("client.pages.office.settings.profile.contactDetails")}</Link>
          {(isMerchant || isClient) && <Link to="/office/subscriptions">{t("client.pages.office.settings.profile.subscriptions")}</Link>}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">{t("client.pages.office.settings.profile.billing")}</Link>}
          <Link to="/office/reports">{t("client.pages.office.settings.profile.reports")}</Link>
        </nav>

        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-medium mb-2">{t("client.pages.office.settings.profile.profile")}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t("client.pages.office.settings.profile.modifyProfile")}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background">
                  <AvatarImage src={profileImage || "/placeholder.svg?height=96&width=96"} alt={t("client.pages.office.settings.profile.profilePicture")} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>

                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {profileImage && (
                <Button variant="ghost" size="icon" onClick={removeProfileImage} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}

              <Button onClick={handleUpdateProfileImage}>
                {t("client.pages.office.settings.profile.updateProfileImage")}
              </Button>
            </div>

            {blockedUsers.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-lg font-medium mb-4">{t("client.pages.office.settings.profile.blockedUsers")}</h2>

                  <div className="space-y-4">
                    {blockedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => unblockUser(user.id)}>
                              {t("client.pages.office.settings.profile.unblockUser")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
