import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { User } from '../../types';

interface UserDetailsProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({ open, onClose, user }) => {
  if (!user) {
    return null;
  }

  // Default image for fingerprint if not available
  const defaultFingerprint = "https://img.freepik.com/premium-vector/fingerprint-icon-fingerprint-symbol-identity-sensor-id-biometric-authorization-system_97458-240.jpg";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết người dùng</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.faceImage}
            alt={user.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Typography variant="h5" component="h2">
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.username}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={user.faceImage || "https://via.placeholder.com/200?text=No+Face+Image"}
                alt="Ảnh khuôn mặt"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Ảnh khuôn mặt
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={user.fingerPrint || defaultFingerprint}
                alt="Vân tay"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  Ảnh vân tay
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Paper sx={{ p: 2 }}>
          <List>
            <ListItem>
              <ListItemText
                primary="ID Number"
                secondary={user.idNumber}
                primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                secondaryTypographyProps={{ variant: 'body1' }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Mã vân tay"
                secondary={user.fingerPrint || 'Chưa có thông tin'}
                primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                secondaryTypographyProps={{ variant: 'body1' }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Lịch trình"
                secondary={user.schedule && user.schedule.length > 0 ? `${user.schedule.length} lịch trình` : 'Chưa có lịch trình'}
                primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                secondaryTypographyProps={{ variant: 'body1' }}
              />
            </ListItem>
          </List>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetails; 