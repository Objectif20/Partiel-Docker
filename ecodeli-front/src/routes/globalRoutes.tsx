import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./global/authRoutes";
import NotFoundPage from "@/pages/error/404";
import PublicRoutes from "./global/publicRoutes";
import PrivateRoute from "@/components/privateRoutes";
import OfficeRoute from "./global/officeRoutes";
import InfoRoute from "./global/infoRoutes";


export default function GlobalRoutes() {

    return (
        <Routes>
            <Route path="auth/*" element={<AuthRoutes />} />
            <Route path="info/*" element={<InfoRoute />} />
            <Route element={<PrivateRoute requireAuth={true} />}>
            <Route path="/office/*" element={<OfficeRoute />} />
            </Route>
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}