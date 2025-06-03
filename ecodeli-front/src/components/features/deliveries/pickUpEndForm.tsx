import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PickUpEndFormValues } from "./types";

export const PickupEndFormComponent = ({  }: { onFormSubmit: (data: PickUpEndFormValues) => void }) => {
  const { control, watch  } = useFormContext<PickUpEndFormValues>();
  const arrivalHandling = watch("arrival_handling");


  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">Où vos colis doivent-ils arriver ?</div>

      <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez le nom de la ville" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez le nom de la ville" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

            <div className="space-y-4">
              <FormField
                control={control}
                name="arrival_handling"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Manutention nécessaire</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Avez-vous besoin d'aide pour la manutention des colis ?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
      
              {arrivalHandling && (
                <div className="space-y-4 rounded-lg border p-4 animate-in fade-in-50">
                  <FormField
                    control={control}
                    name="floor_arrival_handling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Étage</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString() || "0"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez l'étage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Rez-de-chaussée</SelectItem>
                            <SelectItem value="1">1er étage</SelectItem>
                            <SelectItem value="2">2ème étage</SelectItem>
                            <SelectItem value="3">3ème étage</SelectItem>
                            <SelectItem value="4">4ème étage</SelectItem>
                            <SelectItem value="5">5ème étage</SelectItem>
                            <SelectItem value="6">6ème étage</SelectItem>
                            <SelectItem value="7">7ème étage ou plus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
      
                  <FormField
                    control={control}
                    name="elevator_arrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Ascenseur disponible</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Y a-t-il un ascenseur dans le bâtiment ?
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
    </div>
  );
};
