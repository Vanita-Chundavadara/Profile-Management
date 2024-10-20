import React, { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Box,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
  Snackbar,
  Alert,
  DialogActions, 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileContext } from '../../context/ProfileContext';
import { deleteProfile, fetchProfile } from '../../utils/api';

const ProfileList: React.FC = () => {
  const { state, dispatch } = useProfileContext();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [profileIdToDelete, setProfileIdToDelete] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetchProfile();
      dispatch({ type: 'SET_PROFILE', payload: response.data });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [dispatch]);

  
  const handleDelete = async () => {
    if (profileIdToDelete !== null) {
      try {
        await deleteProfile(profileIdToDelete);
        dispatch({ type: 'DELETE_PROFILE', payload: profileIdToDelete });
        setSnackbarMessage('Profile deleted successfully!');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbarMessage('Failed to delete profile.');
        setOpenSnackbar(true);
      } finally {
        setOpenDialog(false);
        setProfileIdToDelete(null);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={4} align="center">
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '16px' }}>
          No profiles found. Please create one.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/profile-form')}
        >
          Create User
        </Button>
      </TableCell>
    </TableRow>
  );

  const renderUserRows = () => (
    state.users.map((user: any) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.age}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: '8px' }}
            component={Link}
            to={`/profile-form/edit/${user.id}`}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => {
              setProfileIdToDelete(user.id);
              setOpenDialog(true);
            }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ))
  );
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProfileIdToDelete(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom mt={2} textAlign='center'>
        Profile Management List
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2} mr={2}>
        {state.users.length ? (
          <Button
            variant="contained"
            component={Link}
            to="/profile-form"
          >
            Add User
          </Button>
        ) : null}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.users.length === 0 ? renderEmptyState() : renderUserRows()}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

       {/* Confirmation dialog box for delete */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>  );
};

export default React.memo(ProfileList);
