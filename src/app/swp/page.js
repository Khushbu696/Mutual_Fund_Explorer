"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SWPCalculator() {
  const [code, setCode] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [initialAmount, setInitialAmount] = useState(10000);
  const [withdraw, setWithdraw] = useState(1000);
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState("2023-01-01");
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

  function getMonthlyDates(start, end) {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setMonth(current.getMonth() + 1);
    }
    return dates;
  }

  const handleCalculate = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/scheme/${code}`);
      const navData = res.data.data;
      const swpDates = getMonthlyDates(from, to);
      let units = 0;
      let history = [];
      let totalWithdrawn = 0;
      let finalValue = 0;
      // Find starting NAV
      const startNavObj = navData.find(n => n.date === swpDates[0]) || navData[navData.length - 1];
      if (!startNavObj) {
        setResult({ error: "No NAV data available for this scheme and date range." });
        setLoading(false);
        return;
      }
      const startNAV = startNavObj.nav;
      units = initialAmount / startNAV;
      let remainingUnits = units;
      swpDates.forEach(date => {
        // Find NAV for this date, fallback to closest previous date if not found
        let navObj = navData.find(n => n.date === date);
        if (!navObj) {
          // Find closest previous NAV
          navObj = navData.slice().reverse().find(n => n.date < date);
        }
        if (navObj && remainingUnits > 0) {
          const withdrawUnits = withdraw / navObj.nav;
          if (withdrawUnits <= remainingUnits) {
            remainingUnits -= withdrawUnits;
            totalWithdrawn += withdraw;
          } else {
            // Withdraw whatever is left
            totalWithdrawn += remainingUnits * navObj.nav;
            remainingUnits = 0;
          }
          history.push({ date, value: parseFloat((remainingUnits * navObj.nav).toFixed(2)) });
        } else if (navObj) {
          history.push({ date, value: 0 });
        }
      });
      // Use latest NAV for final value
      const latestNavObj = navData[0];
      finalValue = remainingUnits > 0 ? parseFloat((remainingUnits * latestNavObj.nav).toFixed(2)) : 0;
      setResult({
        initialInvestment: initialAmount,
        totalWithdrawn: totalWithdrawn,
        finalValue: finalValue,
        history: history
      });
    } catch (err) {
      setResult({ error: "Calculation failed. Please try another scheme or date range." });
    }
    setLoading(false);
  };

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5" color="primary">SWP Calculator</Typography>
      <Card sx={{ mb: 4, background: '#fff3e0' }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            SWP lets you withdraw a fixed amount from your mutual fund at regular intervals. Use this calculator to see how your withdrawals affect your investment value over time.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Tip:</b> Choose a scheme and withdrawal plan to simulate your SWP.
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
  <TextField label="Initial Amount" type="number" value={initialAmount} onChange={e => setInitialAmount(Number(e.target.value))} sx={{ mr: 2 }} />
  <TextField label="Monthly Withdraw" type="number" value={withdraw} onChange={e => setWithdraw(Number(e.target.value))} sx={{ mr: 2 }} />
        <TextField label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" value={to} onChange={e => setTo(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleCalculate} disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Calculating..." : "Calculate"}
        </Button>
        {result && result.error && (
          <Alert severity="error" sx={{ mt: 2 }}>{result.error}</Alert>
        )}
        {result && !result.error && (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography>Initial Investment: ₹{result.initialInvestment}</Typography>
            <Typography>Total Withdrawn: ₹{result.totalWithdrawn}</Typography>
            <Typography>Final Value: ₹{result.finalValue}</Typography>
            <LineChart width={800} height={300} data={result.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f57c00" />
            </LineChart>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

