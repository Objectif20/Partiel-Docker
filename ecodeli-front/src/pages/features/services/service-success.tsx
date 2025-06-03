import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function ServiceSuccessCreatePage() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("client.pages.office.services.successCreate.title")}</CardTitle>
          <CardDescription>{t("client.pages.office.services.successCreate.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>{t("client.pages.office.services.successCreate.confirmation")}</AlertTitle>
            <AlertDescription>
              {t("client.pages.office.services.successCreate.confirmationDescription")}
            </AlertDescription>
          </Alert>
          <div className="mt-6 space-y-2 text-center text-muted-foreground">
            <p>{t("client.pages.office.services.successCreate.thankYou")}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/office/dashboard">{t("client.pages.office.services.successCreate.dashboard")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
