import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import userAdmin from '../../images/img/user/user.png'
import AuthUser from '../AuthUser/AuthUser';

const DropdownUser = () => {
  const { token, logout, user } = AuthUser();
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
            {user.username}
          </span>
          <span className="block text-xs">Admin</span>
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
                className="flex items-center gap-3.5 text-sm font-medium hover:text-primary lg:text-base"
              >
                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 9.62C8.42 9.62 6.36 7.59 6.36 5.12C6.36 2.64 8.42 0.61 11 0.61C13.57 0.61 15.64 2.64 15.64 5.12C15.64 7.59 13.57 9.62 11 9.62ZM11 2.16C9.28 2.16 7.9 3.5 7.9 5.12C7.9 6.73 9.28 8.07 11 8.07C12.71 8.07 14.09 6.73 14.09 5.12C14.09 3.5 12.71 2.16 11 2.16Z"
                  />
                </svg>
                Mon Profil
              </Link>
            </li>
          </ul>

          {/* Déconnexion */}
          <button
            onClick={disConnect}
            className="block px-6 py-3 text-left text-sm font-medium text-red-600 hover:text-red-800"
          >
            Déconnexion
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
