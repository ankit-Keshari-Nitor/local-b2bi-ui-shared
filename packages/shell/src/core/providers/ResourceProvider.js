import React from 'react';
import { useAuth } from './AuthProvider';
import { ResourceMappingService } from '../services/ResourceMappingService';

const ResourceContext = React.createContext();

const ResourceProvider = ({ children, resourceMappings, features }) => {
  const { user, isAuthenticated } = useAuth();
  const rms = new ResourceMappingService('', resourceMappings, isAuthenticated ? user.roles : [], isAuthenticated ? user.permissions : [], isAuthenticated ? features: {});

  return (
    <ResourceContext.Provider
      value={{
        isEnabled: (key) => {
          return rms.isEnabled(key);
        },
        hasAccess: (key) => {
          return rms.hasAccess(key);
        },
        hasRoleAccess: (key) => {
          return rms.hasRoleAccess(key);
        },
        hasPermissionAccess: (key) => {
          return rms.hasPermissionAccess(key);
        }
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

const useResource = () => {
  return React.useContext(ResourceContext);
};

export { ResourceContext, ResourceProvider, useResource };
