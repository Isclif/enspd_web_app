import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "@heroicons/react/16/solid";
import bgCampus from "../../images/img/bg/campus.jpg";
import LogoENSPD from "../../images/img/logo_ENSPD.png";
import LogoUd from "../../images/img/logo_UD.png";
import AuthUser from "../../components/AuthUser/AuthUser";

const Login = () => {
    const { http, setToken } = AuthUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorCo, setErrorCo] = useState("");
    const [coSuccess, setCoSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        setErrorCo("");
        setCoSuccess("");

        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCoSuccess("Connexion réussie !");
                setToken(data.user, data.access);

                // Masquer le message après 3 secondes
                setTimeout(() => setCoSuccess(""), 3000);
            } else {
                setErrorCo(data.error || data.message || "Échec de connexion. Vérifiez vos identifiants.");
            }
        } catch (error) {
            setErrorCo("Erreur réseau. Vérifiez votre connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen">
            <img src={bgCampus} className="w-full h-full object-cover" alt="" />
            <img src={LogoENSPD} className="h-12 w-12 rounded-full absolute top-0 left-1" alt="" />
            <img src={LogoUd} className="h-12 w-12 rounded-full absolute top-0 right-1" alt="" />

            <div className="flex justify-center">
                <div className="absolute top-10 bg-white p-9 rounded drop-shadow-xl w-[400px]">
                    <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
                        <div className="flex flex-col text-center text-blue-700">
                            <span className="font-bold">ENSPD</span>
                            <span>E-learning App</span>
                        </div>
                    </h2>

                    {coSuccess && (
                        <div className="w-full p-3 text-green-700 bg-green-200 border-l-4 border-green-500">
                            {coSuccess}
                        </div>
                    )}

                    {errorCo && (
                        <div className="w-full p-3 text-red-700 bg-red-200 border-l-4 border-red-500">
                            {errorCo}
                        </div>
                    )}

                    <form>
                        <div className="mb-4">
                            <label className="block font-medium text-black">Nom d'utilisateur</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Entrez votre nom d'utilisateur"
                                    className="w-full rounded-lg border py-3 pl-6 pr-10"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span className="absolute right-4 top-4">
                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                </span>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="block font-medium text-black">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Votre mot de passe"
                                    className="w-full rounded-lg border py-3 pl-6 pr-10"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                        <Link to="/forgotPassword" className="text-blue-600  text-sm">
                           Mot de passe oublié ?
                        </Link>
                        </div>

                        <button
                            type="button"
                            onClick={handleConnect}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
                            disabled={loading}
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-600">
                        Pas encore inscrit ? <Link to="/register" className="text-blue-600 font-bold">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
