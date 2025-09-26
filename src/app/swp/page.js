"use client";
import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function getMonthlyDates(start, end) {
  const dates = [];
  let d = new Date(start);
  while (d <= end) {
    dates.push(new Date(d));
    d.setMonth(d.getMonth() + 1);
  }
  return dates;
}

export default function SWPCalculator() {
  const [code, setCode] = useState(100001);
  const [withdraw, setWithdraw] = useState(2000);
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState("2023-12-31");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/scheme/${code}`);
      const navData = res.data.data;
      let units = 0;
      let value = 0;
      let history = [];
      // Initial investment: buy units with first NAV
      const startNAV = navData.find(n => n.date === from) || navData[navData.length - 1];
      units = 10000 / startNAV.nav; // Assume initial investment of 10,000
      value = units * startNAV.nav;
      const swpDates = getMonthlyDates(new Date(from), new Date(to));
      swpDates.forEach(d => {
        // Find nearest NAV
        const navObj = navData.find(n => new Date(n.date) <= d);
        if (navObj && navObj.nav > 0) {
          const withdrawUnits = withdraw / navObj.nav;
          units -= withdrawUnits;
          value = units * navObj.nav;
          history.push({ date: navObj.date, value });
        }
      });
      const latestNAV = navData[0].nav;
      const finalValue = units * latestNAV;
      setResult({
        initialInvestment: 10000,
        totalWithdrawn: withdraw * swpDates.length,
        finalValue: parseFloat(finalValue.toFixed(2)),
        history
      });
    } catch (err) {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5">SWP Calculator</Typography>
      <CardContent>
        <TextField label="Scheme Code" type="number" value={code} onChange={e => setCode(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="Monthly Withdraw" type="number" value={withdraw} onChange={e => setWithdraw(e.target.value)} sx={{ mr: 2 }} />
        <TextField label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" value={to} onChange={e => setTo(e.target.value)} sx={{ mr: 2 }} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={handleCalculate} disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Calculating..." : "Calculate"}
        </Button>
        {result && (
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
