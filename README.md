# Mutual Fund Explorer

A modern Next.js application for exploring Indian mutual funds, calculating SIP, Lumpsum, and SWP returns, and comparing fund performance. Built with Material UI and MUI Charts for a beautiful, responsive experience.

## Features

- **Fund Search & Listing**: Browse and filter all mutual funds by name, category, and fund house.
- **Scheme Detail Page**: View scheme metadata, NAV history (1 year), pre-computed returns, and ISIN info.
- **SIP Calculator**: Calculate returns for systematic investment plans using historical NAV data.
- **Lumpsum Calculator**: Compare one-time investments with SIP.
- **SWP Calculator**: Simulate periodic withdrawals from a fund.
- **Compare Funds**: Side-by-side NAV chart for two schemes.
- **Advanced Visualizations**: Interactive charts for NAV, SIP growth, and SWP value.
- **Modern UI**: Responsive, mobile-friendly design with a pink theme.

## Data Source

All data is fetched from [MFAPI.in](https://www.mfapi.in/):
- List of all schemes: `https://api.mfapi.in/mf`
- Scheme NAV history: `https://api.mfapi.in/mf/{SCHEME_CODE}`

## Getting Started

1. **Install dependencies**:
	```bash
	npm install
	```
2. **Run the development server**:
	```bash
	npm run dev
	```
3. **Open in browser**:
	Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `src/app/` - Next.js app pages and API routes
- `src/components/` - Reusable React components (Navbar, FundCard, SIPCalculator, etc.)
- `src/utils/` - Utility functions (caching, etc.)

## API Endpoints

- `GET /api/mf` - List all schemes (cached)
- `GET /api/scheme/:code` - Scheme metadata + NAV history
- `GET /api/scheme/:code/returns` - Returns calculator (period or custom range)
- `POST /api/scheme/:code/sip` - SIP calculator

## Customization

- Change theme colors in `src/components/ThemeRegistry.js`
- Add new calculators or visualizations in `src/app/`
