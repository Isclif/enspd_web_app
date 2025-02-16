import { Link } from 'react-router-dom';
import React from 'react';

const NotFoundCo: React.FC = () => {
    return (
        <div className='flex justify-center text-2xl'>
            <span >
                <center className='text-bold text-4xl mt-5'><h1>404 - Page Not Found</h1></center>
                <br />
                <p>
                    La page que vous recherchez n'existe pas.
                </p>
                <Link to="/dashboard" className="text-primary text-bold">
                    Retour
                </Link>
            </span>
        </div>
    );
};

export default NotFoundCo;
