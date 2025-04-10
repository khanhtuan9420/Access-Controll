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
  onSubmit: (deviceData: Omit<Device, 'id'>) => Promise<void>;
  device: Device | null;
  isEditing: boolean;
}

interface FormData {
  name: string;
  type: string;
  location: string;
  status: string;
  camStatus: string;
  rfidStatus: string;
  fingerPrintStatus: string;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ open, onClose, onSubmit, device, isEditing }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    location: '',
    status: 'Active',
    camStatus: 'Active',
    rfidStatus: 'Active',
    fingerPrintStatus: 'Active'
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
    if (device) {
      setFormData({
        name: device.name || '',
        type: device.type || '',
        location: device.location || '',
        status: device.status || 'Active',
        camStatus: device.camStatus || 'Active',
        rfidStatus: device.rfidStatus || 'Active',
        fingerPrintStatus: device.fingerPrintStatus || 'Active'
      });
    } else {
      setFormData({
        name: '',
        type: '',
        location: '',
        status: 'Active',
        camStatus: 'Active',
        rfidStatus: 'Active',
        fingerPrintStatus: 'Active'
      });
    }
  }, [device]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
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
                name = "type"
                labelId="device-type-label"
                value={formData.type}
                label="Loại thiết bị"
                onChange={handleSelectChange}
              >
                {deviceProfiles.map((profile) => (
                  <MenuItem key={profile.id} value={profile.name}>
                    {profile.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái Camera</InputLabel>
              <Select
                name="camStatus"
                value={formData.camStatus}
                onChange={handleSelectChange}
                label="Trạng thái Camera"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái RFID</InputLabel>
              <Select
                name="rfidStatus"
                value={formData.rfidStatus}
                onChange={handleSelectChange}
                label="Trạng thái RFID"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái Vân tay</InputLabel>
              <Select
                name="fingerPrintStatus"
                value={formData.fingerPrintStatus}
                onChange={handleSelectChange}
                label="Trạng thái Vân tay"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
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