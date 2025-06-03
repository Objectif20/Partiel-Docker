import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function SuccessDeliverymanPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Demande envoyée !</CardTitle>
          <CardDescription>La création de votre profil transporteur a été prise en compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Confirmation</AlertTitle>
            <AlertDescription>
              Votre demande sera étudiée dans les plus brefs délais. Nous vous enverrons un email de confirmation dès que le processus sera terminé.
            </AlertDescription>
          </Alert>
          <div className="mt-6 space-y-2 text-center text-muted-foreground">
            <p>Merci pour votre patience.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/office/dashboard">Aller au tableau de bord</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
