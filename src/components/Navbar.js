'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography sx={{ flex: 1 }} variant="h6">Mutual Fund Explorer</Typography>
                <Link href="/" passHref><Button color="inherit" sx={{ color: '#fff' }}>Home</Button></Link>
                <Link href="/funds" passHref><Button color="inherit" sx={{ color: '#fff' }}>Funds</Button></Link>
                <Link href="/sip" passHref><Button color="inherit" sx={{ color: '#fff' }}>SIP Calculator</Button></Link>
                <Link href="/lumpsum" passHref><Button color="inherit" sx={{ color: '#fff' }}>Lumpsum Calculator</Button></Link>
                <Link href="/swp" passHref><Button color="inherit" sx={{ color: '#fff' }}>SWP Calculator</Button></Link>
                <Link href="/compare" passHref><Button color="inherit" sx={{ color: '#fff' }}>Compare Funds</Button></Link>
            </Toolbar>
        </AppBar>
    );
}
