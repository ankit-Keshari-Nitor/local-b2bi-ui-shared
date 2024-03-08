export class ResourceMappingService {
  resourceMappings;
  _flattenedResourceMappings = {};
  roles;
  permissions;

  constructor(app, resourceMappings, roles, permissions) {
    this.resourceMappings = resourceMappings;
    this.roles = roles;
    this.permissions = permissions;
    this._flatten(resourceMappings, app);
  }

  _flatten(resourceMappings, path) {
    for (let resourceMapKey in resourceMappings) {
      if (Object.hasOwn(resourceMappings[resourceMapKey], 'enabled')) {
        this._flattenedResourceMappings[path ? path + '.' + resourceMapKey : resourceMapKey] = resourceMappings[resourceMapKey];
        this._flattenedResourceMappings[path ? path + '.' + resourceMapKey : resourceMapKey].status = this.checkIfResourceHasAccess(resourceMappings[resourceMapKey]);
      } else {
        this._flatten(resourceMappings[resourceMapKey], path ? path + '.' + resourceMapKey : resourceMapKey);
      }
    }
  }

  checkIfResourceHasAccess(resourceMapping) {
    let hasRoleAccess = false;
    let hasPermissionAccess = false;
    if (this.roles && this.roles.length > 0 && resourceMapping?.roles && resourceMapping.roles.length > 0) {
      for (const checkRole of resourceMapping.roles) {
        hasRoleAccess = this.roles.includes(checkRole);
        if (hasRoleAccess) {
          break;
        }
      }
    } else {
      hasRoleAccess = true;
    }
    if (this.permissions && this.permissions.length > 0 && resourceMapping?.permissions && resourceMapping.permissions.length > 0) {
      for (const checkPermission of resourceMapping.permissions) {
        hasPermissionAccess = this.permissions.includes(checkPermission);
        if (hasPermissionAccess) {
          break;
        }
      }
    } else {
      hasPermissionAccess = true;
    }
    return {
      roleAccess: hasRoleAccess,
      permissionAccess: hasPermissionAccess,
      access: hasRoleAccess || hasPermissionAccess
    };
  }

  hasAccess(resourceKey) {
    if (!resourceKey || !this._flattenedResourceMappings[resourceKey]) {
      //|| !this._flattenedResourceMappings[resourceKey]
      return true;
    }
    return this.isEnabled(resourceKey) && this._flattenedResourceMappings[resourceKey].status.access;
  }

  hasRoleAccess(resourceKey) {
    if (!resourceKey || !this._flattenedResourceMappings[resourceKey]) {
      return true;
    }
    return this.isEnabled(resourceKey) && this._flattenedResourceMappings[resourceKey].status.roleAccess;
  }

  hasPermissionAccess(resourceKey) {
    if (!resourceKey || !this._flattenedResourceMappings[resourceKey]) {
      return true;
    }
    return this.isEnabled(resourceKey) && this._flattenedResourceMappings[resourceKey].status.permissionAccess;
  }
  isEnabled(resourceKey) {
    return !this._flattenedResourceMappings[resourceKey] || (this._flattenedResourceMappings[resourceKey] && this._flattenedResourceMappings[resourceKey].enabled);
  }
}
