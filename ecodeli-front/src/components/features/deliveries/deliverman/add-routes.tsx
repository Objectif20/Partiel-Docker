"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { DeliverymanApi, RoutePostDto } from "@/api/deliveryman.api";
import { useTranslation } from 'react-i18next';

export const routeSchema = z
  .object({
    id: z.string(),
    from: z.string().min(1, "client.pages.office.deliveryman.addRoute.fromRequired"),
    to: z.string().min(1, "client.pages.office.deliveryman.addRoute.toRequired"),
    permanent: z.boolean(),
    coordinates: z.object({
      origin: z.tuple([z.number(), z.number()]),
      destination: z.tuple([z.number(), z.number()]),
    }),
    date: z.string().optional(),
    weekday: z.string().optional(),
    tolerate_radius: z.number().min(0, "client.pages.office.deliveryman.addRoute.radiusPositive"),
    comeback_today_or_tomorrow: z.union([z.literal("today"), z.literal("tomorrow"), z.literal("later")]),
  })
  .refine(
    (data) => {
      if (data.permanent) {
        return !!data.weekday;
      } else {
        return !!data.date;
      }
    },
    {
      message: "client.pages.office.deliveryman.addRoute.weekdayOrDateRequired",
      path: ["weekday"],
    }
  );

export type Route = z.infer<typeof routeSchema>;

interface AddRouteDialogProps {
  children: React.ReactNode;
  onAddRoute: (route: Route) => void;
}

export function AddRouteDialog({ children, onAddRoute }: AddRouteDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const form = useForm<Route>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      id: "",
      from: "",
      to: "",
      permanent: false,
      coordinates: {
        origin: [0, 0],
        destination: [0, 0],
      },
      tolerate_radius: 5,
      comeback_today_or_tomorrow: "tomorrow",
    },
  });

  const isPermanent = form.watch("permanent");

  async function onSubmit(data: Route) {
    const newRoute: RoutePostDto = {
      ...data,
      weekday: isPermanent ? String(weekdays.indexOf(data.weekday!)) : undefined,
    };

    try {
      const addedRoute = await DeliverymanApi.addDeliverymanRoute(newRoute);
      onAddRoute(addedRoute);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du trajet:", error);
    }
  }

  const weekdays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('client.pages.office.deliveryman.addRoute.title')}</DialogTitle>
          <DialogDescription>{t('client.pages.office.deliveryman.addRoute.description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.office.deliveryman.addRoute.from')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client.pages.office.deliveryman.addRoute.fromPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.office.deliveryman.addRoute.to')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client.pages.office.deliveryman.addRoute.toPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="permanent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('client.pages.office.deliveryman.addRoute.permanent')}</FormLabel>
                    <FormDescription>
                      {t('client.pages.office.deliveryman.addRoute.permanentDescription')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isPermanent ? (
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.office.deliveryman.addRoute.weekday')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('client.pages.office.deliveryman.addRoute.selectWeekday')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekdays.map((day, index) => (
                          <SelectItem key={index} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('client.pages.office.deliveryman.addRoute.date')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: fr })
                            ) : (
                              <span>{t('client.pages.office.deliveryman.addRoute.chooseDate')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString());
                          }}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="tolerate_radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client.pages.office.deliveryman.addRoute.tolerateRadius')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('client.pages.office.deliveryman.addRoute.tolerateRadiusDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comeback_today_or_tomorrow"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('client.pages.office.deliveryman.addRoute.return')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value ? field.value.toString() : "tomorrow"}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="today" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('client.pages.office.deliveryman.addRoute.returnToday')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tomorrow" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('client.pages.office.deliveryman.addRoute.returnTomorrow')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="later" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('client.pages.office.deliveryman.addRoute.returnLater')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {t('client.pages.office.deliveryman.addRoute.addRoute')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
