import { NextResponse } from 'next/server';
import axios from 'axios';
import dayjs from 'dayjs';

export async function POST(req, { params }) {
    const { code } = params;
    const body = await req.json();
    const { amount, frequency, from, to } = body;

    if (!amount || !frequency || !from || !to) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    try {
        const { data } = await axios.get(`https://api.mfapi.in/mf/${code}`);
        const navs = data.data.reverse();

        let totalUnits = 0, totalInvested = 0;
        const history = [];

        let current = dayjs(from);
        const endDate = dayjs(to);
        const step = frequency === 'monthly' ? 'month' : frequency === 'weekly' ? 'week' : 'month';

        while (current.isBefore(endDate) || current.isSame(endDate)) {
            const navObj = navs.slice().reverse().find(n => dayjs(n.date, 'DD-MM-YYYY').isBefore(current) || dayjs(n.date, 'DD-MM-YYYY').isSame(current));
            if (navObj && parseFloat(navObj.nav) > 0) {
                const nav = parseFloat(navObj.nav);
                const units = amount / nav;
                totalUnits += units;
                totalInvested += amount;
                history.push({ date: current.format('YYYY-MM-DD'), nav, units, value: units * nav });
            }
            current = current.add(1, step);
        }

        const latestNAV = parseFloat(navs[navs.length - 1].nav);
        const currentValue = totalUnits * latestNAV;
        const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
        const years = endDate.diff(dayjs(from), 'day') / 365;
        const annualizedReturn = Math.pow(currentValue / totalInvested, 1 / years) - 1;

        return NextResponse.json({
            totalInvested: totalInvested.toFixed(2),
            currentValue: currentValue.toFixed(2),
            totalUnits: totalUnits.toFixed(4),
            absoluteReturn: absoluteReturn.toFixed(2),
            annualizedReturn: (annualizedReturn * 100).toFixed(2),
            history
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to calculate SIP' }, { status: 500 });
    }
}
