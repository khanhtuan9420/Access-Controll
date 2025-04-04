import axios from 'axios';
import { User, Device, Schedule, Permission, LoginCredentials } from '../types';
import { users, devices, schedules, permissions, credentials } from '../mocks/data';
import { v4 as uuidv4 } from 'uuid';

// Delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const THINGSBOARD_HOST = "http://18.142.251.211:8080"; 

// Auth service
export const authService = {
  login: async (loginData: LoginCredentials) => {
    const url_login = `${THINGSBOARD_HOST}/api/auth/login`;
    const url_user_info = `${THINGSBOARD_HOST}/api/auth/user`; // API lấy thông tin người dùng
    
    try {
      const loginResponse = await axios.post(url_login, {
        username: loginData.username,
        password: loginData.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      let token = loginResponse.data.token;
      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      
      const userResponse = await axios.get(url_user_info, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });
      
      return {
        user: {
          id: userResponse.data.id.id,
          username: userResponse.data.name,
          name: userResponse.data.firstName + " " + userResponse.data.lastName,
          idNumber: userResponse.data.idNumber || "UNKNOWN",
        },
        token: token,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi đăng nhập");
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

  // getUsers: async (pageSize: number, page: number) => {

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     throw new Error("Chưa đăng nhập hoặc token không tồn tại");
  //   }
  //   const url_users = `${THINGSBOARD_HOST}/api/users`; // API lấy danh sách người dùng
    
  //   try {
  //     const response = await axios.get(url_users, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Authorization": `Bearer ${token}`,
  //       },
  //       params: {
  //         pageSize,
  //         page
  //       },
  //     });
      
  //     console.log(response)
  //     return response.data.data || [];
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || "Lỗi không xác định khi lấy danh sách người dùng");
  //   }
  // },
  
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
  // getDevices: async (): Promise<Device[]> => {
  //   await delay(300);
  //   return [...devices];
  // },

  getDevices: async (pageSize: number = 10, page: number = 0) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    }
    
    const url_devices = `${THINGSBOARD_HOST}/api/tenant/devices`; // API lấy danh sách thiết bị
    
    try {
      const response = await axios.get(url_devices, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
        params: { pageSize, page }, 
      });

      // Ánh xạ dữ liệu từ API thành định dạng phù hợp với Device
      const devices: Device[] = response.data.data.map((device: any) => ({
        id: device.id.id, // Lấy id thiết bị từ đối tượng id
        name: device.name, // Lấy tên thiết bị
        position: "Unknown", // Cung cấp thông tin vị trí nếu có, nếu không có thể gán mặc định
        type: device.type, // Lấy loại thiết bị
        location: "Unknown", // Cung cấp thông tin vị trí nếu có
        status: "Active", // Trạng thái có thể là "Active" hoặc một giá trị khác
      }));

      return devices;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi lấy danh sách thiết bị");
    }
  },
  
  getDeviceById: async (id: string): Promise<Device | undefined> => {
    await delay(300);
    return devices.find(device => device.id === id);
  },
  
  createDevice: async (deviceData: Omit<Device, 'id'>): Promise<Device> => {
    // await delay(300);
    // const newDevice: Device = {
    //   id: uuidv4(),
    //   ...deviceData,
    // };
    // devices.push(newDevice);
    // return newDevice;

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    }

    const url = `${THINGSBOARD_HOST}/api/device`;

    try {
      const response = await axios.post(url, deviceData, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        }, 
      });

      const newDevice: Device = {
        id: response.data.id.id,
        name: response.data.name,
        position: deviceData.position || "Unknown",
        type: deviceData.type,
        location: deviceData.location || "Unknown",
        status: "Active", // Trạng thái mặc định là "Active", có thể thay đổi tùy theo dữ liệu trả về
      };

      console.log(response)

      return newDevice;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi tạo thiết bị");
    }
  },
  
  updateDevice: async (id: string, deviceData: Partial<Device>): Promise<Device> => {
    // await delay(300);
    // const index = devices.findIndex(device => device.id === id);
    // if (index === -1) {
    //   throw new Error('Device not found');
    // }
    // const updatedDevice = { ...devices[index], ...deviceData };
    // devices[index] = updatedDevice;
    // return updatedDevice;

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    }
    const url_credential = `${THINGSBOARD_HOST}/api/device/${id}/credentials`;


    try {
      const response_access_token = await axios.get(url_credential, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });

      console.log(response_access_token)

      let access_token = response_access_token.data.credentialsId;
      const url_update = `${THINGSBOARD_HOST}/api/device?accessToken=${access_token}`;

      const response = await axios.post(url_update, deviceData, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });

      const updatedDevice: Device = {
        id: response.data.id.id,
        name: response.data.name,
        position: deviceData.position || response.data.additionalInfo?.position || "Unknown",
        type: deviceData.type || response.data.type,
        location: deviceData.location || response.data.additionalInfo?.location || "Unknown",
        status: "Active",  // Có thể thay đổi tùy vào logic bạn sử dụng
      };

      return updatedDevice;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi cập nhật thiết bị");
    }
  },
  
  deleteDevice: async (id: string): Promise<void> => {
  //   await delay(300);
  //   const index = devices.findIndex(device => device.id === id);
  //   if (index === -1) {
  //     throw new Error('Device not found');
  //   }
  //   devices.splice(index, 1);
  // },

  const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    }

    const url = `${THINGSBOARD_HOST}/api/device/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi xóa thiết bị");
    }
  },
};

// Permission service
export const permissionService = {
  getPermissions: async (): Promise<Permission[]> => {
    await delay(300);
    return [...permissions];
    // const token = localStorage.getItem("token");
  
    // if (!token) {
    //   throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    // }
  
    // const url = `${THINGSBOARD_HOST}/api/permissions`; // URL API lấy danh sách quyền
    
    // try {
    //   const response = await axios.get(url, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Authorization": `Bearer ${token}`,
    //     },
    //   });
  
    //   return response.data || []; // Trả về dữ liệu từ API
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.message || "Lỗi không xác định khi lấy danh sách quyền");
    // }
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
    // const token = localStorage.getItem("token");
  
    // if (!token) {
    //   throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    // }
  
    // const url = `${THINGSBOARD_HOST}/api/permissions`; // URL API tạo quyền
  
    // try {
    //   const response = await axios.post(url, {
    //     userIds,
    //     deviceIds,
    //     startTime,
    //     endTime,
    //   }, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Authorization": `Bearer ${token}`,
    //     },
    //   });
  
    //   return response.data; // Trả về dữ liệu của quyền vừa tạo
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.message || "Lỗi không xác định khi tạo quyền");
    // }
  },

  deletePermission: async (id: string): Promise<void> => {
    await delay(300);
    const index = permissions.findIndex(permission => permission.id === id);
    if (index === -1) {
      throw new Error('Permission not found');
    }
    permissions.splice(index, 1);
  //   const token = localStorage.getItem("token");
  
  //   if (!token) {
  //     throw new Error("Chưa đăng nhập hoặc token không tồn tại");
  //   }
  
  //   const url = `${THINGSBOARD_HOST}/api/permissions/${id}`; // URL API xóa quyền
  
  //   try {
  //     await axios.delete(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Authorization": `Bearer ${token}`,
  //       },
  //     });
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || "Lỗi không xác định khi xóa quyền");
  //   }
  },
}; 