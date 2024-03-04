import React from 'react';
import { useAuth } from './AuthProvider';
import { ResourceMappingService } from '../services/ResourceMappingService';

const ResourceContext = React.createContext();

const ResourceProvider = ({ children, resourceMappings }) => {
  const { user } = useAuth();
  const rms = new ResourceMappingService('', resourceMappings, user.roles, user.permissions);

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
