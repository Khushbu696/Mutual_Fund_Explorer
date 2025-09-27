"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const theme = createTheme({
  palette: {
    primary: { main: '#388e3c' }, // Green
  },
});

export default function SIPCalculatorStandalone() {
  const [code, setCode] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [amount, setAmount] = useState(5000);
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState("2023-12-31");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSchemes() {
      try {
        const res = await axios.get("/api/mf");
        setSchemes(res.data);
      } catch {}
    }
    fetchSchemes();
  }, []);

  const handleCalculate = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/scheme/${Number(code)}/sip`, {
        amount: Number(amount),
        from,
        to
      });
      if (res.data && res.data.totalInvested > 0) {
        setResult(res.data);
      } else {
        setResult({ error: "No NAV data available for this scheme and date range." });
      }
    } catch (err) {
      setResult({ error: "Calculation failed. Please try another scheme or date range." });
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" color="primary">SIP Calculator</Typography>
        <Card sx={{ mb: 4, background: '#e8f5e9' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>Systematic Investment Plan (SIP)</Typography>
            <Typography variant="body1" gutterBottom>
              SIP is a disciplined way to invest a fixed amount regularly in a mutual fund. Use this calculator to estimate your returns based on historical NAV data.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Tip:</b> Choose a scheme and date range to see how your investment could have grown!
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
          <TextField label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="To" type="date" value={to} onChange={e => setTo(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
          <Button variant="contained" onClick={handleCalculate} disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Calculating..." : "Calculate Returns"}
          </Button>
          {result && result.error && (
            <Alert severity="error" sx={{ mt: 2 }}>{result.error}</Alert>
          )}
          {result && !result.error && (
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
                <Line type="monotone" dataKey="value" stroke="#388e3c" />
              </LineChart>
            </Card>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
