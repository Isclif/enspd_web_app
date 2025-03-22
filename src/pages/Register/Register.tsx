import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";
import bgCampus from "../../images/img/bg/campus.jpg";
import LogoENSPD from "../../images/img/logo_ENSPD.png";
import LogoUd from "../../images/img/logo_UD.png";
import AuthUser from "../../components/AuthUser/AuthUser";

import URLS from "../../js/ConfigUrl";

const Register = () => {
    const { setToken } = AuthUser();
    const navigate = useNavigate(); // Hook pour la redirection
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [matricule, setMatricule] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [telephone, setPhone] = useState("");
    const [sexe, setSexe] = useState("Masculin");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [stateError, setStateError] = useState(false);
    const [stateSuccess, setStateSuccess] = useState(false);
    const [status, setStatus] = useState("Etudiant");

    const [errorCo, setErrorCo] = useState("");
    const [coSuccess, setCoSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setErrorCo("");
        setCoSuccess("");

        // Validation basique des champs
        if (!username || !email || !password || !first_name || !last_name || !telephone) {
            setErrorMsg("Tous les champs doivent être remplis.");
            setStateError(true);
            setStateSuccess(false);
            setLoading(false);
            return;
        }

        const bodyContent = {
            username,
            email,
            password,
            matricule,
            telephone,
            status: status,
            first_name,
            last_name,
            speciality,
            sexe,
        };

        try {
            const response = await fetch(`${URLS.API_BACK}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyContent),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMsg("Inscription réussie !");
                setStateSuccess(true);
                setStateError(false);
    
            
                setTimeout(() => {
                    setSuccessMsg("");
                    setStateSuccess(false);
                    navigate("/"); 
                }, 3000);
            } else {
                console.error("Erreur lors de l'inscription:", data);
                setErrorMsg(JSON.stringify(data));  
                setStateError(true);
                setStateSuccess(false);
            }
        } catch (error) {
            console.error("Erreur réseau", error);
            setErrorMsg("Erreur réseau. Veuillez vérifier votre connexion.");
            setStateError(true);
            setStateSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-8"
            style={{ backgroundImage: `url(${bgCampus})` }}
        >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <img
                src={LogoENSPD}
                className="h-16 w-16 rounded-full absolute top-4 left-4"
                alt="Logo ENSPD"
            />
            <img
                src={LogoUd}
                className="h-16 w-16 rounded-full absolute top-4 right-4"
                alt="Logo UD"
            />
            <div className="relative bg-white p-9 rounded-lg drop-shadow-xl w-[500px] max-w-full text-black">
                <h2 className="mb-9 text-2xl font-bold text-center text-blue-700">
                    ENSPD
                    <br />
                    E-learning App
                </h2>
                <h3 className="text-xl font-semibold text-center mt-4">
                    Créer un compte
                </h3>
                <p className="text-sm text-center text-gray-700 mt-2">Status</p>
                <div className="w-64 border-b-2 border-gray-100 mx-auto my-2"></div>

                <div className="flex justify-center gap-4 my-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="status"
                            value="etudiant"
                            checked={status === "Etudiant"}
                            onChange={() => setStatus("Etudiant")}
                            className="form-radio text-blue-600"
                        />
                        Étudiant
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="status"
                            value="professeur"
                            checked={status === "Professeur"}
                            onChange={() => setStatus("Professeur")}
                            className="form-radio text-blue-600"
                        />
                        Professeur
                    </label>
                </div>
                <p className="text-center text-blue-600">
                    *Veuillez sélectionner un profil.
                </p>
                {stateSuccess && (
                <div className="w-full p-4 my-4 bg-green-200 text-green-800 border-l-4 border-green-600 rounded-lg">
                {successMsg}
                </div>
                )}
                {stateError && (
                <div className="w-full p-4 my-4 bg-red-200 text-red-800 border-l-4 border-red-600 rounded-lg">
                {errorMsg}
                </div>
                )}
                <form>
                    {/* {status === "Etudiant" && (
                        <div className="mb-1">
                            <label className="mb-2.5 block font-medium">Matricule</label>
                            <input
                                type="text"
                                placeholder="Entrez votre matricule"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                        </div>
                    )} */}
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">UserName</label>
                        <input
                            type="text"
                            placeholder="Entrez votre nom utilisateur"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">FirstName</label>
                        <input
                            type="text"
                            placeholder="Entrez votre nom"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">LastName</label>
                        <input
                            type="text"
                            placeholder="Entrez votre prénom"
                         className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">Matricule</label>
                        <input
                            type="text"
                            placeholder="Entrez votre matricule"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setMatricule(e.target.value)}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">Spécialité</label>
                        <input
                            type="text"
                            placeholder="Dans quelle spécialité vous inscrivez-vous ?"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setSpeciality(e.target.value)}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">Téléphone</label>
                        <input
                            type="tel"
                            placeholder="Entrez votre numéro de téléphone"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">Sexe</label>
                        <div className="flex justify-between gap-4">
                            <label>
                                <input
                                    type="radio"
                                    value="Masculin"
                                    checked={sexe === "Masculin"}
                                    onChange={() => setSexe("Masculin")}
                                />
                                Masculin
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Feminin"
                                    checked={sexe === "Feminin"}
                                    onChange={() => setSexe("Feminin")}
                                />
                                Féminin
                            </label>
                        </div>
                    </div>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2.5 block font-medium">Mot de passe</label>
                        
                           
                            <input
                                type="password"
                                placeholder="6+ caractères"
                               className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        
                    </div>

                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full bg-blue-700 text-white py-3 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Chargement..." : "S'inscrire"}
                    </button>
                    <p className="mt-4 text-center">
                        Déjà un compte ?{" "}
                        <Link to="/" className="text-blue-700 font-medium">Se connecter</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
