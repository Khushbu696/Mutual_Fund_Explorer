"use client";
import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function LumpsumCalculator() {
  const [code, setCode] = useState(100001);
  const [amount, setAmount] = useState(10000);
  const [date, setDate] = useState("2020-01-01");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/scheme/${code}`);
      const navData = res.data.data;
      const startNavObj = navData.find(n => n.date === date) || navData[navData.length - 1];
      const startNAV = startNavObj.nav;
      const units = amount / startNAV;
      const latestNAV = navData[0].nav;
      const currentValue = units * latestNAV;
      const absoluteReturn = ((currentValue - amount) / amount) * 100;
      const years = (new Date(navData[0].date) - new Date(date)) / (1000 * 60 * 60 * 24 * 365.25);
      const annualizedReturn = ((currentValue / amount) ** (1 / years) - 1) * 100;
      setResult({
        totalInvested: amount,
        currentValue: parseFloat(currentValue.toFixed(2)),
        units: parseFloat(units.toFixed(4)),
        absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
        annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
        history: navData.map(n => ({ date: n.date, value: units * n.nav }))
      });
    } catch (err) {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5">Lumpsum Calculator</Typography>
      <CardContent>
        <TextField label="Scheme Code" type="number" value={code} onChange={e => setCode(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Investment Date" type="date" value={date} onChange={e => setDate(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleCalculate} disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Calculating..." : "Calculate"}
        </Button>
        {result && (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography>Total Invested: ₹{result.totalInvested}</Typography>
            <Typography>Current Value: ₹{result.currentValue}</Typography>
            <Typography>Units Purchased: {result.units}</Typography>
            <Typography>Absolute Return: {result.absoluteReturn}%</Typography>
            <Typography>Annualized Return: {result.annualizedReturn}%</Typography>
            <LineChart width={800} height={300} data={result.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#388e3c" />
            </LineChart>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
