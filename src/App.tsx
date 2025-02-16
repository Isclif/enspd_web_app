import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/Dashbord';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';

import RapportActivite from './pages/RapportActivite/RapportActivite';
import Departements from './pages/Departements/Departements';
import Enseignants from './pages/Enseignants/Enseignants';
import Etudiants from './pages/Etudiants/Etudiants';
import AuthUser from './components/AuthUser/AuthUser';
import GuestLayout from './layout/GuestLayout';
import NotFoundCo from './pages/NotFound/NotFoundCo';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const {getToken} = AuthUser();
  if(!getToken()){
    return <GuestLayout />
  }

  return loading ? (
    <Loader />
  ) : (
    <div>
      <DefaultLayout>
        <Routes>
          <Route
            path='/dashboard'
            element={
              <>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/departements"
            element={
              <>
                <PageTitle title="departements" />
                <Departements />
              </>
            }
          />
          <Route
            path="/enseignants"
            element={
              <>
                <PageTitle title="enseignants" />
                <Enseignants />
              </>
            }
          />
          <Route
            path="/etudiants"
            element={
              <>
                <PageTitle title="etudiants" />
                <Etudiants />
              </>
            }
          />
          <Route
            path="/rapport"
            element={
              <>
                <PageTitle title="rapport d'activité" />
                <RapportActivite />
              </>
            }
          />
          <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profil" />
              <Profile />
            </>
          }
        />
          {/* <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormLayout />
              </>
            }
          /> */}
          {/* <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>
            }
          /> */}
          <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
          {/* <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            }
          /> */}
          <Route path="*" element={ 
            <>
            <PageTitle title="Page not found" />
            <NotFoundCo />
            </>
            } 
          />
        </Routes>
      </DefaultLayout>
    </div>
  );
}

export default App;
