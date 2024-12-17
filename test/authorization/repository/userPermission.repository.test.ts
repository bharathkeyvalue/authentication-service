import { Test } from '@nestjs/testing';
import UserPermission from 'src/authorization/entity/userPermission.entity';
import { DataSource } from 'typeorm';
import { UserPermissionRepository } from '../../../src/authorization/repository/userPermission.repository';
import { TENANT_CONNECTION } from '../../../src/database/database.constants';

const VALID_PERMISSION_ID = 'ae032b1b-cc3c-4e44-9197-276ca877a7f8';

const userPermissions: UserPermission[] = [
  {
    permissionId: VALID_PERMISSION_ID,
    userId: 'ccecef4f-58d3-477b-87ee-847ee22efe4d',
    tenantId: '1ef2a357-d4b7-4a30-88ca-d1cc627f2994',
  },
];

describe('test UserPermission repository', () => {
  let userPermissionRepository: UserPermissionRepository;

  let countMock: jest.Mock;
  let findMock: jest.Mock;

  const mockDataSource = { createEntityManager: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserPermissionRepository,
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

    userPermissionRepository = moduleRef.get(UserPermissionRepository);

    countMock = userPermissionRepository.count = jest.fn();
    findMock = userPermissionRepository.find = jest.fn();
  });

  describe('getUserPermissionCount', () => {
    it('should get user permision count by permission id', async () => {
      countMock.mockResolvedValue(1);

      const result = await userPermissionRepository.getUserPermissionCount(
        VALID_PERMISSION_ID,
      );

      expect(countMock).toBeCalledWith({
        where: { permissionId: VALID_PERMISSION_ID },
      });

      expect(result).toEqual(1);
    });
  });

  describe('getUserPermissionsByUserId', () => {
    it('should get user permisions by user id', async () => {
      findMock.mockResolvedValue(userPermissions);

      const result = await userPermissionRepository.getUserPermissionsByUserId(
        'ccecef4f-58d3-477b-87ee-847ee22efe4d',
      );

      expect(findMock).toBeCalledWith({
        where: { userId: 'ccecef4f-58d3-477b-87ee-847ee22efe4d' },
      });

      expect(result).toEqual(userPermissions);
    });
  });
});
