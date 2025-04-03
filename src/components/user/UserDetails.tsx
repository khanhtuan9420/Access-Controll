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