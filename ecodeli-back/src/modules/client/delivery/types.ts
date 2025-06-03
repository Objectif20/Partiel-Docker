import { Shipment } from "src/common/entities/shipment.entity";

export interface DeliveryOnGoing {
 
    id: string;
    from: string;
    to: string;
    status: string;
    pickupDate: string | null;
    estimatedDeliveryDate: string | null;
    coordinates: {
      origin: [number, number];
      destination: [number, number];
    };
    progress: number;
  
  }

  export interface HistoryDelivery {
    id: string;
    departure_city: string;
    arrival_city: string;
    price: number;
    client: {
      name: string;
      photo_url: string;
    };
    status: string;
  }

  export interface ReviewAsDeliveryPerson {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      photo: string;
    };
    reply: boolean;
    reply_content: string | null;
    delivery_name: string;
    rate: number;
  }

  export interface ReviewAsClient {
    id: string;
    content: string;
    delivery: {
      id: string;
      deliveryman: {
        id: string;
        name: string;
        photo: string;
        email: string;
      };
    };
    services_name: string;
    rate: number;
  }


  export interface DeliveriesLocation {
    id: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    deliveryman?: {
      id: string;
      name: string;
      photo: string;
      email: string;
    };
    potential_address?: string;
  }

  export interface CurrentDeliveryAsClient {
    id: string;
    arrival_city: string;
    departure_city: string;
    date_departure: string;
    date_arrival: string;
    photo: string;
    deliveryman: {
      name: string;
      photo: string;
    };
  }


  export interface SubscriptionForClient {
    planName: string;
    discountRate?: number; 
    priorityRate: number;
    insuranceLimit?: number | null; 
    additionalInsuranceCost?: number | null; 
    freeShipmentAvailable?: boolean;
    freePriorityShipmentsPerMonth?: number;
    freePriotiryShipmentsIfLower?: number;
    permanentDiscount?: number; 
    hasUsedFreeShipment?: boolean; 
    remainingPriorityShipments?: number; 
  }

export interface DeliveryDetailsOffice {
  details: {
    id: string;
    name: string;
    description: string;
    complementary_info: string;
    facture_url: string;
    departure: {
      city: string;
      address: string;
      postalCode: string;
      coordinates: [number, number];
    };
    arrival: {
      city: string;
      address: string;
      postalCode: string;
      coordinates: [number, number];
    };
    departure_date: string;
    arrival_date: string;
    status: string;
    initial_price: number;
    price_with_step: {
      step: string;
      price: number;
    }[];
    invoice: {
      name: string;
      url_invoice: string;
    }[];
    urgent: boolean;
    finished: boolean;
    trolleydrop: boolean;
    departure_handling: boolean;
    arrival_handling: boolean;
    elevator_arrival: boolean;
    elevator_departure: boolean;
    floor_arrival_handling: number;
    floor_departure_handling: number;
  };
  package: {
    id: string;
    picture: string[];
    name: string;
    fragility: boolean;
    estimated_price: number;
    weight: number;
    volume: number;
  }[];
  steps: {
    id: number;
    title: string;
    description: string;
    date: string;
    departure: {
      city: string;
      address: string;
      postalCode: string;
      coordinates: [number, number];
    };
    arrival: {
      city: string;
      address: string;
      postalCode: string;
      coordinates: [number, number];
    };
    courier: {
      name: string;
      photoUrl: string;
    };
    idLink: string;
  }[];
}

  
export interface ShipmentListItem {
  id: string;
  name: string;
  status: string;
  urgent: boolean;
  departure: {
    city: string;
    address: string;
    postalCode: string;
    coordinates: [number, number];
  };
  arrival: {
    city: string;
    address: string;
    postalCode: string;
    coordinates: [number, number];
  };
  arrival_date: string;
  theoretical_departure_date: string;
  packageCount: number;
  progress: number;
  finished: boolean;
  initial_price: number;
}

export interface ShipmentHistoryRequest {
  id: string;
  name: string;
  departureCity: string;
  arrivalCity: string;
  urgent: boolean;
  nbColis: number;
  nbLivraisons: number;
}

export interface DeliveryHistoryAsClient {
  id: string;
  deliveryman: {
    id: string;
    name: string;
    photo: string;
  };
  departureDate: string;
  arrivalDate: string;
  departureCity: string;
  arrivalCity: string;
  announcementName: string;
  rate: number | null;
  comment: string | null;
}

export interface DeliveryDetails {
  departure: {
    city: string;
    address: string;
    postalCode: string;
    coordinates: [number, number];
  };
  arrival: {
    city: string;
    address: string;
    postalCode: string;
    coordinates: [number, number];
  };
  departure_date: string;
  arrival_date: string;
  status: "pending" | "taken" | "finished" | "validated";
  total_price: number;
  cart_dropped: boolean;
  isBox: boolean;
  packages: {
    id: string;
    name: string;
    fragility: boolean;
    estimated_price: number;
    weight: number;
    volume: number;
    picture: string[];
  }[];
}


export interface ShipmentWithCoveredSteps extends Omit<Shipment, 'covered_steps'> {
  covered_steps?: number[];
}