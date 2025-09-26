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
        <Button variant="contained">Browse Funds</Button>
      </Link>
    </Box>
  );
}
