import { v4 as uuidv4 } from 'uuid';
import { User, Device, Permission, Schedule } from '../types';

// Helper function to create dates
const currentDate = new Date().toISOString();
const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

// Mock Users
export const users: User[] = [
  {
    id: '1',
    username: 'john.doe',
    name: 'John Doe',
    idNumber: 'ID001',
    faceImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    fingerPrint: 'fingerprint_data_1',
  },
  {
    id: '2',
    username: 'jane.smith',
    name: 'Jane Smith',
    idNumber: 'ID002',
    faceImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    fingerPrint: 'fingerprint_data_2',
  },
  {
    id: '3',
    username: 'michael.brown',
    name: 'Michael Brown',
    idNumber: 'ID003',
    faceImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    fingerPrint: 'fingerprint_data_3',
  },
  {
    id: '4',
    username: 'emily.johnson',
    name: 'Emily Johnson',
    idNumber: 'ID004',
    faceImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    fingerPrint: 'fingerprint_data_4',
  },
  {
    id: '5',
    username: 'david.wilson',
    name: 'David Wilson',
    idNumber: 'ID005',
    faceImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    fingerPrint: 'fingerprint_data_5',
  },
];

// Mock Devices
export const devices: Device[] = [
  {
    id: '1',
    name: 'Main Entrance',
    position: 'Front Building',
    type: 'Fingerprint Scanner',
    location: 'Lobby Floor 1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Server Room',
    position: 'IT Department',
    type: 'Face Recognition',
    location: 'Basement Floor',
    status: 'active'
  },
  {
    id: '3',
    name: 'Executive Office',
    position: 'Top Floor',
    type: 'Dual Authentication',
    location: 'Floor 10',
    status: 'active'
  },
  {
    id: '4',
    name: 'R&D Lab',
    position: 'Research Wing',
    type: 'Fingerprint Scanner',
    location: 'Floor 5',
    status: 'maintenance'
  },
  {
    id: '5',
    name: 'Storage Room',
    position: 'Warehouse',
    type: 'Card Reader',
    location: 'Basement Floor 2',
    status: 'inactive'
  },
];

// Mock Permissions
export const permissions: Permission[] = [
  {
    id: '1',
    userIds: ['1', '2'],
    deviceIds: ['1', '2'],
    startTime: currentDate,
    endTime: tomorrow,
    createdAt: currentDate,
  },
  {
    id: '2',
    userIds: ['3'],
    deviceIds: ['3'],
    startTime: currentDate,
    endTime: nextWeek,
    createdAt: currentDate,
  },
  {
    id: '3',
    userIds: ['4', '5'],
    deviceIds: ['4', '5'],
    startTime: tomorrow,
    endTime: nextWeek,
    createdAt: currentDate,
  },
];

// Mock Schedules
export const schedules: Schedule[] = [
  {
    id: '1',
    userId: '1',
    deviceId: '1',
    startTime: currentDate,
    endTime: tomorrow,
  },
  {
    id: '2',
    userId: '2',
    deviceId: '2',
    startTime: currentDate,
    endTime: nextWeek,
  },
  {
    id: '3',
    userId: '3',
    deviceId: '3',
    startTime: tomorrow,
    endTime: nextWeek,
  },
];

// Mock credentials for login
export const credentials = {
  username: 'admin',
  password: 'admin123',
}; 