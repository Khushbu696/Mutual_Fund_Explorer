"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function CompareFunds() {
  const [codes, setCodes] = useState(["", ""]);
  const [schemes, setSchemes] = useState([]);
  const [data, setData] = useState([]);
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

  const handleCompare = async () => {
    if (!codes[0] || !codes[1]) return;
    setLoading(true);
    try {
      const results = await Promise.all(
        codes.map(code => axios.get(`/api/scheme/${code}`))
      );
      setData(results.map((r, i) => ({
        code: codes[i],
        navs: r.data.data.slice(0, 365).map(n => ({ date: n.date, nav: n.nav }))
      })));
    } catch (err) {
      setData([]);
    }
    setLoading(false);
  };

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5" color="primary">Compare Funds</Typography>
      <Card sx={{ mb: 4, background: '#f3e5f5' }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>Compare Mutual Funds</Typography>
          <Typography variant="body1" gutterBottom>
            Select two mutual fund schemes to compare their NAV performance over the past year. This helps you analyze which fund suits your investment goals better.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Tip:</b> Use this tool to make informed decisions by visualizing fund performance side by side.
          </Typography>
        </CardContent>
      </Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Scheme 1</InputLabel>
              <Select
                value={codes[0]}
                label="Scheme 1"
                onChange={e => setCodes([e.target.value, codes[1]])}
              >
                <MenuItem value="">Select scheme</MenuItem>
                {schemes.map(s => (
                  <MenuItem key={s.schemeCode} value={s.schemeCode}>{s.schemeName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Scheme 2</InputLabel>
              <Select
                value={codes[1]}
                label="Scheme 2"
                onChange={e => setCodes([codes[0], e.target.value])}
              >
                <MenuItem value="">Select scheme</MenuItem>
                {schemes.map(s => (
                  <MenuItem key={s.schemeCode} value={s.schemeCode}>{s.schemeName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleCompare} disabled={loading}>
              {loading ? "Comparing..." : "Compare"}
            </Button>
          </Grid>
        </Grid>
        {data.length === 2 && (
          <LineChart width={800} height={300}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="nav" data={data[0].navs} name={`Fund ${data[0].code}`} stroke="#8e24aa" />
            <Line type="monotone" dataKey="nav" data={data[1].navs} name={`Fund ${data[1].code}`} stroke="#f50057" />
          </LineChart>
        )}
        {data.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>Select two schemes and click Compare to view their performance.</Alert>
        )}
      </CardContent>
    </Card>
  );
}