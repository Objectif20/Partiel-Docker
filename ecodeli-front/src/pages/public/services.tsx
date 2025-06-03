import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Clock } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslation } from 'react-i18next';
import { Service, ServiceApi } from "@/api/service.api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TakeAppointment from "@/components/public/services/planning";
export default function ServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 3;
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ search: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);
  const isClient = user?.profile.includes('CLIENT');

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ServiceApi.getServices(currentPage, servicesPerPage, searchCriteria.search, searchCriteria.city);
      setServices(response.data);
      setTotalPages(Math.ceil(response.total / servicesPerPage));
      setSelectedService(response.data[0] || null);
    } catch (err) {
      setError('Erreur lors du chargement des services.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchCriteria({ search: searchInput, city: cityInput });
    fetchServices();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t('client.pages.public.services.title', { count: services.length })}
        </h1>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('client.pages.public.services.searchPlaceholder')}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
            <Input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder={t('client.pages.public.services.locationPlaceholder')}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            {t('client.pages.public.services.searchButton')}
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-medium">{t('client.pages.public.services.filterBy')}</p>
          <Button variant="outline" size="sm" className="text-xs">
            {t('client.pages.public.services.recent')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="pr-4 space-y-4">
                {services.map((service) => (
                  <Card
                    key={service.service_id}
                    className={`overflow-hidden cursor-pointer transition-all coucou ${
                      selectedService?.service_id === service?.service_id
                        ? 'border-primary'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="relative h-40 w-full">
                      <img
                        src={service?.images?.[0] || '/placeholder.svg'}
                        alt={service?.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium flex items-center bg-white shadow">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {service?.rate}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{service?.name}</h3>
                          <p className="text-sm flex items-center">
                            <MapPin className="w-3 h-3 mr-1" /> {service?.city}
                          </p>
                        </div>
                        <p className="font-bold text-lg">{service?.price}€</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {service?.keywords?.map((keyword, index) => (
                          <Badge key={index}>{keyword}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          <Pagination className="mt-4">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedService ? (
              <div className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedService?.name}</h2>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {selectedService?.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{selectedService?.rate}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{selectedService?.duration_time} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedService?.keywords?.map((keyword, index) => (
                      <Badge key={index}>
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow overflow-auto">
                  <div className="mb-6 flex items-center gap-4 pb-4 border-b">
                    <Avatar className="h-16 w-16 border-2">
                      <AvatarImage src={selectedService?.author?.photo} />
                      <AvatarFallback>{selectedService?.author?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {t('client.pages.public.services.proposedBy', { name: selectedService?.author?.name })}
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{selectedService?.rate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">{t('client.pages.public.services.description')}</h3>
                    <p className="text-gray-700">{selectedService?.description}</p>
                    <div className="mt-4 p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{t('client.pages.public.services.price')}</p>
                        <p className="font-bold text-xl">{selectedService?.price_admin || selectedService?.price}€</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-4">
                      {t('client.pages.public.services.customerReviews')}
                    </h3>
                    <div className="space-y-4">
                      {(selectedService?.comments?.flat() || []).map((comment) => (
                        <div key={comment?.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment?.author?.photo} />
                              <AvatarFallback>{comment?.author?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{comment?.author?.name}</p>
                              <p className="">{comment?.content}</p>
                            </div>
                          </div>

                          {comment?.response && (
                            <div className="ml-12 mt-3 pt-3 border-t">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment?.response?.author?.photo} />
                                  <AvatarFallback>{comment?.response?.author?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-sm">{comment?.response?.author?.name}</p>
                                  <p className="text-sm">{comment?.response?.content}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                  {isClient && (
                <TakeAppointment duration={60} service_id={selectedService.service_id}/>
                  )}

                <CardFooter className="border-t pt-4">
                </CardFooter>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <p className="mb-4">{t('client.pages.public.services.selectService')}</p>
                  <p className="text-sm">
                    {t('client.pages.public.services.selectServiceDescription')}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Drawer>
        <DrawerTrigger asChild>
          <Button className="lg:hidden fixed bottom-4 right-4 text-white">
            {t('client.pages.public.services.viewDetails')}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="mx-4">
            <DrawerTitle>{selectedService?.name}</DrawerTitle>
            <DrawerDescription>{t('client.pages.public.services.serviceDetails')}</DrawerDescription>
            <div className="flex items-center justify-end mb-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-medium">{selectedService?.rate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-3 h-3 mr-1" />
              <span>{selectedService?.duration_time} min</span>
            </div>
          </DrawerHeader>
          <div className="mx-4">
            <div className="mb-6 flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-16 w-16 border-2">
                <AvatarImage src={selectedService?.author?.photo} />
                <AvatarFallback>{selectedService?.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {t('client.pages.public.services.proposedBy', { name: selectedService?.author?.name })}
                </h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{selectedService?.rate}</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{t('client.pages.public.services.description')}</h3>
              <p className="">{selectedService?.description}</p>
              <div className="mt-4 p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{t('client.pages.public.services.price')}</p>
                  <p className="font-bold text-xl">{selectedService?.price_admin || selectedService?.price}€</p>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
            {isClient && (
                <TakeAppointment duration={60} service_id={selectedService?.service_id || ""}/>
              )}
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
