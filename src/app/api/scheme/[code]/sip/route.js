import { NextResponse } from 'next/server';
import axios from 'axios';

function getMonthlyDates(start, end) {
    const dates = [];
    let d = new Date(start);
    while (d <= end) {
        dates.push(new Date(d));
        d.setMonth(d.getMonth() + 1);
    }
    return dates;
}

export async function POST(req, { params }) {
    const { code } = params;
    const body = await req.json();
    const { amount, from, to } = body;

    try {
        const res = await axios.get(`https://api.mfapi.in/mf/${code}`);
        const navData = res.data.data.map(n => ({ date: n.date, nav: parseFloat(n.nav) }));

        const startDate = new Date(from);
        const endDate = new Date(to);

        const sipDates = getMonthlyDates(startDate, endDate);

        let totalUnits = 0;
        let totalInvested = 0;
        const history = [];

        sipDates.forEach(d => {
            // find nearest earlier NAV
            const navObj = navData.find(n => new Date(n.date) <= d);
            if (navObj && navObj.nav > 0) {
                const units = amount / navObj.nav;
                totalUnits += units;
                totalInvested += amount;
                history.push({ date: navObj.date, value: totalUnits * navObj.nav });
            }
        });

        const latestNAV = navData.length > 0 ? navData[0].nav : 0;
        const currentValue = totalUnits * latestNAV;
        const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
        const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
        const annualizedReturn = ((currentValue / totalInvested) ** (1 / years) - 1) * 100;

        return NextResponse.json({
            totalInvested: parseFloat(totalInvested.toFixed(2)),
            currentValue: parseFloat(currentValue.toFixed(2)),
            totalUnits: parseFloat(totalUnits.toFixed(4)),
            absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
            annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
            history
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to calculate SIP' }, { status: 500 });
    }
}
