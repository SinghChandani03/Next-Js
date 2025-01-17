import { store } from '@/redux/store/store';
import { Inter } from "next/font/google";
import Sidebar from "@/components/sidebar/sidebar";
import { Providers } from '@/redux/providers/providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from '@/components/proctedroute/proctedroute';
import { selectIsAuthenticated } from '@/redux/slice/authslice'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Management System",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers store={store}>
        { selectIsAuthenticated && <Sidebar /> }
          <ToastContainer position="top-right" autoClose={1000} theme="colored" />
          <div className="main-content">
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
          </div>
        </Providers>
      </body>
    </html>
  );
}

