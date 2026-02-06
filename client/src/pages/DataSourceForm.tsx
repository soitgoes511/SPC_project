import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './DataSources.module.css';

const DataSourceForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        engine: 'MSSQL',
        host: '',
        port: 1433,
        database_name: '',
        username: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/spc/datasources/', formData);
            navigate('/datasources');
        } catch (error: any) {
            console.error('Error creating data source:', error);
            const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            alert(`Failed to create data source: ${msg}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title} style={{ marginBottom: '2rem' }}>New Data Source</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Name</label>
                    <input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. Line 1 MSSQL"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Engine</label>
                    <select
                        value={formData.engine}
                        onChange={e => setFormData({ ...formData, engine: e.target.value })}
                    >
                        <option value="MSSQL">MSSQL (2008 R2+)</option>
                        <option value="POSTGRES">PostgreSQL</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Host</label>
                    <input
                        value={formData.host}
                        onChange={e => setFormData({ ...formData, host: e.target.value })}
                        required
                        placeholder="IP or Hostname"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Port</label>
                    <input
                        type="number"
                        value={formData.port}
                        onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) })}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Database Name</label>
                    <input
                        value={formData.database_name}
                        onChange={e => setFormData({ ...formData, database_name: e.target.value })}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Username (Database)</label>
                    <input
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        required
                        autoComplete="off"
                        name="db_username_field_unique"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Password (Database)</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                        autoComplete="new-password"
                        name="db_password_field_unique"
                    />
                </div>

                <button type="submit" className={styles.addButton} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                    Create Data Source
                </button>
            </form>
        </div>
    );
};

export default DataSourceForm;
