import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import AuthUser from "../../components/AuthUser/AuthUser";
import DataDep from "../../components/Tables/DataDep";

import URLS from "../../js/ConfigUrl"
import CardFooterWithPagination from "../../components/Pagination/Pagination";
import { PlusCircleIcon, CheckBadgeIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ModalFormDept from "../../components/Modals/ModalDep";

import { useFetch } from "../../js/useFetch"
import { useParams } from "react-router-dom";


interface DataItem {
  id: number;
  name: string;
  head: string;
  head_name: string;
  description: string;
  specialitys: any[]
}

const DepartementDetail = () => {

    const { handlePost, handleFetch } = useFetch();


    const {token} = AuthUser()
    let headersList = {
        "Authorization": `Bearer ${token}` 
    }

    const [data, setData] = useState<DataItem>();

    const { uuid } = useParams<{ uuid: string }>();

    const isValidUUID = (uuid: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    };

    const fetchData = async () => {
      try {
        const result = await handleFetch(`${URLS.API_BACK}/departments/${uuid}/`);

        // if (!response.ok) {
        //   throw new Error(`Erreur HTTP ${response.status}: Impossible de récupérer les données`);
        // }
    
        // Si ton API renvoie { data: {...} }, garde `result.data`
        // Sinon, utilise `result` directement
        setData(result.data);
    
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
        if (uuid && isValidUUID(uuid)) {
            fetchData()
        } else {
        console.log('UUID invalide');
        }
    }, [uuid]);
  

    return (
        <>
            <Breadcrumb pageName="Departements - Détails" />
            <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6 dark:bg-boxdark">
                <div className="text-xl font-bold py-2">
                    {data?.name}
                </div>
                <div>
                    {data?.description}
                </div>
                <div className="pt-6">
                    <span className="text-xl font-bold">Spécialités du département</span>
                    <div className="pt-2">
                        {data?.specialitys?.map((elm) => (
                            <div className="mt-4">
                                <div className="flex space-x-2">
                                    <div><CheckBadgeIcon className="h-6 w-6 text-gray-500" /></div>
                                    <span className="font-bold">{elm.name}</span>
                                </div>
                                <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                                <div>
                                    {elm.description}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6">
                        <span className="text-xl font-bold">Chef du département</span>
                        <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                        <div className="pt-2 flex flex-col justify-center items-center">
                            <div className="bg-zinc-300 w-36 h-28 rounded-md">
                                <UserCircleIcon className="h-28 w-36 text-gray-500" />
                            </div>
                            <div className="font-bold text-center">
                                Dr {data?.head_name.toLocaleUpperCase()}
                            </div>
                            <div className="text-xs text-center">Chef de départment</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default DepartementDetail;