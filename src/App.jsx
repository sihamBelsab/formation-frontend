// import icon
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';

import Dashboard from './pages/Dashboard';

import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { userApi } from './api'; // Updated to use new centralized API
import GestionComptes from './pages/GestionComptes';
import GestionForma from './pages/GestionForma';
import SideBar from './components/navigation/SideBar';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import GestionEmployee from './pages/GestionEmployee';
import Gestionbesoins from './pages/Gestionbesoins';
import Structure from './pages/Structure';
import Intervenants from './pages/Intervenants';
import GestionPlanServiceFormation from './pages/EtablirPlan';
import ValidationPlans from './pages/ValidationPlans';
import EvaluationChaud from './pages/EvaluationChaud';
import EvaluationFroid from './pages/EvaluationFroid';

const PrivateRoute = ({ loggedIn }) => {
  return loggedIn ? <Outlet /> : <Navigate to='/login' replace />;
};

const LoggedInLayout = ({ userInfo, setUserInfo }) => (
  <>
    <Header userInfo={userInfo} setUserInfo={setUserInfo} />
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '60px', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        <SideBar userInfo={userInfo} />
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  </>
);

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true' || false);
  const [userInfo, setUserInfo] = useState({});

  const saveUserInfo = async () => {
    try {
      const response = await userApi.getLoggedInUser();
      if (response.data.success === true) {
        setUserInfo(response.data.data);
      } else {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        setLoggedIn(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching logged in user:', error);
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('user');
      setLoggedIn(false);
      window.location.href = '/login';
    }
  };
  console.log(userInfo);
  useEffect(() => {
    if (loggedIn) {
      saveUserInfo();
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  return (
    <Routes>
      {/* 🔓 Public route */}
      <Route path='/login' element={loggedIn ? <Navigate to='/' replace /> : <Login />} />

      {/* 🔒 Private routes */}
      <Route element={<PrivateRoute loggedIn={loggedIn} />}>
        <Route element={<LoggedInLayout userInfo={userInfo} setUserInfo={setUserInfo} />}>
          <Route path='/' element={<Dashboard userInfo={userInfo} />} />
          <Route path='/gestion-comptes' element={<GestionComptes userInfo={userInfo} />} />
          <Route path='/gestion-employes' element={<GestionEmployee userInfo={userInfo} />} />
          <Route path= '/evaluation-froid' element={<EvaluationFroid userInfo={userInfo} />} />
          <Route path='/gestion-besoins' element={<Gestionbesoins userInfo={userInfo} />} />
          <Route path='/gestion-formations' element={<GestionForma userInfo={userInfo} />} />
          <Route path='/gestion-structure' element={<Structure userInfo={userInfo} />} />
          <Route path='/gestion-formateurs' element={<Intervenants userInfo={userInfo} />} />
          <Route path='/Etablir-plan' element={<GestionPlanServiceFormation userInfo={userInfo} />}  />
          <Route path='/valider-plan' element={<ValidationPlans userInfo={userInfo} />} />
          <Route path='/evaluation-chaud' element={<EvaluationChaud userInfo={userInfo} />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default App;
