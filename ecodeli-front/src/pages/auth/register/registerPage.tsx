import { useState, useEffect } from "react";
import Step1ProfileChoice from "./Step1ProfileChoice";
import Step2ProChoice from "./Step2ProChoice";
import Step3ParticulierProfile from "./Step3ParticulierProfile";
import Step3CommercantProfile from "./Step3CommercantProfile";
import Step3PrestataireProfile from "./Step3PrestataireProfile";
import Step4PrestataireDocuments from "./Step4PrestataireDocuments";
import Step4Subscription from "./Step4Subscription";
import Step5Stripe from "./Step5Stripe";
import { RegisterContext } from "./RegisterContext";
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/config/stripeConfig';
import { RegisterApi } from "@/api/register.api";
import RegisterSuccess from "./registerSuccess";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [isPro, setIsPro] = useState(false);
    const [isPrestataire, setIsPrestataire] = useState(false);
    const [clientInfo, setClientInfo] = useState({});
    const [prestataireInfo, setPrestataireInfo] = useState({});
    const [commercantInfo, setCommercantInfo] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    useEffect(() => {
        if (isFinished) {
            if (isPro) {
                if (isPrestataire) {
                    RegisterApi.registerPrestataire(prestataireInfo)
                } else {
                    RegisterApi.registerCommercant(commercantInfo)
                }
            } else {
                RegisterApi.registerClient(clientInfo)
            }
        }
        if (step === 2 && !isPro) {
            setStep(3);
        }
        if (step === 6) {
            setIsFinished(true);
        }
    }, [step, clientInfo, isFinished, isPro, isPrestataire, prestataireInfo, commercantInfo]);

    return (
        <RegisterContext.Provider value={{ isPro, setIsPro, isPrestataire, setIsPrestataire, nextStep, prevStep, setClientInfo, clientInfo, prestataireInfo, setPrestataireInfo, setCommercantInfo, commercantInfo, setIsFinished, isFinished }}>
            {step === 1 && <Step1ProfileChoice />}
            {step === 2 && isPro && <Step2ProChoice />}
            {step === 3 && !isPro && <Step3ParticulierProfile />}
            {step === 3 && isPro && isPrestataire && <Step3PrestataireProfile />}
            {step === 3 && isPro && !isPrestataire && <Step3CommercantProfile />}
            {step === 4 && isPro && isPrestataire && <Step4PrestataireDocuments />}
            {step === 4 && !isPrestataire && <Step4Subscription />}
            {step === 5 && !isPrestataire && (
                <Elements stripe={stripePromise}>
                    <Step5Stripe />
                </Elements>
            )}
            {isFinished && (
                <RegisterSuccess />
            )}
        </RegisterContext.Provider>
    );
}
