import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './DataSources.module.css'; // Reusing styles for consistency

interface DataSource {
    id: number;
    name: string;
}

const ChartConfigForm: React.FC = () => {
    const navigate = useNavigate();
    const [dataSources, setDataSources] = useState<DataSource[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        data_source: '',
        table_name: '',
        value_column: '',
        datetime_column: '',
        product_column: 'Product',
        product_identifier: '',
        operation_column: 'Operation',
        operation_identifier: '',
        upper_spec_limit: '',
        lower_spec_limit: '',
        target: '',
        aggregation_type: 'TIME_HOUR',
        aggregation_size: 1
    });

    useEffect(() => {
        // Fetch available data sources
        const fetchSources = async () => {
            try {
                const res = await api.get('/spc/datasources/');
                setDataSources(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, data_source: res.data[0].id }));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchSources();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                // Convert empty strings to null for numbers or keep as is? 
                // DRF might complain if field is float and we send empty string.
                upper_spec_limit: formData.upper_spec_limit || null,
                lower_spec_limit: formData.lower_spec_limit || null,
                target: formData.target || null,
            }
            await api.post('/spc/charts/', payload);
            navigate('/charts');
        } catch (error) {
            console.error('Error creating chart:', error);
            alert('Failed to create chart configuration');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title} style={{ marginBottom: '2rem' }}>New SPC Chart</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Chart Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Diameter Control" />
                </div>

                <div className={styles.formGroup}>
                    <label>Data Source</label>
                    <select name="data_source" value={formData.data_source} onChange={handleChange} required>
                        <option value="" disabled>Select Source</option>
                        {dataSources.map(ds => <option key={ds.id} value={ds.id}>{ds.name}</option>)}
                    </select>
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Data Mapping</h3>

                <div className={styles.formGroup}>
                    <label>Table Name</label>
                    <input name="table_name" value={formData.table_name} onChange={handleChange} required placeholder="e.g. production_data" />
                </div>

                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label>Value Column</label>
                        <input name="value_column" value={formData.value_column} onChange={handleChange} required placeholder="e.g. measurement_val" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Timestamp Column</label>
                        <input name="datetime_column" value={formData.datetime_column} onChange={handleChange} required placeholder="e.g. created_at" />
                    </div>
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Filtering</h3>

                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label>Product Column</label>
                        <input name="product_column" value={formData.product_column} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Product Value (ID)</label>
                        <input name="product_identifier" value={formData.product_identifier} onChange={handleChange} placeholder="e.g. P-101" />
                    </div>
                </div>

                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label>Operation Column</label>
                        <input name="operation_column" value={formData.operation_column} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Operation Value (ID)</label>
                        <input name="operation_identifier" value={formData.operation_identifier} onChange={handleChange} placeholder="e.g. OP-20" />
                    </div>
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Limits</h3>

                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label>LSL (Lower)</label>
                        <input type="number" step="any" name="lower_spec_limit" value={formData.lower_spec_limit} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Target</label>
                        <input type="number" step="any" name="target" value={formData.target} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>USL (Upper)</label>
                        <input type="number" step="any" name="upper_spec_limit" value={formData.upper_spec_limit} onChange={handleChange} />
                    </div>
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Grouping</h3>

                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label>Aggregation Type</label>
                        <select name="aggregation_type" value={formData.aggregation_type} onChange={handleChange}>
                            <option value="TIME_HOUR">Hourly</option>
                            <option value="TIME_DAY">Daily</option>
                            <option value="COUNT">By Count</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Size / Interval</label>
                        <input type="number" name="aggregation_size" value={formData.aggregation_size} onChange={handleChange} />
                    </div>
                </div>

                <button type="submit" className={styles.addButton} style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}>
                    Create Chart
                </button>
            </form>
        </div>
    );
};

export default ChartConfigForm;
