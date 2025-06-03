import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { UserApi } from '@/api/user.api';
import { RootState } from '../redux/store';
import ForbiddenPage from '@/pages/error/403';

interface PrivateProfileRoutesProps {
  requiredProfiles: string[];
}

const PrivateProfileRoutes: React.FC<PrivateProfileRoutesProps> = ({ requiredProfiles }) => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(UserApi.getUserData()).finally(() => setLoading(false));
    };
    fetchData();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  const hasAccess = requiredProfiles.some(profile => user?.profile.includes(profile));

  if (!hasAccess) {
    console.error('Access denied: insufficient permissions');
    return <ForbiddenPage />;
  }

  return <Outlet />;
};

export default PrivateProfileRoutes;
