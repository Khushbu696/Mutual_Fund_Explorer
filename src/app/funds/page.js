'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, TextField, Typography, Box, Divider, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import FundCard from '../../components/FundCard';

export default function FundsPage() {
    const [funds, setFunds] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [house, setHouse] = useState('');

    useEffect(() => {
        async function fetchFunds() {
            setLoading(true);
            try {
                const res = await axios.get('/api/mf');
                // Map API data to expected keys for display
                const mapped = res.data.map(f => ({
                    scheme_code: f.schemeCode,
                    scheme_name: f.schemeName,
                    fund_house: f.fundHouse || 'Other',
                    scheme_category: f.schemeType || 'Other',
                    scheme_type: f.schemeType || 'Other',
                }));
                setFunds(mapped);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchFunds();
    }, []);


    // Get unique categories and fund houses for filters
    const categories = Array.from(new Set(funds.map(f => f.scheme_category).filter(Boolean))).sort();
    const houses = Array.from(new Set(funds.map(f => f.fund_house).filter(Boolean))).sort();

    // Filter funds by search, category, and house
    const filteredFunds = funds.filter(f => {
        const matchesSearch = f.scheme_name && f.scheme_name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? f.scheme_category === category : true;
        const matchesHouse = house ? f.fund_house === house : true;
        return matchesSearch && matchesCategory && matchesHouse;
    });

    // Show top 12 funds by default if no search/filter
    const showDefault = !search && !category && !house;
    const defaultFunds = showDefault ? funds.slice(0, 12) : [];

    // Group funds by fund house and category
    const grouped = {};
    (showDefault ? defaultFunds : filteredFunds).forEach(f => {
        const h = f.fund_house || 'Other';
        const c = f.scheme_category || 'Other';
        if (!grouped[h]) grouped[h] = {};
        if (!grouped[h][c]) grouped[h][c] = [];
        grouped[h][c].push(f);
    });

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Mutual Funds Explorer
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Search funds"
                    fullWidth
                    margin="normal"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{ maxWidth: 300 }}
                />
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        label="Category"
                        onChange={e => setCategory(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {categories.map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Fund House</InputLabel>
                    <Select
                        value={house}
                        label="Fund House"
                        onChange={e => setHouse(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {houses.map(h => (
                            <MenuItem key={h} value={h}>{h}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                Object.entries(grouped).map(([h, categories]) => (
                    <Box key={h} sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>{h}</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {Object.entries(categories).map(([c, schemes]) => (
                            <Box key={c} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>{c}</Typography>
                                <Grid container spacing={2}>
                                    {schemes.map(f => (
                                        <Grid item xs={12} sm={6} md={4} key={f.scheme_code}>
                                            <FundCard fund={f} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                ))
            )}
        </div>
    );
}
