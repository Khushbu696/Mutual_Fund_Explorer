'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, TextField, Typography } from '@mui/material';
import FundCard from '../../components/FundCard';

export default function FundsPage() {
    const [funds, setFunds] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchFunds() {
            setLoading(true);
            try {
                const res = await axios.get('/api/mf');
                setFunds(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchFunds();
    }, []);

    const filteredFunds = funds.filter(f =>
        f.scheme_name && f.scheme_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Mutual Funds Explorer
            </Typography>

            <TextField
                label="Search funds"
                fullWidth
                margin="normal"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredFunds.map(f => (
                        <Grid item xs={12} sm={6} md={4} key={f.scheme_code}>
                            <FundCard fund={f} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}
