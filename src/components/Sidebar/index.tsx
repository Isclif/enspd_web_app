import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import LogoEnspd from '../../images/img/svg/Enspd_svg.svg';
import LogoUd from '../../images/img/svg/Ud_svg.svg';
import { ChevronRightIcon, DocumentIcon, SwatchIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/16/solid";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#024576] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className=" justify-between">
        {/* <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink> */}

        <NavLink className="block flex bg-[#f5e685] py-3 px-6" to="/dashboard">
          <img src={LogoEnspd} alt="Logo" className='h-14 w-14 rounded mr-2'/>
          <div className='flex flex-col'>
            <center className='text-bold text-blue-700'>ENSPD</center>
            <center className='text-blue-700'>E-learning App</center>
          </div>
          <img src={LogoUd} alt="Logo" className='h-14 w-14 rounded ml-2'/>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Dashboard --> */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:text-yellow-100 dark:hover:bg-meta-4 ${
                    (pathname === '/dashboard') &&
                    'bg-[#2563eb] dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current text-[#f5e685]"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                      fill=""
                    />
                  </svg>
                  Dashboard
                  <ChevronRightIcon className="h-6 w-6 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 fill-current" />               
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Departement --> */}
              <li>
                <NavLink
                  to="/departements"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:text-yellow-100 dark:hover:bg-meta-4 ${
                    pathname.includes('departements') &&
                    'bg-[#2563eb] dark:bg-meta-4'
                  }`}
                >
                  <SwatchIcon className="h-6 w-6 text-[#f5e685]" />
                  Departements
                  <ChevronRightIcon className="h-6 w-6 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 fill-current" />               
                </NavLink>
              </li>
              {/* <!-- Menu Item departement --> */}

              {/* <!-- Menu Item enseignant --> */}
              <li>
                <NavLink
                  to="/enseignants"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:text-yellow-100 dark:hover:bg-meta-4 ${
                    pathname.includes('enseignants') && 'bg-[#2563eb] dark:bg-meta-4'
                  }`}
                >
                  <UsersIcon className="h-6 w-6 text-[#f5e685]" />
                  Enseignants
                  <ChevronRightIcon className="h-6 w-6 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 fill-current" />               
                </NavLink>
              </li>
              {/* <!-- Menu Item enseignant --> */}

              {/* <!-- Menu Item etudiants --> */}
              <li>
                <NavLink
                  to="/etudiants"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:text-yellow-100 dark:hover:bg-meta-4 ${
                    pathname.includes('etudiants') && 'bg-[#2563eb] dark:bg-meta-4'
                  }`}
                >
                <UserGroupIcon className="h-6 w-6 text-[#f5e685]" />
                  Etudiants
                  <ChevronRightIcon className="h-6 w-6 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 fill-current" />               
                </NavLink>
              </li>
              {/* <!-- Menu Item etudiants --> */}
              
              {/* <!-- Menu Item rapport --> */}
              <li>
                <NavLink
                  to="/rapport"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:text-yellow-100 dark:hover:bg-meta-4 ${
                    pathname.includes('rapport') && 'bg-[#2563eb] dark:bg-meta-4'
                  }`}
                >
                  <DocumentIcon className="h-6 w-6 text-[#f5e685]" /> 
                  Rapport d'activité
                  <ChevronRightIcon className="h-6 w-6 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 fill-current" />               
                </NavLink>
              </li>
              {/* <!-- Menu Item rapport --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
