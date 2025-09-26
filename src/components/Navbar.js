'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography sx={{ flex: 1 }} variant="h6">Mutual Fund Explorer</Typography>
                <Link href="/" passHref><Button color="inherit">Home</Button></Link>
                <Link href="/funds" passHref><Button color="inherit">Funds</Button></Link>
            </Toolbar>
        </AppBar>
    );
}
