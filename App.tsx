import React, { useState, useEffect } from 'react';
import { User } from './types';
import { StorageService } from './services/storage';
import { Login } from './views/Login';
import { StudentDashboard } from './views/StudentDashboard';
import { OwnerDashboard } from './views/OwnerDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { Navbar } from './components/Navbar';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const initApp = async () => {
      // Check dark mode preference
      const isDark = localStorage.getItem('theme') === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }

      // Initialize session listener for cross-network/localhost browser syncing
      const { auth, db } = await import('./services/firebase');
      const { getDoc, doc } = await import('firebase/firestore');
      const { onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists()) {
              setUser(userDoc.data() as User);
            } else {
              const storedUser = await StorageService.getUser();
              setUser(storedUser || null);
            }
          } catch (error) {
            console.warn("Firestore read failed, falling back to local session.", error);
            const storedUser = await StorageService.getUser();
            setUser(storedUser || null);
          }
        } else {
          // Fallback to local storage if not firebase logged in
          const storedUser = await StorageService.getUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
    };

    initApp();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    StorageService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-sans pb-20 transition-colors duration-200">
      <Navbar user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main>
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'student' && <StudentDashboard />}
        {user.role === 'owner' && <OwnerDashboard user={user} />}
      </main>
    </div>
  );
}

export default App;