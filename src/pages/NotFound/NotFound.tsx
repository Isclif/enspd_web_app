import { Link } from 'react-router-dom';
import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className='flex justify-center text-2xl'>
            <span >
                <center className='text-bold text-4xl mt-5'><h1>404 - Page Not Found</h1></center>
                <br />
                <p>
                    La page que vous recherchez n'existe pas. <br />
                    Connectez-vous pour accedé a l'application
                </p>
                <Link to="/" className="text-primary text-bold">
                    Me Connecter
                </Link>
            </span>
        </div>
    );
};

export default NotFound;
