import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from '../components/landing-page/Navbar'
import Footer from '../components/landing-page/Footer'
import Particles from '../components/landing-page/Particles'
import ScrollToTop from '../components/ScrollToTop'

const AppLayout = () => {
  const location = useLocation();
  const hideShell = ['/docs', '/login', '/signup', '/dashboard', '/initialize-identity'].includes(location.pathname);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#ff1e1e] selection:text-white flex flex-col">
      <ScrollToTop />
      <Toaster position="bottom-right" theme="dark" richColors />
      <Particles />
      
      {/* Global Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff1e1e]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff1e1e]/5 blur-[120px] rounded-full" />
      </div>

      {!hideShell && <Navbar />}
      
      <main className={`relative z-20 flex-1 ${hideShell ? 'h-screen' : ''}`}>
        <Outlet />
      </main>

      {!hideShell && <Footer />}
    </div>
  )
}

export default AppLayout