// import axios from "axios"
// import { useState } from "react"
// import { useNavigate } from "react-router-dom";

// export default function AuthUser(){
//     const navigate = useNavigate();

//     const getToken = () =>{
//         const tokenString = sessionStorage.getItem('token');
//         const userToken = JSON.parse(tokenString)
//         return userToken;
//     }

//     const getUser = () =>{
//         const userString = sessionStorage.getItem('user');
//         const userDetails = JSON.parse(userString)
//         return userDetails;
//     }

//     const [token, setToken] = useState(getToken());
//     const [user, setUser] = useState(getUser());


//     const saveToken = (user, token) =>{
//         sessionStorage.setItem('token', JSON.stringify(token));
//         sessionStorage.setItem('user', JSON.stringify(user));

//         setToken(token);
//         setUser(user);
//         navigate("/home");
//     }

//     const logout = () => {
//         sessionStorage.clear()
//         navigate('/')
//     } 


//     const http = axios.create({
//         baseURL:"http://127.0.0.1:8000/",
//         headers:{
//             "Content-Type" : "application/json"
//         }
//     });


//     return {
//         setToken:saveToken,
//         token,
//         user,
//         getToken,
//         http,
//         logout
//     }
// } 


import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    // Ajoutez ici les propriétés de votre utilisateur
    // Par exemple: id: number; name: string; etc.
}

interface Token {
    // Ajoutez ici les propriétés de votre token
    // Par exemple: accessToken: string; refreshToken: string; etc.
}

export default function AuthUser() {
    const navigate = useNavigate();

    const getToken = (): Token | null => {
        const tokenString = sessionStorage.getItem('token');
        if (!tokenString) return null;
        return JSON.parse(tokenString) as Token;
    }

    const getUser = (): User | null => {
        const userString = sessionStorage.getItem('user');
        if (!userString) return null;
        return JSON.parse(userString) as User;
    }

    const [token, setToken] = useState<Token | null>(getToken());
    const [user, setUser] = useState<User | null>(getUser());

    const saveToken = (user: User, token: Token) => {
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
        if(token != undefined && user != undefined){
            setTimeout(() => {
                navigate("/dashboard");
            }, 4000)
        }
    }

    const logout = () => {
        sessionStorage.clear();
        navigate('/');
    }

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/",
        headers: {
            "Content-Type": "application/json",
            // 'bearer': `${token}`
        }
    });

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}
