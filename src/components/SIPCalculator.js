'use client';

import { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SIPCalculator({ code }) {
    const [amount, setAmount] = useState(5000);
    const [frequency, setFrequency] = useState('monthly');
    const [from, setFrom] = useState('2020-01-01');
    const [to, setTo] = useState('2023-12-31');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/scheme/${code}/sip`, {
                amount,
                frequency,
                from,
                to
            });
            setResult(res.data);
        } catch (err) {
            console.error('Error calculating SIP:', err);
        }
        setLoading(false);
    };

    return (
        <Card sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6">SIP Calculator</Typography>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <TextField
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
                <TextField
                    label="Frequency"
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                />
                <TextField
                    label="From"
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="To"
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={handleCalculate} disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate Returns'}
                </Button>
            </div>

            {result && (
                <Card sx={{ mt: 2, p: 2 }}>
                    <Typography>Total Invested: ₹{result.totalInvested}</Typography>
                    <Typography>Current Value: ₹{result.currentValue}</Typography>
                    <Typography>Absolute Return: {result.absoluteReturn}%</Typography>
                    <Typography>Annualized Return: {result.annualizedReturn}%</Typography>

                    <LineChart width={800} height={300} data={result.history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#f50057" />
                    </LineChart>
                </Card>
            )}
        </Card>
    );
}
