import { ResourceMappingService } from './ResourceMappingService';

const resourceMappings = {
  TEST: {
    LEVEL1: {
      enabled: true,
      roles: ['ROLE-3'],
      permissions: ['PERMISSION-1']
    }
  },
  RM1: {
    enabled: true,
    roles: ['ROLE-3'],
    permissions: ['PERMISSION-1']
  },
  RM2: {
    enabled: true,
    roles: ['ROLE-1'],
    permissions: ['PERMISSION-3']
  },
  RM3: {
    enabled: false,
    roles: ['ROLE-3'],
    permissions: ['PERMISSION-1']
  }
};

const roles = ['ROLE-1', 'ROLE-2'];
const permissions = ['PERMISSION-1', 'PERMISSION-2'];

describe('ResourceMappingService:', () => {
  it('Should be able to create ResourceMappingService instance', async () => {
    const rms = new ResourceMappingService('', {}, [], []);
    expect(rms).not.toBe(undefined);
  });

  it('Should be able to create flattened map of resources', async () => {
    const rms = new ResourceMappingService('appCode', resourceMappings, roles, permissions);
    expect(rms['_flattenedResourceMappings']['appCode.TEST.LEVEL1'].enabled).toBe(true);
  });

  it('Should be able to check for permission for resource', async () => {
    const rms = new ResourceMappingService('', resourceMappings, roles, permissions);
    // console.log(rms);
    expect(rms.hasPermissionAccess('RM1')).toBe(true);
    expect(rms.hasPermissionAccess('RM2')).toBe(false);
    expect(rms.hasPermissionAccess('RM0')).toBe(true);
  });

  it('Should be able to check for roles for resource', async () => {
    const rms = new ResourceMappingService('', resourceMappings, roles, permissions);
    expect(rms.hasRoleAccess('RM1')).toBe(false);
    expect(rms.hasRoleAccess('RM2')).toBe(true);
    expect(rms.hasRoleAccess('RM0')).toBe(true);
  });

  it('Should return true is resource mappings are not available', async () => {
    const rms = new ResourceMappingService('', resourceMappings, roles, permissions);
    expect(rms.hasPermissionAccess('RM0')).toBe(true);
    expect(rms.hasRoleAccess('RM0')).toBe(true);
    expect(rms.hasAccess('RM0')).toBe(true);
  });

  it('Should return false is resource is not enabled', async () => {
    const rms = new ResourceMappingService('', resourceMappings, roles, permissions);
    expect(rms.hasPermissionAccess('RM0')).toBe(true);
    expect(rms.hasRoleAccess('RM0')).toBe(true);
    expect(rms.hasAccess('RM0')).toBe(true);
  });

  it('Should verify isEnabled methid', async () => {
    const rms = new ResourceMappingService('', resourceMappings, roles, permissions);
    expect(rms.isEnabled('RM0')).toBe(true);
    expect(rms.isEnabled('RM1')).toBe(true);
    expect(rms.isEnabled('RM2')).toBe(true);
    expect(rms.isEnabled('RM3')).toBe(false);
  });
});
