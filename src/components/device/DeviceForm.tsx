import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Device } from '../../types';
import { deviceService } from '../../services/api';

interface DeviceProfile {
  id: string;
  name: string;
}

interface DeviceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string | null, deviceData: any) => void;
  device: Device | null;
  isEditing: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ open, onClose, onSubmit, device, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    position: '',
    location: '',
    status: 'active',
  });
  const [deviceProfiles, setDeviceProfiles] = useState<DeviceProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeviceProfiles = async () => {
      try {
        const profiles = await deviceService.getDeviceProfiles();
        setDeviceProfiles(profiles);
      } catch (error) {
        console.error('Error fetching device profiles:', error);
      }
    };

    fetchDeviceProfiles();
  }, []);

  useEffect(() => {
    if (device && isEditing) {
      setFormData({
        name: device.name,
        position: device.position,
        type: device.type || '',
        location: device.location || '',
        status: device.status || 'active',
      });
    } else {
      // Reset the form when adding a new device
      setFormData({
        name: '',
        position: '',
        type: '',
        location: '',
        status: 'active',
      });
    }
  }, [device, isEditing]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(isEditing && device ? device.id : null, formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Tên thiết bị"
              name="name"
              autoFocus
              value={formData.name}
              onChange={handleTextFieldChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="device-type-label">Loại thiết bị</InputLabel>
              <Select
                labelId="device-type-label"
                value={formData.type}
                label="Loại thiết bị"
                onChange={handleSelectChange}
              >
                {deviceProfiles.map((profile) => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="position"
              label="Vị trí sử dụng"
              name="position"
              value={formData.position}
              onChange={handleTextFieldChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label="Vị trí lắp đặt"
              name="location"
              value={formData.location}
              onChange={handleTextFieldChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label="Trạng thái"
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceForm; 