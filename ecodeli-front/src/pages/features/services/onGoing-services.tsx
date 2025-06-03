"use client"

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Calendar, Clock, Play, Square, User } from "lucide-react"
import { toast } from 'sonner';
import { FutureAppointmentProvider, ServiceApi } from "@/api/service.api"

export default function OnGoingServicesPage() {
  const dispatch = useDispatch()
  const [appointments, setAppointments] = useState<FutureAppointmentProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [otpCode, setOtpCode] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<FutureAppointmentProvider | null>(null)
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false)
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const limit = 6

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Mes prestations en cours"],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch])

  useEffect(() => {
    fetchAppointments()
  }, [currentPage])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await ServiceApi.getFutureAppointmentsProvider(currentPage, limit)
      setAppointments(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      toast.error("Impossible de charger les prestations en cours")
    } finally {
      setLoading(false)
    }
  }

  const handleStartAppointment = async () => {
    if (!selectedAppointment || !otpCode.trim()) {
      toast.error("Veuillez entrer le code OTP pour démarrer la prestation.")
      return
    }

    try {
      setActionLoading(true)
      await ServiceApi.startAppointment(selectedAppointment.id, otpCode)

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, status: "in_progress" } : apt)),
      )

      toast.success("La prestation a été démarrée avec succès")

      setIsStartDialogOpen(false)
      setOtpCode("")
      setSelectedAppointment(null)
    } catch (error) {
      toast.success("Impossible de démarrer la prestation")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEndAppointment = async () => {
    if (!selectedAppointment) return

    try {
      setActionLoading(true)
      await ServiceApi.endAppointment(selectedAppointment.id)

      setAppointments((prev) => prev.filter((apt) => apt.id !== selectedAppointment.id))

      toast.success("La prestation a été terminée avec succès")
      setIsEndDialogOpen(false)
      setSelectedAppointment(null)
    } catch (error) {
      toast.error("Impossible de terminer la prestation")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            En attente
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            En cours
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes prestations en cours</h1>
        <Badge variant="secondary" className="text-sm">
          {appointments.length} prestation{appointments.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {appointments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="mx-auto h-12 w-12  mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune prestation en cours</h3>
            <p>Vous n'avez actuellement aucune prestation programmée ou en cours.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={appointment.clientImage || undefined} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">{appointment.clientName}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium ">{appointment.serviceName}</h4>
                  </div>

                  <div className="space-y-2 text-sm ">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  {appointment.status === "pending" && (
                    <Dialog
                      open={isStartDialogOpen && selectedAppointment?.id === appointment.id}
                      onOpenChange={(open) => {
                        setIsStartDialogOpen(open)
                        if (open) {
                          setSelectedAppointment(appointment)
                        } else {
                          setSelectedAppointment(null)
                          setOtpCode("")
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Démarrer
                        </Button>
                      </DialogTrigger>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Démarrer la prestation</DialogTitle>
                            <DialogDescription>
                            Demandez le code OTP au client pour démarrer la prestation "{appointment.serviceName}".
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                            <Label htmlFor="otp">Code OTP</Label>
                            <InputOTP maxLength={6} value={otpCode} onChange={(value) => setOtpCode(value)}>
                                <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                            variant="outline"
                            onClick={() => {
                                setIsStartDialogOpen(false)
                                setOtpCode("")
                                setSelectedAppointment(null)
                            }}
                            >
                            Annuler
                            </Button>
                            <Button onClick={handleStartAppointment} disabled={actionLoading || !otpCode.trim()}>
                            {actionLoading ? "Démarrage..." : "Démarrer"}
                            </Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>
                  )}

                  {appointment.status === "in_progress" && (
                    <Dialog
                      open={isEndDialogOpen && selectedAppointment?.id === appointment.id}
                      onOpenChange={(open) => {
                        setIsEndDialogOpen(open)
                        if (open) {
                          setSelectedAppointment(appointment)
                        } else {
                          setSelectedAppointment(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full" size="sm">
                          <Square className="h-4 w-4 mr-2" />
                          Terminer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Terminer la prestation</DialogTitle>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir terminer la prestation "{appointment.serviceName}" avec{" "}
                            {appointment.clientName} ?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEndDialogOpen(false)
                              setSelectedAppointment(null)
                            }}
                          >
                            Annuler
                          </Button>
                          <Button variant="destructive" onClick={handleEndAppointment} disabled={actionLoading}>
                            {actionLoading ? "Finalisation..." : "Terminer"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}