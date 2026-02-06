import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LineChart, Settings, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <LineChart className={styles.logoIcon} />
                    <span>SPC I4.0</span>
                </div>

                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/charts" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        <LineChart size={20} />
                        <span>SPC Charts</span>
                    </NavLink>

                    {/* Admin Only Links - checking role somewhat loosely for now */}
                    {user?.role !== 'READ_ONLY' && (
                        <>
                            <NavLink to="/datasources" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                                <Settings size={20} />
                                <span>Data Sources</span>
                            </NavLink>
                            <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                                <Users size={20} />
                                <span>Admin Panel</span>
                            </NavLink>
                        </>
                    )}

                    <div className={styles.spacer} />

                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
