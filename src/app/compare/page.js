"use client";
import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Grid } from "@mui/material";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function CompareFunds() {
  const [codes, setCodes] = useState([100001, 100002]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
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
      <Typography variant="h5">Compare Funds</Typography>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <TextField label="Scheme Code 1" type="number" value={codes[0]} onChange={e => setCodes([+e.target.value, codes[1]])} />
          </Grid>
          <Grid item>
            <TextField label="Scheme Code 2" type="number" value={codes[1]} onChange={e => setCodes([codes[0], +e.target.value])} />
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
            <Line type="monotone" dataKey="nav" data={data[0].navs} name={`Fund ${data[0].code}`} stroke="#1976d2" />
            <Line type="monotone" dataKey="nav" data={data[1].navs} name={`Fund ${data[1].code}`} stroke="#f50057" />
          </LineChart>
        )}
      </CardContent>
    </Card>
  );
}
