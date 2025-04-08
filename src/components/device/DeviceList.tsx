import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Fab,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  TablePagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Device } from '../../types';
import { deviceService } from '../../services/api';
import DeviceForm from '../../components/device/DeviceForm';

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await deviceService.getDevices(rowsPerPage, page);
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleOpenForm = (edit = false, device: Device | null = null) => {
    setIsEditing(edit);
    setCurrentDevice(device);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentDevice(null);
    setIsEditing(false);
  };

  const handleOpenDeleteConfirm = (device: Device) => {
    setCurrentDevice(device);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setCurrentDevice(null);
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFormSubmit = (id: string | null, deviceData: any) => {
    if (id) {
      handleUpdateDevice(id, deviceData);
    } else {
      handleAddDevice(deviceData);
    }
  };

  const handleAddDevice = async (deviceData: Omit<Device, 'id'>) => {
    try {
      await deviceService.createDevice(deviceData);
      fetchDevices();
      handleCloseForm();
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const handleUpdateDevice = async (id: string, deviceData: Partial<Device>) => {
    try {
      await deviceService.updateDevice(id, deviceData);
      fetchDevices();
      handleCloseForm();
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const handleDeleteDevice = async () => {
    if (!currentDevice) return;
    
    try {
      await deviceService.deleteDevice(currentDevice.id);
      fetchDevices();
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleReload = async () => {
    setLoading(true);
    try {
      const data = await deviceService.getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Error reloading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - devices.length) : 0;
  const paginatedDevices = devices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý thiết bị
        </Typography>
        <Box>
          <IconButton 
            color="primary" 
            onClick={handleReload}
            sx={{ mr: 1 }}
          >
            <RefreshIcon />
          </IconButton>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => handleOpenForm(false, null)}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="devices table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên thiết bị</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Vị trí</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>{device.status}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenForm(true, device)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteConfirm(device)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
                {devices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dữ liệu thiết bị
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={devices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </Paper>
      )}

      {/* Device Form Dialog */}
      <DeviceForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        device={currentDevice}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thiết bị {currentDevice?.name} không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Hủy</Button>
          <Button onClick={handleDeleteDevice} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeviceList; 