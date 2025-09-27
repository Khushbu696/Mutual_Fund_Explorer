import Link from 'next/link';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom color="primary">Mutual Fund Explorer</Typography>
        <Card sx={{ mb: 4, background: '#e3f2fd' }}>
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>Welcome to India's Mutual Fund Dashboard</Typography>
            <Typography variant="body1" gutterBottom>
              Discover, compare, and analyze thousands of mutual funds. Use our calculators to plan your investments and visualize your returns. All data is live from MFAPI.in.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Tip:</b> Start by browsing funds or use the calculators to simulate your investment journey!
            </Typography>
          </CardContent>
        </Card>
        <Link href="/funds" passHref>
          <Button variant="contained" sx={{ mr: 2 }}>Browse Funds</Button>
        </Link>
        <Link href="/sip" passHref>
          <Button variant="outlined" sx={{ mr: 2 }}>SIP Calculator</Button>
        </Link>
        <Link href="/lumpsum" passHref>
          <Button variant="outlined" sx={{ mr: 2 }}>Lumpsum Calculator</Button>
        </Link>
        <Link href="/swp" passHref>
          <Button variant="outlined" sx={{ mr: 2 }}>SWP Calculator</Button>
        </Link>
        <Link href="/compare" passHref>
          <Button variant="outlined">Compare Funds</Button>
        </Link>
      </Box>
  );
}
