import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>Mutual Fund Explorer</Typography>
      <Typography variant="body1" gutterBottom>
        Explore mutual funds and calculate SIP returns using historical NAV data.
      </Typography>
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
