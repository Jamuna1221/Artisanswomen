import { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginAdmin, 
  verifyAdminOtp, 
  resendAdminOtp, 
  getProfile 
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const profile = await getProfile();
          setAdmin(profile);
        } catch (err) {
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (credentials) => {
    const data = await loginAdmin(credentials);
    // If it's a multi-step login, we don't save token yet
    if (data.requiresOTP) return data;
    
    // Fallback or direct login support
    localStorage.setItem('adminToken', data.token);
    setAdmin(data);
    return data;
  };

  const verifyOtpLogin = async (otpData) => {
    const data = await verifyAdminOtp(otpData);
    localStorage.setItem('adminToken', data.token);
    setAdmin(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      login, 
      verifyOtpLogin, 
      resendAdminOtp,
      logout, 
      isAuthenticated: !!admin, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
