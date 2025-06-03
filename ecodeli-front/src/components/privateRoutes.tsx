import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../api/auth.api';
import { AppDispatch } from '../redux/store';
import Layout from '@/pages/features/layout';
import { UserApi } from '@/api/user.api';
import { Spinner } from './ui/spinner';

type PrivateRouteProps = {
  requireAuth?: boolean;
};
 
const PrivateRoute: React.FC<PrivateRouteProps> = ({ requireAuth = true }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAccessToken();

        if (response?.accessToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }

        await dispatch(UserApi.getUserData());
      } catch (error) {
        console.error('Erreur d’authentification ou de récupération des données utilisateur', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
