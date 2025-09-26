'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Typography, Card } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SIPCalculator from '../../../components/SIPCalculator';

export default function SchemePage() {
    const { code } = useParams();
    const [scheme, setScheme] = useState(null);
    const [navData, setNavData] = useState([]);

    useEffect(() => {
        if (!code) return;

        async function fetchScheme() {
            try {
                const res = await axios.get(`/api/scheme/${code}`);
                setScheme(res.data.meta);

                const navs = res.data.data
                    .slice(-365)
                    .map(n => ({ date: n.date, nav: parseFloat(n.nav) }))
                    .reverse();

                setNavData(navs);
            } catch (err) {
                console.error(err);
            }
        }

        fetchScheme();
    }, [code]);

    if (!scheme) return <Typography>Loading scheme...</Typography>;

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4">{scheme.scheme_name}</Typography>
            <Typography variant="body1">
                {scheme.scheme_type} | {scheme.scheme_category}
            </Typography>

            <Card sx={{ mt: 3, p: 2 }}>
                <Typography variant="h6">NAV History (1 Year)</Typography>
                <LineChart width={800} height={300} data={navData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="nav" stroke="#1976d2" />
                </LineChart>
            </Card>

            <SIPCalculator code={code} />
        </div>
    );
}
