import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import NotFound from './pages/NotFound';
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components for performance
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const MagicItemShop = lazy(() => import('./pages/MagicItemShop'));
const ComponentDealer = lazy(() => import('./pages/ComponentDealer'));
const GeneralStore = lazy(() => import('./pages/GeneralStore'));
const AlchemistShop = lazy(() => import('./pages/AlchemistShop'));
const WeaverShop = lazy(() => import('./pages/WeaverShop'));
const BlacksmithShop = lazy(() => import('./pages/BlacksmithShop'));
const ExoticAnimalTraderShop = lazy(() => import('./pages/ExoticAnimalTraderShop'));
const Account = lazy(() => import('./pages/Account'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />

            {/* Store Pages */}
            <Route path="/store/general-store" element={<GeneralStore />} />
            <Route path="/store/magic-item-shop" element={<MagicItemShop />} />
            <Route path="/store/component-dealer" element={<ComponentDealer />} />
            <Route path="/store/alchemist" element={<AlchemistShop />} />
            <Route path="/store/weaver" element={<WeaverShop />} />
            <Route path="/store/blacksmith" element={<BlacksmithShop />} />
            <Route path="/store/exotic-animal-trader" element={<ExoticAnimalTraderShop />} />
          </Route>

          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
