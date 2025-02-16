import React, { useEffect, useState } from "react"
import { Routes, Link, Route } from 'react-router-dom'
import Loader from "../common/Loader";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";



const GuestLayout = () => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
    }, []);
  
   return loading ? (<Loader />) 
  : 
    (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
};

export default GuestLayout;
