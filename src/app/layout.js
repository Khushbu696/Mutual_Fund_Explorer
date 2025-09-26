import './globals.css';
import ThemeRegistry from '../components/ThemeRegistry';
import NavBar from '../components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NavBar />
          <main>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
