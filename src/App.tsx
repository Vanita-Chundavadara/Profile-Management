import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import ProfileForm from './components/ProfileComponent/ProfileForm';
import ProfileList from './components/ProfileComponent/ProfileList';
import { ProfileProvider } from './context/ProfileContext';
import NotFound from './components/NotFound/NotFound';
import "./assets/css/style.css"

const App: React.FC = () => {
  return (
    <ProfileProvider>
    <Router>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfileList />} />
          <Route path="/profile-form" element={<ProfileForm />} />
          <Route path="/profile-form/edit/:id" element={<ProfileForm />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Suspense>
    </Router>
    </ProfileProvider>
  );
};

export default App;
