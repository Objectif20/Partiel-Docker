import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { Plan, RegisterApi } from "@/api/register.api";
import stripePromise from '@/config/stripeConfig';

interface SubscriptionDialogProps {
  children: React.ReactNode;
  onPlanChange?: (planId: number, paymentMethodId: string) => void;
  stripe_account: boolean;
  actualPlan?: number;
}

function SubscriptionDialog({
  children,
  onPlanChange,
  stripe_account,
  actualPlan,
}: SubscriptionDialogProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [_, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await RegisterApi.getPlan();
        const mockPlans: Plan[] = await response;
        setPlans(mockPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((p) => p.plan_id === Number.parseInt(planId));
    setSelectedPlan(plan || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    if (!cardNumber || !cardExpiry || !cardCvc) {
      setError("Card details are unavailable.");
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
      });

      if (error) {
        setError(error.message || "An unknown error occurred.");
        setIsProcessing(false);
      } else {
        if (selectedPlan && onPlanChange) {
          await onPlanChange(selectedPlan.plan_id, paymentMethod.id);
          setOpen(false);
        }
      }
    } catch (err) {
      setError("An error occurred while processing the payment.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#000",
        "::placeholder": {
          color: "#aab7b7",
        },
      },
      invalid: {
        color: "hsl(var(--destructive))",
      },
    },
  };

  const filteredPlans = plans.filter(plan => plan.plan_id !== actualPlan);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Changer de formule</DialogTitle>
          <DialogDescription>
            Trouvez l'abonnement qui vous correspond
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select onValueChange={handlePlanChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un plan" />
              </SelectTrigger>
              <SelectContent>
                {filteredPlans.map((plan) => (
                  <SelectItem
                    key={plan.plan_id}
                    value={plan.plan_id.toString()}
                  >
                    {plan.name} - {plan.price}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          {selectedPlan && (
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-2">{selectedPlan.name}</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Prix :</span>
                  <span className="font-medium">{selectedPlan.price}€ / mois</span>
                </li>
                <li className="flex justify-between">
                  <span>Réduction sur les petits colis :</span>
                  <span className="font-medium">{selectedPlan.shipping_discount}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Réductions permanentes :</span>
                  <span className="font-medium">{selectedPlan.permanent_discount}%</span>
                </li>
              </ul>
            </div>
          )}
  
          {!stripe_account && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground">
                  Numéro de carte
                </label>
                <div className="mt-1 p-2 border rounded-md">
                  <CardNumberElement
                    id="cardNumber"
                    options={cardElementOptions}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cardExpiry" className="block text-sm font-medium text-foreground">
                    Date d'expiration
                  </label>
                  <div className="mt-1 p-2 border rounded-md">
                    <CardExpiryElement
                      id="cardExpiry"
                      options={cardElementOptions}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cardCvc" className="block text-sm font-medium text-foreground">
                    Code de sécurité
                  </label>
                  <div className="mt-1 p-2 border rounded-md">
                    <CardCvcElement
                      id="cardCvc"
                      options={cardElementOptions}
                    />
                  </div>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" disabled={!stripe || isProcessing}>
                    {isProcessing ? "Traitement..." : "Valider"}
                  </Button>
                </DialogClose>
              </div>
            </form>
          )}
  
          {stripe_account && (
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    selectedPlan &&
                    onPlanChange &&
                    onPlanChange(selectedPlan.plan_id, "")
                  }
                  disabled={!selectedPlan}
                >
                  Valider
                </Button>
              </DialogClose>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SubscriptionDialogWrapper(props: SubscriptionDialogProps) {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionDialog {...props} />
    </Elements>
  );
}
