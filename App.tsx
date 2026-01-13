
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Booking from './pages/Booking';
import Member from './pages/Member';
import Info from './pages/Info';
import POSDashboard from './pages/POSDashboard';

// 建立簡單的權限 Context
interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  setIsAdmin: () => {},
  userPhone: '',
  setUserPhone: () => {},
});

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, userPhone, setUserPhone }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/member" element={<Member />} />
            <Route path="/info" element={<Info />} />
            <Route path="/pos" element={isAdmin ? <POSDashboard /> : <Navigate to="/member" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
