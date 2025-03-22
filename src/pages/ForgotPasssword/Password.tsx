import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import bgCampus from '../../images/img/bg/campus.jpg';
import LogoENSPD from '../../images/img/logo_ENSPD.png';
import LogoUd from '../../images/img/logo_UD.png';

import AuthUser from "../../components/AuthUser/AuthUser";

import URLS from "../../js/ConfigUrl"

const ForgotPassword = () => {
    const { http } = AuthUser();
    const [email, setEmail] = useState("");
    
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [stateError, setStateError] = useState(false);
    const [stateSuccess, setStateSuccess] = useState(false);

    const handleReset = async () => {
        let headersList = {
            "Accept": "*/*",
        };

        let bodyContent = new FormData();
        bodyContent.append("email", email);

        let response = await fetch(`${URLS.API_BACK}/forgot-password/`, {
            method: "POST",
            body: bodyContent,
            headers: headersList,
        });

        if (response.ok) {
            setStateError(false);
            setStateSuccess(true);
            setSuccessMsg("Un lien de réinitialisation a été envoyé à votre email.");
        } else {
            let data = await response.json();
            setErrorMsg(data.error || "Une erreur est survenue.");
            setStateError(true);
        }
    };

    return (
        <div className="relative h-screen">
            <img src={bgCampus} className="w-full h-full object-cover" alt="" />
            <img src={LogoENSPD} className="h-12 w-12 rounded-full absolute top-0 left-1" alt="" />
            <img src={LogoUd} className="h-12 w-12 rounded-full absolute top-0 right-1" alt="" />
            <div className="flex justify-center">
                <div className="absolute top-10 bg-white p-9 rounded drop-shadow-xl w-[400px]">
                    <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                        <div className='flex flex-col'>
                            <center className='text-bold text-blue-700'>ENSPD</center>
                            <center className='text-blue-700'>E-learning App</center>
                        </div>
                    </h2>

                    <h3 className="text-lg font-semibold text-center mb-2">Mot de passe oublié ?</h3>
                    <p className="text-gray-600 text-center mb-6">
                        Entrez votre email pour recevoir votre nouveau mot de passe.
                    </p>

                    {stateSuccess && <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-3 shadow-md">{successMsg}</div>}
                    {stateError && <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-3 shadow-md">{errorMsg}</div>}

                    <form>
                        <div className="mb-1">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Entrez votre email"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span className="absolute right-4 top-4">
                                    <EnvelopeIcon className="h-6 w-6 text-gray-500" />
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                                onClick={handleReset}
                            >
                                Réinitialiser le mot de passe
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <Link to="/" className="text-sm text-blue-500 hover:underline">Se connecter</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
