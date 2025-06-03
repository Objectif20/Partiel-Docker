import { createContext, Dispatch, SetStateAction } from "react";

interface RegisterContextProps {
    isPro: boolean;
    setIsPro: Dispatch<SetStateAction<boolean>>;
    isPrestataire: boolean;
    setIsPrestataire: Dispatch<SetStateAction<boolean>>;
    nextStep: () => void;
    prevStep: () => void;
    setClientInfo: (value: any) => void;
    clientInfo: any;
    setPrestataireInfo: (value: any) => void;
    prestataireInfo: any;
    setCommercantInfo: (value: any) => void;
    commercantInfo: any;
    setIsFinished: Dispatch<SetStateAction<boolean>>;
    isFinished: boolean;
}

export const RegisterContext = createContext<RegisterContextProps>({
    isPro: false,
    setIsPro: () => {},
    isPrestataire: false,
    setIsPrestataire: () => {},
    nextStep: () => {},
    prevStep: () => {},
    setClientInfo: () => {},
    clientInfo: {},
    setPrestataireInfo: () => {},
    prestataireInfo: {},
    setCommercantInfo: () => {},
    commercantInfo: {},
    setIsFinished: () => {},
    isFinished: false,

});
