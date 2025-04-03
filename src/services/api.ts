import axios from 'axios';
import { User, Device, Schedule, Permission, LoginCredentials } from '../types';
import { users, devices, schedules, permissions, credentials } from '../mocks/data';
import { v4 as uuidv4 } from 'uuid';

// Delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth service
export const authService = {
  login: async (loginData: LoginCredentials) => {
    await delay(500); // Simulate API delay
    
    if (loginData.username === credentials.username && loginData.password === credentials.password) {
      return {
        user: {
          id: '0',
          username: 'admin',
          name: 'Admin User',
          idNumber: 'ADMIN001',
        },
        token: 'fake-jwt-token',
      };
    } else {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  },
  logout: async () => {
    await delay(200);
    return true;
  },
};

// User service
export const userService = {
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return [...users];
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(300);
    return users.find(user => user.id === id);
  },
  
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    await delay(300);
    const newUser: User = {
      id: uuidv4(),
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },
  
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(300);
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    const updatedUser = { ...users[index], ...userData };
    users[index] = updatedUser;
    return updatedUser;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await delay(300);
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    users.splice(index, 1);
  },
};

// Device service
export const deviceService = {
  getDevices: async (): Promise<Device[]> => {
    await delay(300);
    return [...devices];
  },
  
  getDeviceById: async (id: string): Promise<Device | undefined> => {
    await delay(300);
    return devices.find(device => device.id === id);
  },
  
  createDevice: async (deviceData: Omit<Device, 'id'>): Promise<Device> => {
    await delay(300);
    const newDevice: Device = {
      id: uuidv4(),
      ...deviceData,
    };
    devices.push(newDevice);
    return newDevice;
  },
  
  updateDevice: async (id: string, deviceData: Partial<Device>): Promise<Device> => {
    await delay(300);
    const index = devices.findIndex(device => device.id === id);
    if (index === -1) {
      throw new Error('Device not found');
    }
    const updatedDevice = { ...devices[index], ...deviceData };
    devices[index] = updatedDevice;
    return updatedDevice;
  },
  
  deleteDevice: async (id: string): Promise<void> => {
    await delay(300);
    const index = devices.findIndex(device => device.id === id);
    if (index === -1) {
      throw new Error('Device not found');
    }
    devices.splice(index, 1);
  },
};

// Permission service
export const permissionService = {
  getPermissions: async (): Promise<Permission[]> => {
    await delay(300);
    return [...permissions];
  },
  
  createPermission: async (userIds: string[], deviceIds: string[], startTime: string, endTime: string): Promise<Permission> => {
    await delay(300);
    const newPermission: Permission = {
      id: uuidv4(),
      userIds,
      deviceIds,
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
    };
    permissions.push(newPermission);
    return newPermission;
  },

  deletePermission: async (id: string): Promise<void> => {
    await delay(300);
    const index = permissions.findIndex(permission => permission.id === id);
    if (index === -1) {
      throw new Error('Permission not found');
    }
    permissions.splice(index, 1);
  },
}; 