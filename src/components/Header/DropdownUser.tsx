import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import userAdmin from '../../images/img/user/student_logo.png'
import AuthUser from '../AuthUser/AuthUser';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const DropdownUser = () => {
  const {token, logout, user} = AuthUser();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const disConnect = () => {
    if (token !== undefined) {
      logout();
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {/* Emmanuel ESSAMA NANGA */}
            {user?.username}
          </span>
          <span className="block text-xs">{user?.status}</span>
        </span>

        <span className="h-12 w-12">
          <img src={userAdmin} alt="User" className="h-11 rounded-full" />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.41 0.91C0.74 0.58 1.26 0.58 1.59 0.91L6 5.32L10.41 0.91C10.74 0.58 11.26 0.58 11.59 0.91C11.91 1.24 11.91 1.76 11.59 2.09L6.59 7.09C6.26 7.41 5.74 7.41 5.41 7.09L0.41 2.09C0.08 1.76 0.08 1.24 0.41 0.91Z"
          />
        </svg>
      </Link>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* Lien vers le profil */}
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex w-28 items-center text-sm font-medium hover:text-primary lg:text-base space-x-2"
              >
                <UserCircleIcon className="h-6 w-6 text-gray-500" />
                <span>Mon Profil</span>
              </Link>
            </li>
          </ul>

          {/* Déconnexion */}
          <button
            onClick={disConnect}
            className="block py-3 text-center text-sm font-medium text-red-400 hover:text-red-600"
          >
            Déconnexion
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
