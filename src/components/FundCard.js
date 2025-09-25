'use client';

import { Card, CardContent, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function FundCard({ fund }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{fund.scheme_name}</Typography>
                <Typography variant="body2">
                    {fund.scheme_type} | {fund.scheme_category}
                </Typography>
                <Link href={`/scheme/${fund.scheme_code}`} passHref>
                    <Button variant="contained" sx={{ mt: 1 }}>
                        View Details
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
