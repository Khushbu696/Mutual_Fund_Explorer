"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";


export default function LumpsumCalculator() {
  const [code, setCode] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [amount, setAmount] = useState(10000);
  const [date, setDate] = useState("2020-01-01");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSchemes() {
      try {
        const res = await axios.get("/api/mf");
        setSchemes(res.data);
      } catch { }
    }
    fetchSchemes();
  }, []);

  const handleCalculate = async () => {
    if (!code) return;
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
      if (amount > 0 && units > 0) {
        setResult({
          totalInvested: amount,
          currentValue: parseFloat(currentValue.toFixed(2)),
          units: parseFloat(units.toFixed(4)),
          absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
          annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
          history: navData.map(n => ({ date: n.date, value: parseFloat((units * n.nav).toFixed(2)) }))
        });
      } else {
        setResult({ error: "No NAV data available for this scheme and date." });
      }
    } catch (err) {
  setResult({ error: "Calculation failed. Please try another scheme or date." });
}
setLoading(false);
  };

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5" color="primary">Lumpsum Calculator</Typography>
      <Card sx={{ mb: 4, background: '#fffde7' }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>Lumpsum Investment</Typography>
          <Typography variant="body1" gutterBottom>
            Calculate returns for a one-time investment in any mutual fund. See how your investment could have grown over time.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Tip:</b> Choose a scheme and date to simulate a lumpsum investment.
          </Typography>
        </CardContent>
      </Card>
      <CardContent>
        <FormControl sx={{ minWidth: 300, mr: 2 }}>
          <InputLabel>Scheme</InputLabel>
          <Select
            value={code}
            label="Scheme"
            onChange={e => setCode(e.target.value)}
          >
            <MenuItem value="">Select a scheme</MenuItem>
            {schemes.map(s => (
              <MenuItem key={s.schemeCode} value={s.schemeCode}>{s.schemeName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Investment Date" type="date" value={date} onChange={e => setDate(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleCalculate} disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Calculating..." : "Calculate"}
        </Button>
        {result && result.error && (
          <Alert severity="error" sx={{ mt: 2 }}>{result.error}</Alert>
        )}
        {result && !result.error && (
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
              <Line type="monotone" dataKey="value" stroke="#FFD700" />
            </LineChart>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
