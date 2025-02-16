import React from "react"
import { Link } from 'react-router-dom';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const RapportActivite = () => {
  return (
    <>
      <Breadcrumb pageName="Rapport d'activités" />

      <div className='flex justify-center text-2xl'>
            <span >
                <center className='text-bold text-4xl mt-5'><h1>Pas de rapport pour l'instant</h1></center>
                <br />
                <p>
                    Revenez ulterieurement !!
                </p>
                <Link to="/dashboard" className="text-primary text-bold">
                    Retour
                </Link>
            </span>
        </div>
    </>
  )
};

export default RapportActivite;
