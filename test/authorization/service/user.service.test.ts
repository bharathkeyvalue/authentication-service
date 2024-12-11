import { Substitute, SubstituteOf } from '@fluffy-spoon/substitute';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { AuthenticationHelper } from '../../../src/authentication/authentication.helper';
import Group from '../../../src/authorization/entity/group.entity';
import GroupPermission from '../../../src/authorization/entity/groupPermission.entity';
import GroupRole from '../../../src/authorization/entity/groupRole.entity';
import Permission from '../../../src/authorization/entity/permission.entity';
import RolePermission from '../../../src/authorization/entity/rolePermission.entity';
import User from '../../../src/authorization/entity/user.entity';
import UserGroup from '../../../src/authorization/entity/userGroup.entity';
import UserPermission from '../../../src/authorization/entity/userPermission.entity';
import { UserNotFoundException } from '../../../src/authorization/exception/user.exception';
import { UserRepository } from '../../../src/authorization/repository/user.repository';
import { GroupCacheServiceInterface } from '../../../src/authorization/service/groupcache.service.interface';
import { PermissionCacheServiceInterface } from '../../../src/authorization/service/permissioncache.service.interface';
import { RoleCacheServiceInterface } from '../../../src/authorization/service/rolecache.service.interface';
import SearchService from '../../../src/authorization/service/search.service';
import { UserService } from '../../../src/authorization/service/user.service';
import { UserServiceInterface } from '../../../src/authorization/service/user.service.interface';
import { UserCacheServiceInterface } from '../../../src/authorization/service/usercache.service.interface';
import { RedisCacheService } from '../../../src/cache/redis-cache/redis-cache.service';
import { Status } from '../../../src/schema/graphql.schema';

const users: User[] = [
  {
    id: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
    email: 'user@test.com',
    phone: '9112345678910',
    password: 'SecretPassword',
    firstName: 'Test1',
    lastName: 'Test2',
    origin: 'simple',
    status: Status.ACTIVE,
    tenantId: '1ef2a357-d4b7-4a30-88ca-d1cc627f2994',
  },
];

const permissions: Permission[] = [
  {
    id: '2b33268a-7ff5-4cac-a87a-6bfc4430d34c',
    name: 'Customers',
    label: 'Customers',
  },
];

const groups: Group[] = [
  {
    id: '39d338b9-02bd-4971-a24e-b39a3f475580',
    name: 'Customers',
    tenantId: '1ef2a357-d4b7-4a30-88ca-d1cc627f2994',
  },
];

describe('test UserService', () => {
  let userService: UserServiceInterface;
  let userRepository: UserRepository;

  let createQueryBuilderMock: jest.Mock;
  let getManyAndCountMock: jest.Mock;
  let getUserByIdMock: jest.Mock;
  let saveMock: jest.Mock;
  let updateUserByIdMock: jest.Mock;

  const groupRepository = Substitute.for<Repository<Group>>();
  const permissionRepository = Substitute.for<Repository<Permission>>();
  const userPermissionRepository: SubstituteOf<
    Repository<UserPermission>
  > = Substitute.for<Repository<UserPermission>>();
  const userGroupRepository = Substitute.for<Repository<UserGroup>>();
  const groupPermissionRepository = Substitute.for<
    Repository<GroupPermission>
  >();
  const groupRoleRepository = Substitute.for<Repository<GroupRole>>();
  const rolePermissionRepository = Substitute.for<Repository<RolePermission>>();
  const userCacheService = Substitute.for<UserCacheServiceInterface>();
  const groupCacheService = Substitute.for<GroupCacheServiceInterface>();
  const permissionCacheService = Substitute.for<PermissionCacheServiceInterface>();
  const redisCacheService = Substitute.for<RedisCacheService>();
  const groupQueryBuilder = Substitute.for<SelectQueryBuilder<Group>>();
  const permissionQueryBuilder = Substitute.for<
    SelectQueryBuilder<Permission>
  >();
  const roleCacheService = Substitute.for<RoleCacheServiceInterface>();
  const searchService = Substitute.for<SearchService>();

  const mockDataSource = {
    createEntityManager: jest.fn(),
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UserService,
        ConfigService,
        AuthenticationHelper,
        UserRepository,
        {
          provide: getRepositoryToken(Permission),
          useValue: permissionRepository,
        },
        {
          provide: getRepositoryToken(Group),
          useValue: groupRepository,
        },
        {
          provide: getRepositoryToken(UserGroup),
          useValue: userGroupRepository,
        },
        {
          provide: getRepositoryToken(UserPermission),
          useValue: userPermissionRepository,
        },
        {
          provide: getRepositoryToken(GroupPermission),
          useValue: groupPermissionRepository,
        },
        {
          provide: getRepositoryToken(GroupRole),
          useValue: groupRoleRepository,
        },
        {
          provide: getRepositoryToken(RolePermission),
          useValue: rolePermissionRepository,
        },
        { provide: UserCacheServiceInterface, useValue: userCacheService },
        { provide: GroupCacheServiceInterface, useValue: groupCacheService },
        { provide: RedisCacheService, useValue: redisCacheService },
        { provide: SearchService, useValue: searchService },
        {
          provide: PermissionCacheServiceInterface,
          useValue: permissionCacheService,
        },
        { provide: RoleCacheServiceInterface, useValue: roleCacheService },
        { provide: SearchService, useValue: searchService },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();
    userService = moduleRef.get<UserServiceInterface>(UserService);
    userRepository = moduleRef.get(UserRepository);

    getUserByIdMock = userRepository.getUserById = jest.fn();
    saveMock = userRepository.save = jest.fn();
    updateUserByIdMock = userRepository.updateUserById = jest.fn();

    createQueryBuilderMock = userRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: (getManyAndCountMock = jest.fn()),
      });
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      getManyAndCountMock.mockResolvedValue([users, 1]);

      const result = await userService.getAllUsers();

      expect(createQueryBuilderMock.mock.calls[0][0]).toStrictEqual('user');

      expect(getManyAndCountMock).toBeCalledTimes(1);

      expect(result).toEqual([users, 1]);
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      getUserByIdMock.mockResolvedValue(users[0]);

      const result = await userService.getUserById(
        'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
      );
      expect(getUserByIdMock).toBeCalledWith(
        'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
      );

      expect(result).toEqual(users[0]);
    });

    it('should throw exception for invalid id', async () => {
      getUserByIdMock.mockResolvedValue(null);

      try {
        await userService.getUserById('ae032b1b-cc3c-4e44-9197-276ca877a7f9');
      } catch (error) {
        expect(getUserByIdMock).toBeCalledWith(
          'ae032b1b-cc3c-4e44-9197-276ca877a7f9',
        );

        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const input: User = {
        id: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
        email: 'user@test.com',
        phone: '9112345678910',
        password: 'SecretPassword',
        firstName: 'Test1',
        lastName: 'Test2',
        origin: 'simple',
        status: Status.ACTIVE,
        tenantId: '1ef2a357-d4b7-4a30-88ca-d1cc627f2994',
      };

      saveMock.mockResolvedValue(users[0]);

      const result = await userService.createUser(input);

      expect(saveMock).toBeCalledWith(input);

      expect(result).toEqual(users[0]);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const input = {
        firstName: 'Test1',
        lastName: 'Test2',
      };

      updateUserByIdMock.mockResolvedValue(true);
      getUserByIdMock.mockResolvedValue(users[0]);

      const result = await userService.updateUser(
        'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
        input,
      );

      expect(updateUserByIdMock).toBeCalledWith(
        'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
        input,
      );

      expect(getUserByIdMock).toBeCalledWith(
        'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
      );

      expect(result).toEqual(users[0]);
    });
  });

  // describe('deleteUser', () => {
  //   it('should delete a user', async () => {
  //     // userRepository
  //     //   .softDelete('ae032b1b-cc3c-4e44-9197-276ca877a7f8')
  //     //   .resolves(Arg.any());

  //     getUserByIdMock.mockResolvedValue(users[0]);

  //     const result = await userService.deleteUser(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //     );

  //     expect(getUserByIdMock).toBeCalledWith(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //     );

  //     expect(result).toEqual(users[0]);
  //   });
  // });

  // describe('updateUserPermissions', () => {
  //   it('should update user permissions', async () => {
  //     const request = [
  //       {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //         permissionId: '2b33268a-7ff5-4cac-a87a-6bfc4430d34c',
  //       },
  //     ];
  //     userPermissionRepository.create(request).returns(request);
  //     userPermissionRepository.insert(request).resolves(Arg.any());
  //     userPermissionRepository.remove([]).resolves(Arg.any());
  //     permissionRepository
  //       .findByIds(['2b33268a-7ff5-4cac-a87a-6bfc4430d34c'])
  //       .resolves(permissions);
  //     permissionRepository.createQueryBuilder().returns(permissionQueryBuilder);
  //     permissionQueryBuilder
  //       .leftJoinAndSelect(
  //         UserPermission,
  //         'userPermission',
  //         'Permission.id = userPermission.permissionId',
  //       )
  //       .returns(permissionQueryBuilder);

  //     permissionQueryBuilder
  //       .where('userPermission.userId = :userId', {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       })
  //       .returns(permissionQueryBuilder);

  //     permissionQueryBuilder.getMany().resolves([]);

  //     mockDataSource.transaction(Arg.any()).resolves(request);

  //     userCacheService.invalidateUserPermissionsCache(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //     );

  //     const result = await userService.updateUserPermissions(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       { permissions: ['2b33268a-7ff5-4cac-a87a-6bfc4430d34c'] },
  //     );
  //     expect(result).toEqual(permissions);
  //   });

  //   it('should throw exception when user is updated with invalid permissions', async () => {
  //     const request = [
  //       {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //         permissionId: '23097816-39ef-4862-b557-dab6cc67d5c5',
  //       },
  //     ];
  //     userPermissionRepository.create(request).returns(request);
  //     userPermissionRepository.insert(request).resolves(Arg.any());
  //     permissionRepository
  //       .findByIds(['23097816-39ef-4862-b557-dab6cc67d5c5'])
  //       .resolves([]);

  //     const result = userService.updateUserPermissions(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       { permissions: ['23097816-39ef-4862-b557-dab6cc67d5c5'] },
  //     );
  //     await expect(result).rejects.toThrowError(
  //       new PermissionNotFoundException(
  //         ['23097816-39ef-4862-b557-dab6cc67d5c5'].toString(),
  //       ),
  //     );
  //   });
  // });

  // describe('updateUserGroups', () => {
  //   it('should update user groups', async () => {
  //     const request = [
  //       {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //         groupId: '39d338b9-02bd-4971-a24e-b39a3f475580',
  //       },
  //     ];
  //     userGroupRepository.create(request).returns(request);
  //     userGroupRepository.insert(request).resolves(Arg.any());
  //     groupRepository
  //       .findByIds(['39d338b9-02bd-4971-a24e-b39a3f475580'])
  //       .resolves(groups);
  //     groupRepository.createQueryBuilder().returns(groupQueryBuilder);
  //     groupQueryBuilder
  //       .leftJoinAndSelect(
  //         UserGroup,
  //         'userGroup',
  //         'Group.id = userGroup.groupId',
  //       )
  //       .returns(groupQueryBuilder);
  //     groupQueryBuilder
  //       .where('userGroup.userId = :userId', {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       })
  //       .returns(groupQueryBuilder);
  //     groupQueryBuilder.getMany().resolves(groups);
  //     userCacheService.invalidateUserGroupsCache(Arg.any()).resolves(Arg.any());
  //     const result = await userService.updateUserGroups(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       { groups: ['39d338b9-02bd-4971-a24e-b39a3f475580'] },
  //     );
  //     expect(result).toEqual(groups);
  //   });

  //   it('should throw exception if user groups are invalid', async () => {
  //     const request = [
  //       {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //         groupId: '91742290-4049-45c9-9c27-c9f6200fef4c',
  //       },
  //     ];
  //     userGroupRepository.create(request).returns(request);
  //     userGroupRepository.insert(request).resolves(Arg.any());
  //     groupRepository
  //       .findByIds(['91742290-4049-45c9-9c27-c9f6200fef4c'])
  //       .resolves([]);

  //     const result = userService.updateUserGroups(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       { groups: ['91742290-4049-45c9-9c27-c9f6200fef4c'] },
  //     );
  //     await expect(result).rejects.toThrowError(
  //       new GroupNotFoundException(
  //         ['91742290-4049-45c9-9c27-c9f6200fef4c'].toString(),
  //       ),
  //     );
  //   });
  // });

  // describe('verifyUserPermissions', () => {
  //   it('should verify and return true if user has required permissions', async () => {
  //     const userGroups: UserGroup[] = [
  //       {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //         groupId: '91742290-4049-45c9-9c27-c9f6200fef4c',
  //       },
  //     ];
  //     const userPermissions = [
  //       {
  //         userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //         permissionId: '23097816-39ef-4862-b557-dab6cc67d5c5',
  //       },
  //     ];
  //     const groupPermissions = [
  //       {
  //         groupId: '91742290-4049-45c9-9c27-c9f6200fef4c',
  //         permissionId: '2b33268a-7ff5-4cac-a87a-6bfc4430d34c',
  //       },
  //     ];
  //     const permissions: Permission[] = [
  //       {
  //         id: '2b33268a-7ff5-4cac-a87a-6bfc4430d34c',
  //         name: 'CreateUser',
  //         label: 'Create User',
  //       },
  //     ];
  //     const groupRoles = [
  //       {
  //         groupId: '91742290-4049-45c9-9c27-c9f6200fef4c',
  //         roleId: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       },
  //     ];
  //     const groupRolePermissions = [
  //       {
  //         roleId: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //         permissionId: '2b33268a-7ff5-4cac-a87a-6bfc4430d34c',
  //       },
  //     ];
  //     userGroupRepository
  //       .find({ where: { userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8' } })
  //       .resolves(userGroups);
  //     userPermissionRepository
  //       .find({ where: { userId: 'ae032b1b-cc3c-4e44-9197-276ca877a7f8' } })
  //       .resolves(userPermissions);
  //     groupPermissionRepository
  //       .find({
  //         where: { groupId: In(['91742290-4049-45c9-9c27-c9f6200fef4c']) },
  //       })
  //       .resolves(groupPermissions);
  //     permissionRepository
  //       .find({ where: { name: In(['CreateUser']) } })
  //       .resolves(permissions);
  //     groupRoleRepository
  //       .find({
  //         where: { groupId: In(['91742290-4049-45c9-9c27-c9f6200fef4c']) },
  //       })
  //       .resolves(groupRoles);
  //     rolePermissionRepository
  //       .find({
  //         where: { roleId: In(['366ad922-464c-4e48-a26b-d8d5a9090763']) },
  //       })
  //       .resolves(groupRolePermissions);
  //     userCacheService
  //       .getUserGroupsByUserId('ae032b1b-cc3c-4e44-9197-276ca877a7f8')
  //       .resolves(userGroups.map((x) => x.groupId));
  //     userCacheService
  //       .getUserPermissionsByUserId('ae032b1b-cc3c-4e44-9197-276ca877a7f8')
  //       .resolves(userPermissions.map((x) => x.permissionId));
  //     groupCacheService
  //       .getGroupPermissionsFromGroupId('91742290-4049-45c9-9c27-c9f6200fef4c')
  //       .resolves(groupPermissions.map((x) => x.permissionId));
  //     permissionCacheService
  //       .getPermissionsFromCache(Arg.any())
  //       .resolves(permissions[0]);
  //     groupCacheService
  //       .getGroupRolesFromGroupId('91742290-4049-45c9-9c27-c9f6200fef4c')
  //       .resolves(groupRoles.map((x) => x.roleId));
  //     roleCacheService
  //       .getRolePermissionsFromRoleId('366ad922-464c-4e48-a26b-d8d5a9090763')
  //       .resolves(groupRolePermissions.map((x) => x.permissionId));
  //     const result = await userService.verifyUserPermissions(
  //       'ae032b1b-cc3c-4e44-9197-276ca877a7f8',
  //       ['CreateUser'],
  //     );
  //     expect(result).toEqual(true);
  //   });

  //   it('should verify and throw error if user doesnot have required permissions', async () => {
  //     const userGroups: UserGroup[] = [
  //       {
  //         userId: 'f95e6f6d-7678-4871-9e08-c3f23b87c3ff',
  //         groupId: 'a8f55c77-4f8f-4a12-99f9-8962144e08f0',
  //       },
  //     ];
  //     const userPermissions = [
  //       {
  //         userId: 'f95e6f6d-7678-4871-9e08-c3f23b87c3ff',
  //         permissionId: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       },
  //     ];
  //     const groupPermissions = [
  //       {
  //         groupId: 'a8f55c77-4f8f-4a12-99f9-8962144e08f0',
  //         permissionId: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       },
  //     ];
  //     const permissions: Permission[] = [
  //       {
  //         id: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //         name: 'CreateEmployee',
  //         label: 'Create Employee',
  //       },
  //     ];
  //     const groupRoles = [
  //       {
  //         groupId: 'a8f55c77-4f8f-4a12-99f9-8962144e08f0',
  //         roleId: 'fcd858c6-26c5-462b-8c53-4b544830dca8',
  //       },
  //     ];
  //     const groupRolePermissions = [
  //       {
  //         roleId: 'fcd858c6-26c5-462b-8c53-4b544830dca8',
  //         permissionId: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       },
  //     ];
  //     userGroupRepository
  //       .find({ where: { userId: 'f95e6f6d-7678-4871-9e08-c3f23b87c3ff' } })
  //       .resolves(userGroups);
  //     userPermissionRepository
  //       .find({ where: { userId: 'f95e6f6d-7678-4871-9e08-c3f23b87c3ff' } })
  //       .resolves(userPermissions);
  //     groupPermissionRepository
  //       .find({
  //         where: { groupId: In(['a8f55c77-4f8f-4a12-99f9-8962144e08f0']) },
  //       })
  //       .resolves(groupPermissions);
  //     permissionRepository
  //       .find({ where: { name: In(['CreateEmployee']) } })
  //       .resolves(permissions);
  //     groupRoleRepository
  //       .find({
  //         where: { groupId: In(['a8f55c77-4f8f-4a12-99f9-8962144e08f0']) },
  //       })
  //       .resolves(groupRoles);
  //     rolePermissionRepository
  //       .find({
  //         where: { roleId: In(['fcd858c6-26c5-462b-8c53-4b544830dca8']) },
  //       })
  //       .resolves(groupRolePermissions);
  //     userCacheService
  //       .getUserGroupsByUserId('f95e6f6d-7678-4871-9e08-c3f23b87c3ff')
  //       .resolves(userGroups.map((x) => x.groupId));
  //     userCacheService
  //       .getUserPermissionsByUserId('f95e6f6d-7678-4871-9e08-c3f23b87c3ff')
  //       .resolves(userPermissions.map((x) => x.permissionId));
  //     groupCacheService
  //       .getGroupPermissionsFromGroupId('a8f55c77-4f8f-4a12-99f9-8962144e08f0')
  //       .resolves(groupPermissions.map((x) => x.permissionId));
  //     groupCacheService
  //       .getGroupRolesFromGroupId('a8f55c77-4f8f-4a12-99f9-8962144e08f0')
  //       .resolves(groupRoles.map((x) => x.roleId));
  //     roleCacheService
  //       .getRolePermissionsFromRoleId('fcd858c6-26c5-462b-8c53-4b544830dca8')
  //       .resolves(groupRolePermissions.map((x) => x.permissionId));
  //     const result = userService.verifyUserPermissions(
  //       'f95e6f6d-7678-4871-9e08-c3f23b87c3ff',
  //       ['CreateUser'],
  //     );
  //     expect(result).rejects.toThrowError(
  //       new UserNotAuthorized(['CreateUser']),
  //     );
  //   });
  // });

  // describe('permissionsOfUser', () => {
  //   it('should return all permissions of a user', async () => {
  //     const userGroups: UserGroup[] = [
  //       {
  //         userId: '5228e8a3-5901-46a5-86c2-47611e41538a',
  //         groupId: '8958f72e-6986-42f9-8089-f1e9dc291a1b',
  //       },
  //     ];
  //     const userPermissions = [
  //       {
  //         userId: '5228e8a3-5901-46a5-86c2-47611e41538a',
  //         permissionId: 'b7896dde-adce-41a4-88e5-37b0bbd94051',
  //       },
  //     ];
  //     const groupPermissions = [
  //       {
  //         groupId: '8958f72e-6986-42f9-8089-f1e9dc291a1b',
  //         permissionId: '920159fb-66c4-445c-a907-8a055b317c58',
  //       },
  //     ];
  //     const groupRoles = [
  //       {
  //         groupId: 'a8f55c77-4f8f-4a12-99f9-8962144e08f0',
  //         roleId: 'fb357f0c-1287-4d3a-be77-3eececfbfb77',
  //       },
  //     ];
  //     const groupRolePermissions = [
  //       {
  //         roleId: 'fb357f0c-1287-4d3a-be77-3eececfbfb77',
  //         permissionId: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       },
  //     ];
  //     const permissions: Permission[] = [
  //       {
  //         id: 'b7896dde-adce-41a4-88e5-37b0bbd94051',
  //         name: 'CreateEmployee',
  //         label: 'Create Employee',
  //       },
  //       {
  //         id: '920159fb-66c4-445c-a907-8a055b317c58',
  //         name: 'DeleteEmployee',
  //         label: 'Delete Employee',
  //       },
  //       {
  //         id: '366ad922-464c-4e48-a26b-d8d5a9090763',
  //         name: 'EditEmployee',
  //         label: 'Edit Employee',
  //       },
  //     ];
  //     userCacheService
  //       .getUserGroupsByUserId('5228e8a3-5901-46a5-86c2-47611e41538a')
  //       .resolves(userGroups.map((x) => x.groupId));
  //     groupCacheService
  //       .getGroupPermissionsFromGroupId('8958f72e-6986-42f9-8089-f1e9dc291a1b')
  //       .resolves(groupPermissions.map((x) => x.permissionId));
  //     groupCacheService
  //       .getGroupRolesFromGroupId('8958f72e-6986-42f9-8089-f1e9dc291a1b')
  //       .resolves(groupRoles.map((x) => x.roleId));
  //     roleCacheService
  //       .getRolePermissionsFromRoleId('fb357f0c-1287-4d3a-be77-3eececfbfb77')
  //       .resolves(groupRolePermissions.map((x) => x.permissionId));
  //     userCacheService
  //       .getUserPermissionsByUserId('5228e8a3-5901-46a5-86c2-47611e41538a')
  //       .resolves(userPermissions.map((x) => x.permissionId));
  //     const result = await userService.getAllUserpermissionIds(
  //       '5228e8a3-5901-46a5-86c2-47611e41538a',
  //     );
  //     expect(result).toEqual(
  //       new Set([
  //         'b7896dde-adce-41a4-88e5-37b0bbd94051',
  //         '920159fb-66c4-445c-a907-8a055b317c58',
  //         '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       ]),
  //     );
  //     permissionRepository
  //       .findByIds([
  //         'b7896dde-adce-41a4-88e5-37b0bbd94051',
  //         '920159fb-66c4-445c-a907-8a055b317c58',
  //         '366ad922-464c-4e48-a26b-d8d5a9090763',
  //       ])
  //       .resolves(permissions);
  //     const response = await userService.permissionsOfUser(
  //       '5228e8a3-5901-46a5-86c2-47611e41538a',
  //     );
  //     expect(response).toEqual(permissions);
  //   });
  // });
});
