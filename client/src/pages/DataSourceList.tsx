import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Database, Trash2, Activity } from 'lucide-react';
import api from '../api/axios';
import styles from './DataSources.module.css';

interface DataSource {
    id: number;
    name: string;
    engine: string;
    host: string;
    database_name: string;
    is_active: boolean;
}

const DataSourceList: React.FC = () => {
    const [sources, setSources] = useState<DataSource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        try {
            const response = await api.get('/spc/datasources/');
            setSources(response.data);
        } catch (error) {
            console.error('Error fetching data sources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this data source?')) {
            try {
                await api.delete(`/spc/datasources/${id}/`);
                setSources(sources.filter(s => s.id !== id));
            } catch (error) {
                alert('Failed to delete data source');
            }
        }
    };

    const handleTest = async (id: number) => {
        try {
            const response = await api.post(`/spc/datasources/${id}/test_connection/`);
            if (response.data.success) {
                alert('Connection Successful!');
            } else {
                alert(`Connection Failed: ${response.data.message}`);
            }
        } catch (error) {
            alert('Error testing connection');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Data Sources</h1>
                <Link to="/datasources/new" className={styles.addButton}>
                    <Plus size={18} />
                    Add Data Source
                </Link>
            </div>

            <div className={styles.grid}>
                {sources.map(source => (
                    <div key={source.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>{source.name}</div>
                            <span className={styles.badge}>{source.engine}</span>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.detailRow}>
                                <span>Host:</span>
                                <span>{source.host}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Database:</span>
                                <span>{source.database_name}</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={() => handleTest(source.id)} className={styles.actionBtn} title="Test Connection">
                                <Activity size={16} /> Test
                            </button>
                            <button onClick={() => handleDelete(source.id)} className={styles.deleteBtn} title="Delete">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataSourceList;
