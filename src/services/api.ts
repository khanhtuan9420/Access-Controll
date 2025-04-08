import axios from 'axios';
import { User, Device, Schedule, Permission, LoginCredentials } from '../types';
import { users, schedules, permissions } from '../mocks/data';
import { v4 as uuidv4 } from 'uuid';

// Delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const THINGSBOARD_HOST = "http://18.142.251.211:8080"; 


const getToken = () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Chưa đăng nhập hoặc token không tồn tại");
  }
  return token;
}

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
      // Lưu token vào sessionStorage
      sessionStorage.setItem("token", loginResponse.data.token || "");
      
      const userResponse = await axios.get(url_user_info, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });

      let fullName = userResponse.data.firstName + " " + userResponse.data.lastName;
      
      return {
        user: {
          id: userResponse.data.id.id,
          username: userResponse.data.name,
          name: fullName === " " ? fullName : userResponse.data.name,
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

  //   const token = getToken();

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
    const token = getToken();
    
    const url_devices = `${THINGSBOARD_HOST}/api/tenant/deviceInfos`; // API lấy danh sách thiết bị
    
    try {
      const response = await axios.get(url_devices, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
        params: { pageSize, page }, 
      });
      
      const deviceList = response.data.data;

          // Lấy telemetry location cho từng thiết bị
      const devicesWithTelemetry: Device[] = await Promise.all(
        deviceList.map(async (device: any) => {
          const telemetryUrl = `${THINGSBOARD_HOST}/api/plugins/telemetry/DEVICE/${device.id.id}/values/timeseries?keys=location`;

          try {
            const telemetryRes = await axios.get(telemetryUrl, {
              headers: {
                "Content-Type": "application/json",
                "X-Authorization": `Bearer ${token}`,
              },
            });

            const location = telemetryRes.data.location?.[0]?.value || "Unknown";

            return {
              id: device.id.id,
              name: device.name,
              type: device.type,
              location,
              status: device.active ? "Active" : "Inactive",
            };
          } catch (telemetryError) {
            // Trường hợp không lấy được telemetry, fallback lại giá trị mặc định
            return {
              id: device.id.id,
              name: device.name,
              type: device.type,
              location: "Unknown",
              status: device.active ? "Active" : "Inactive",
            };
          }
        })
      );

      return devicesWithTelemetry;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi lấy danh sách thiết bị");
    }
  },
  
  getDeviceProfiles: async ( pageSize: number = 10, page: number = 0,) => {
    const token = getToken();
    const url = `${THINGSBOARD_HOST}/api/deviceProfileInfos`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
        params: { pageSize, page }, 
      });

      return response.data.data.map((profile: any) => ({
        id: profile.id.id,
        name: profile.name
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định khi lấy danh sách device profile");
    }
  },
  
  createDevice: async (deviceData: Omit<Device, 'id'>): Promise<Device> => {


    const token = getToken();

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

    const token = getToken();
    const url_credential = `${THINGSBOARD_HOST}/api/device/${id}/credentials`;

    try {
      const response_access_token = await axios.get(url_credential, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });

      let access_token = response_access_token.data.credentialsId;
      const url_update = `${THINGSBOARD_HOST}/api/device?accessToken=${access_token}`;

      let data = {
        id: {
          id: id,
          entityType: "DEVICE"
        },
        name: deviceData.name,
        type: deviceData.type,
        location: deviceData.location || "Unknown",
        status: "Active",  

      }

      const response = await axios.post(url_update, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
      });

      const updatedDevice: Device = {
        id: response.data.id.id,
        name: response.data.name,
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

    const token = getToken();
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
    // const token = getToken("token");
  
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
  
  },

  uploadPermissions: async (formData: FormData): Promise<void> => {
    await delay(300);
    // TODO: Implement actual API call
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   throw new Error("Chưa đăng nhập hoặc token không tồn tại");
    // }
    // const url = `${THINGSBOARD_HOST}/api/permissions/upload`;
    // try {
    //   await axios.post(url, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       "X-Authorization": `Bearer ${token}`,
    //     },
    //   });
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.message || "Lỗi không xác định khi upload file");
    // }
  },

  deletePermission: async (id: string): Promise<void> => {
    await delay(300);
    const index = permissions.findIndex(permission => permission.id === id);
    if (index === -1) {
      throw new Error('Permission not found');
    }
    permissions.splice(index, 1);
  //   const token = getToken("token");
  
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