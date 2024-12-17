import { Test } from '@nestjs/testing';
import RolePermission from 'src/authorization/entity/rolePermission.entity';
import { DataSource } from 'typeorm';
import { RolePermissionRepository } from '../../../src/authorization/repository/rolePermission.repository';
import { TENANT_CONNECTION } from '../../../src/database/database.constants';

describe('test RolePermission repository', () => {
  let rolePermissionRepository: RolePermissionRepository;

  let findMock: jest.Mock;

  const mockDataSource = { createEntityManager: jest.fn() };

  const VALID_ROLE_ID = 'ae032b1b-cc3c-4e44-9197-276ca877a7f8';
  const rolePermissions: RolePermission[] = [
    {
      permissionId: '2b33268a-7ff5-4cac-a87a-6bfc4430d34c',
      roleId: VALID_ROLE_ID,
      tenantId: '1ef2a357-d4b7-4a30-88ca-d1cc627f2994',
    },
    {
      permissionId: '09f7f119-c14b-4c37-ac1f-aae57d7bdbe5',
      roleId: VALID_ROLE_ID,
      tenantId: '1ef2a357-d4b7-4a30-88ca-d1cc627f2994',
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RolePermissionRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: TENANT_CONNECTION,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    rolePermissionRepository = moduleRef.get(RolePermissionRepository);

    findMock = rolePermissionRepository.find = jest.fn();
  });

  describe('findByRoleId', () => {
    it('should get role permision by role id', async () => {
      findMock.mockResolvedValue(rolePermissions);

      const result = await rolePermissionRepository.findByRoleId(VALID_ROLE_ID);

      expect(findMock).toHaveBeenCalledWith({
        where: { roleId: VALID_ROLE_ID },
      });

      expect(result).toEqual(rolePermissions);
    });
  });
});
