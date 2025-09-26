"use client";
import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SIPCalculatorStandalone() {
  const [code, setCode] = useState(100001);
  const [amount, setAmount] = useState(5000);
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState("2023-12-31");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/scheme/${code}/sip`, {
        amount,
        from,
        to
      });
      setResult(res.data);
    } catch (err) {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5">SIP Calculator</Typography>
      <CardContent>
        <TextField label="Scheme Code" type="number" value={code} onChange={e => setCode(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" value={to} onChange={e => setTo(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleCalculate} disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Calculating..." : "Calculate Returns"}
        </Button>
        {result && (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography>Total Invested: ₹{result.totalInvested}</Typography>
            <Typography>Current Value: ₹{result.currentValue}</Typography>
            <Typography>Total Units: {result.totalUnits}</Typography>
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
      </CardContent>
    </Card>
  );
}
