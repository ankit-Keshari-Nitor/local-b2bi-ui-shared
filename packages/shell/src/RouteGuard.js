import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './core/providers/AuthProvider';
import { useResource } from './core/providers/ResourceProvider';

const RouteGuard = (props) => {
  const { user, isAuthenticated } = useAuth();
  let location = useLocation();
  const { hasAccess } = useResource();
  if (props.type === 'auth' && location.pathname !== '/login') {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else if (props.type === 'resource') {
    if (!hasAccess(props.resourceKey)) {
      return <Navigate to="/notAuthorized" state={{ from: location }} replace />;
    }
  }

  return props.children;
};

export { RouteGuard };
