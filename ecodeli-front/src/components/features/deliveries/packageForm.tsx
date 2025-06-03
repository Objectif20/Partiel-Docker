import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/image-upload";
import { PlusCircle, Trash } from "lucide-react";
import { PackagesFormValues } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fileToBase64 } from "@/components/minimal-tiptap/utils";

const PackagesFormComponent = ({  }: { onFormSubmit: (data: PackagesFormValues) => void }) => {
  const { control, watch, setValue } = useFormContext<PackagesFormValues>();
  const packages = watch("packages") || [];

  const addPackage = () => {
    setValue("packages", [...packages, { name: "", weight: "", estimatedPrice: "", isFragile: false, volume: "", image: null }]);
  };

  const handleImageUpload = (index: number, files: File[]) => {
    Promise.all(files.map((file) => fileToBase64(file))).then((base64Images) => {
      localStorage.setItem(`package-image-${index}`, JSON.stringify(base64Images));
      setValue(`packages.${index}.image`, base64Images);
    });
  };

  const deletePackage = (index: number) => {
    if (index > 0) {
      const updatedPackages = packages.filter((_, i) => i !== index);
      setValue("packages", updatedPackages);
      localStorage.removeItem(`package-image-${index}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">Détails des colis</div>
      {packages.map((_, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Colis {index + 1}</div>
            {index > 0 && (
              <Button type="button" variant="outline" className="text-red-500" onClick={() => deletePackage(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>

          <FormField
            control={control}
            name={`packages.${index}.image`}
            render={({  }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload index={index} onImagesChange={(files) => handleImageUpload(index, files)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`packages.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'objet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`packages.${index}.weight`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids de l'objet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez une tranche de poids" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">- 5kg</SelectItem>
                      <SelectItem value="30">Entre 5 kg et 30 kg</SelectItem>
                      <SelectItem value="50">Entre 31 kg et 50 kg</SelectItem>
                      <SelectItem value="100">Entre 51 kg et 100 kg</SelectItem>
                      <SelectItem value="101">Plus de 100 kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`packages.${index}.estimatedPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix estimé</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        className="peer ps-6 pe-12"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1000000"
                      />
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                        €
                      </span>
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                        EUR
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`packages.${index}.volume`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format du colis</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un format pour votre colis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Taille S</SelectItem>
                    <SelectItem value="2">Taille M</SelectItem>
                    <SelectItem value="3">Taille L</SelectItem>
                    <SelectItem value="4">Taille XL</SelectItem>
                    <SelectItem value="5">Taille XXL</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`packages.${index}.isFragile`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mt-10">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm">Votre objet est-il fragile ?</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button type="button" variant="outline" className="w-full" onClick={addPackage}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Ajouter un colis supplémentaire
      </Button>

      <FormField
        control={control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Informations complémentaires (optionnel)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PackagesFormComponent;
