"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-bright-gray-900 text-bright-gray-50 font-adlam">
      <div className="container px-4 md:flex items-center gap-6">
        <div className="flex items-center  md:w-auto w-full">
          
          {/* mobile menu icon */}
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
            >
            </button>
          </div>
        </div>
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex md:flex-row flex-col items-center justify-start md:space-x-1 pb-3 md:pb-0 navigation-menu`}>
          <Link href="/" className="py-1 px-3 block hover:bg-bright-gray-950 rounded-xl">
            Inicio
          </Link>
          <Link href="/versiones" className="py-1 px-3 block hover:bg-bright-gray-950 rounded-xl">
            versiones
          </Link> 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;