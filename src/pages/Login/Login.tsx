import React, { useState } from "react"
import { Link } from 'react-router-dom';
import { UserIcon } from "@heroicons/react/16/solid";
import bgCampus from '../../images/img/bg/campus.jpg'
import LogoENSPD from '../../images/img/logo_ENSPD.png'
import LogoUd from '../../images/img/logo_UD.png'

import AuthUser from "../../components/AuthUser/AuthUser";

import URLS from "../../../src/js/configUrl"


const Login = () => {
    const {http, setToken} = AuthUser()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [errorCo, setErrorCo] = useState("")
    const [CoSuccess, setCoSucces] = useState("")

    const [stateError, setStateError] = useState(false)
    const [stateSuccess, setStateSuccess] = useState(false)

    const handleConnect = async () => {
        let headersList = {
            "Accept": "*/*",
           }
        // console.log(username, " and " , password);
        // http.post("login/", {username:username,password:password}).then((res)=>{
        //     setToken(res.data.user, res.data.access)
        // })
        let bodyContent = new FormData();
        // bodyContent.append("username", "user_admin");
        // bodyContent.append("password", "123456789Lapoioi\"");
        bodyContent.append("username", username);
        bodyContent.append("password", password);

        let response = await fetch(`${URLS.API_BACK}/login/`, { 
        method: "POST",
        body: bodyContent,
        headers: headersList
        });

        if(response.ok){
            let data = await response.json()

            setStateError(false)
            setStateSuccess(true)
            setCoSucces("Connexion Réussie !!")
            
            setToken(data.user, data.access)
        }else{
            let data = await response.json()
            setErrorCo(data.error)

            setStateError(true)
        }

    }
  return (
    <div className="relative h-screen">
        <img src={bgCampus} className="w-full h-full objet-cover" alt="" />  
        <img src={LogoENSPD} className="h-12 w-12 rounded-full absolute top-0 left-1" alt="" />  
        <img src={LogoUd} className="h-12 w-12 rounded-full absolute top-0 right-1" alt="" />  
        <div className="flex justify-center">
            <div className="absolute top-10 bg-white p-9 rounded drop-shadow-xl w-[400px]">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    <div className='flex flex-col'>
                        <center className='text-bold text-blue-700'>ENSPD</center>
                        <center className='text-blue-700'>E-learning App</center>
                    </div>
                </h2>
                {stateSuccess && 
                    <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-3 shadow-md ">
                        <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
                            <svg
                                width="16"
                                height="12"
                                viewBox="0 0 16 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                                fill="white"
                                stroke="white"
                                ></path>
                            </svg>
                        </div>
                        <div className="w-full">
                            <h5 className=" text-lg font-semibold text-black ">
                                {CoSuccess} <br />
                                <span className="text-[12px]">Redirection...</span>
                            </h5>
                        </div>
                    </div>
                }
                {stateError && 
                    <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
                        <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                                fill="#ffffff"
                                stroke="#ffffff"
                                ></path>
                            </svg>
                        </div>
                        <div className="w-full">
                            <h5 className="font-semibold text-[#B45454]">
                                {errorCo}
                            </h5>
                        </div>
                    </div>
                }
                
                <form>
                    <div className="mb-1">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Username
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Entrez votre nom d'utilisateur"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                onChange={(e)=>setUsername(e.target.value)}
                            />

                            <span className="absolute right-4 top-4">
                                <UserIcon className="h-6 w-6 text-gray-500" />
                            </span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="6+ Characteres"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                onChange={(e)=>setPassword(e.target.value)}
                            />

                            <span className="absolute right-4 top-4">
                                <svg
                                className="fill-current"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <g opacity="0.5">
                                    <path
                                    d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                    fill=""
                                    />
                                    <path
                                    d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                    fill=""
                                    />
                                </g>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="mb-5">
                        <input
                        // type="submit"
                        onClick={handleConnect}
                        value="Se Connecter"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        />
                    </div>

                    <div className="mt-6 text-center">
                        <p>
                        Pas de compte ?{' '}
                        <Link to="#" className="text-primary">
                            Creer un compte
                        </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>      
        
    </div>
  )
};

export default Login;
