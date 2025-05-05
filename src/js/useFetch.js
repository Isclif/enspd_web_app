import { useState, useEffect, useContext } from "react";
// import { authProvider } from "./AuthContext";
import AuthUser from "../components/AuthUser/AuthUser"


export const useFetch = () => {

    const [err, setErr] = useState("");
    // const { token } = useContext(AuthUser)
    const { token } = AuthUser();
    // let token = sessionStorage.getItem('token');

    // console.log("token", token);
    
    
    const handleFetch = async (url) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
          
          try {
            let response = await fetch(url, requestOptions);
            let result = await response.json(); 
            if(response.ok){
                result.status = response.status;
                return result;
            }
            setErr(result);
            return result;
        } catch (error) {
            setErr(error);
            return error;
        }
       
    };
 


    const handlePost = async (url, data, withAuth = true) => {
        const myHeaders = new Headers();
        if(withAuth){
            myHeaders.append("Authorization", `Bearer ${token}`);
        }
        myHeaders.append("Content-Type", "application/json"); 
        const raw = JSON.stringify(data);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        try {
            let response = await fetch(url, requestOptions);
            let result = await response.json();
            result.status = response.status;
            return result;
        } catch (error) {
            throw new Error("Erreur du serveur", error);
        }
    };


    const handlePatchPassword = async (url, data = null) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            redirect: "follow"
        };
    
        // Ajouter le corps uniquement si des données sont fournies
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
    
        try {
            let response = await fetch(url, requestOptions);
            let result = await response.json(); // Utiliser json() pour obtenir un objet JSON
            // console.log("result", result);
            // console.log("response", response);
            if (response.ok) {
                return result; // Retourner l'objet JSON complet
            }
            setErr(result?.error || "Une erreur est survenue"); // Gestion des erreurs
            return result;
        } catch (error) {
            setErr(error.message || "Erreur du serveur");
            return error;
        }
    };


    const handlePatch = async (url, data = null) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            redirect: "follow",
        };
    
        // Ajouter le corps uniquement si des données sont fournies
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }
    
        try {
            let response = await fetch(url, requestOptions);
            let result = await response.json(); // Utiliser json() pour obtenir un objet JSON
            result.status = response.status;
            // console.log("result", result);
            // console.log("response", response);
            if (response.ok) {
                return result; // Retourner l'objet JSON complet
            }
            setErr(result?.error || "Une erreur est survenue"); // Gestion des erreurs
            return result;
        } catch (error) {
            setErr(error.message || "Erreur du serveur");
            return error;
        }
    };



    const handlePostFile = async (urlEndPoint, file) => {
        const formData = new FormData();
        formData.append("files", file);
    
        const requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow"
        };
    
        try {
            let response = await fetch(urlEndPoint, requestOptions);
            const result = await response.json(); // Parse la réponse JSON
    
            if (response.ok) {
                return result; // Retourne l'objet JSON complet
            } else {
                setErr(result?.error);
                return result;
            }
        } catch (error) {
            setErr(error);
            return error;
        }
    };

    const handleDelete = async (url) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            // redirect: 'follow'
          };
          
          try {
            let response = await fetch(url, requestOptions);
            let result = await response.json(); 
            if(response.ok){
                return result;
            }
            setErr(result);
            return result;
        } catch (error) {
            setErr(error);
            return error;
        }
       
    };

  return { handleFetch, handlePost, err, setErr, handlePostFile, handlePatch, handleDelete, handlePatchPassword };
};