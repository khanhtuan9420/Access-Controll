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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Device } from '../../types';

interface DeviceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string | null, data: Omit<Device, 'id'>) => void;
  device: Device | null;
  isEditing: boolean;
}

type DeviceInput = Omit<Device, 'id'>;

const DeviceForm: React.FC<DeviceFormProps> = ({ open, onClose, onSubmit, device, isEditing }) => {
  const [formData, setFormData] = useState<DeviceInput>({
    name: '',
    position: '',
    type: '',
    location: '',
    status: 'active',
  });

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
              id="type"
              label="Loại thiết bị"
              name="type"
              value={formData.type}
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditing ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceForm; 