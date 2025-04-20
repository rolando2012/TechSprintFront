"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/solid';
import { adlam } from "@/config/fonts";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className='bg-bright-gray-900 text-bright-gray-50 '>
      <div className="container px-4 md:flex items-center gap-6">
        <div className="flex items-center  md:w-auto w-full">

          {/* mobile menu icon */}
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
            >
              <Bars3BottomLeftIcon className="h-6 w-6 text-bright-gray-50" />
            </button>
            
          </div>
        </div>
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex md:flex-row flex-col items-center justify-start md:space-x-1 pb-3 md:pb-0 navigation-menu`}>
          <Link href="/" className={`py-1 px-3 block hover:bg-bright-gray-950 rounded-xl ${adlam.className}`}>
            Inicio
          </Link>
          <Link href="/versiones" className={`py-1 px-3 block hover:bg-bright-gray-950 rounded-xl ${adlam.className}`}>
            versiones
          </Link> 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;