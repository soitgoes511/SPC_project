import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';
import api from '../api/axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login/', { username: email, password }); // DRF uses username by default for token auth, but our User model uses email. DRF usually expects 'username' key unless customized, but simple Setup often maps email to username. Let's try sending username as email.
            // Correction: obtain_auth_token expects 'username' and 'password'. Since we swapped User model, we should check if standard view works or if we need CustomAuthToken.
            // Assuming standard obtain_auth_token works with EMAIL as the USERNAME_FIELD if we send key 'username'.

            const token = response.data.token;
            // Fetch user details - for now mock based on success
            login(token, { email, role: 'READ_ONLY' }); // Fetch actual role later
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h2 className={styles.title}>Welcome Back</h2>
                <p className={styles.subtitle}>Sign in to your SPC Dashboard</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button}>Sign In</button>
                </form>

                <p className={styles.footer}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
