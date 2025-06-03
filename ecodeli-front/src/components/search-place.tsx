import { useState, useEffect } from "react";
import axios from "axios";
import { AsyncSelect } from "@/components/ui/async-select";

// Types
interface City {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

interface CityAsyncSelectDemoProps {
  onCitySelect: (city: City) => void;
  labelValue?: string;
  placeholder?: string;
  className?: string;
}

function CityAsyncSelectDemo({ onCitySelect, labelValue, placeholder, className }: CityAsyncSelectDemoProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [_, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(labelValue || "");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!searchQuery) {
      setCities([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchCities(searchQuery);
        setCities(results);
      } catch (error) {
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const MAX_PLACEHOLDER_CHARACTERS = 45;

  const searchCities = async (query: string): Promise<City[]> => {
    if (!query) return [];

    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: query,
        format: "json",
        limit: 5,
      },
    });

   const temp =  response.data.map((item: any) => ({
      value: item.place_id,
      label: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
    return temp;
  };

  const handleChange = (value: string) => {
    setSelectedValue(value);  
    const selected = cities.find((city) => {
      if (typeof city.label === 'string') {
        return city.label.toLowerCase() === value.toLowerCase();
      }
      return false;
    });
  
    if (selected) {
      onCitySelect(selected);
    }
  };

  const update = (str: string) => {
    return str.length > MAX_PLACEHOLDER_CHARACTERS
      ? str.substring(0, MAX_PLACEHOLDER_CHARACTERS) + '...'
      : str;
  };
  

  useEffect(() => {
    if (selectedValue) {
      const selectedCity = cities.find((city) => city.value === selectedValue);
      if (selectedCity) {
      }
    }
  }, [selectedValue, cities]);

  return (
    <div className="flex flex-col gap-2">
      <AsyncSelect<City>
        fetcher={async (query) => {
          setSearchQuery(query || "");
          return cities;
        }}
        renderOption={(city) => (
          <div className="font-medium">{city.label}</div>
        )}
        getOptionValue={(city) => city.value}
        getDisplayValue={(city) => city.label}
        notFound={<div className="py-6 text-center text-sm">Aucune ville trouvée</div>}
        label="City"
        placeholder={selectedValue ? update(labelValue || "") : placeholder}
        value={selectedValue}
        onChange={handleChange}
        width="375px"
        className={className}
      />
    </div>
  );
}

export default CityAsyncSelectDemo;
