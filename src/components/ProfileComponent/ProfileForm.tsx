import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useProfileContext } from '../../context/ProfileContext';
import { saveProfile, fetchProfileById } from '../../utils/api';

interface FormValues {
  name: string;
  email: string;
  age: number | null;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required.')
    .min(3, 'Name must be at least 3 characters long.'),
  email: Yup.string()
    .required('Email is required.')
    .email('Email is not valid.'),
  age: Yup.number()
    .nullable() 
    .min(1, 'Age must be at least 1.')
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .typeError('Age must be a number.'),
});

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useProfileContext();
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      age: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const savedProfile = await saveProfile({ ...values, id });

        if (id) {
          dispatch({ type: 'UPDATE_PROFILE', payload: savedProfile });
          setMessage('Profile updated successfully!');
        } else {
          dispatch({ type: 'SET_PROFILE', payload: [...state.users, savedProfile] });
          setMessage('Profile created successfully!');
        }

        setOpenSnackbar(true);
        navigate('/profile');
      } catch (error) {
        setSubmitError('Failed to save the profile.');
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userData = await fetchProfileById(id);
          formik.resetForm({
            values: {
              name: userData.name,
              email: userData.email,
              age: userData.age,
            },
          });
        } catch {
          setSubmitError('Failed to fetch user data.');
        }
      }
    };
    fetchUserData();
  }, [id]); 

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Custom handleChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'age') {
      formik.setFieldValue(name, value === '' ? null : Number(value));
    } else {
      formik.setFieldValue(name, value);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ width: { xs: '100%', sm: '60%', md: '70%' }, p: 2, border: '1px solid #ccc', borderRadius: '8px', boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>{id ? 'Edit Profile' : 'Add Profile'}</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={handleChange} 
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formik.values.age !== null ? formik.values.age : ''}
            onChange={handleChange} 
            onBlur={formik.handleBlur}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
            fullWidth
            margin="normal"
          />
          {submitError && (
            <Typography color="error" variant="body2">{submitError}</Typography>
          )}
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
            {id ? 'Update' : 'Create'}
          </Button>
        </form>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileForm;
