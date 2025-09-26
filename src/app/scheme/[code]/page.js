'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SIPCalculator from '../../../components/SIPCalculator';

export default function SchemePage() {
    const { code } = useParams();
    const [scheme, setScheme] = useState(null);
    const [navData, setNavData] = useState([]);
    const [returns, setReturns] = useState(null);

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

        async function fetchReturns() {
            try {
                const periods = ['1m', '3m', '6m', '1y'];
                const results = await Promise.all(periods.map(period =>
                    axios.get(`/api/scheme/${code}/returns?period=${period}`)
                ));
                setReturns(results.map((r, i) => ({
                    period: periods[i],
                    ...r.data
                })));
            } catch (err) {
                console.error(err);
            }
        }

        fetchScheme();
        fetchReturns();
    }, [code]);

    if (!scheme) return <Typography>Loading scheme...</Typography>;

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4">{scheme.scheme_name}</Typography>
            <Typography variant="body1">
                {scheme.scheme_type} | {scheme.scheme_category}
            </Typography>

            {/* ISIN info */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Fund House: {scheme.fund_house}</Typography>
                {scheme.isin_div_payout && <Typography variant="body2">ISIN Div Payout: {scheme.isin_div_payout}</Typography>}
                {scheme.isin_div_reinvestment && <Typography variant="body2">ISIN Div Reinvestment: {scheme.isin_div_reinvestment}</Typography>}
                {scheme.isin_growth && <Typography variant="body2">ISIN Growth: {scheme.isin_growth}</Typography>}
            </Box>

            {/* Returns Table */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Pre-computed Returns</Typography>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Period</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Start NAV</TableCell>
                                <TableCell>End NAV</TableCell>
                                <TableCell>Simple Return (%)</TableCell>
                                <TableCell>Annualized Return (%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {returns && returns.map(r => (
                                <TableRow key={r.period}>
                                    <TableCell>{r.period}</TableCell>
                                    <TableCell>{r.startDate}</TableCell>
                                    <TableCell>{r.endDate}</TableCell>
                                    <TableCell>{r.startNAV}</TableCell>
                                    <TableCell>{r.endNAV}</TableCell>
                                    <TableCell>{r.simpleReturn}</TableCell>
                                    <TableCell>{r.annualizedReturn ?? '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

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
