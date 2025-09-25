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
                const res = await axios.get('/api/mf'); // fetch from API route
                setFunds(res.data);
            } catch (err) {
                console.error('Error fetching funds:', err);
            }
            setLoading(false);
        }

        fetchFunds();
    }, []);

    // Filter funds by search term
    const filteredFunds = funds.filter(f =>
        f.scheme_name.toLowerCase().includes(search.toLowerCase())
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
                <Typography>Loading funds...</Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredFunds.length > 0 ? (
                        filteredFunds.map(f => (
                            <Grid item xs={12} sm={6} md={4} key={f.scheme_code}>
                                <FundCard fund={f} />
                            </Grid>
                        ))
                    ) : (
                        <Typography>No funds found.</Typography>
                    )}
                </Grid>
            )}
        </div>
    );
}
