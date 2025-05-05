import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import AuthUser from "../../components/AuthUser/AuthUser";

import URLS from "../../js/ConfigUrl"
import CardFooterWithPagination from "../../components/Pagination/Pagination";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

import { useFetch } from "../../js/useFetch"
import DataCours from "../../components/Gallery/DataCours";
import ModalCours from "../../components/Modals/ModalCours";

import HassAccess from "../../components/utils/HassAccess";

interface DataItem {
    id: number;
    name: string;
    instructor: string;
    speciality_data: {
        id: string;
        name: string;
        dept_name: string;
    };
    description: string;
    department: string
  }
  
  interface FieldsInterface {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
  }

const Cours = () => {

    const { handlePost, handleFetch } = useFetch();
    
    const {token, user} = AuthUser()

    // console.log("user", user);
    
    let headersList = {
    "Authorization": `Bearer ${token}` 
    }

    const [data, setData] = useState<DataItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<DataItem | []>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState({
        id: "",
        name: "",
        speciality_name: "",
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({
        ...searchTerm,
        [e.target.name]: e.target.value,
    });
    };

    const fetchData = async () => {
    try {
        const response = await fetch(`${URLS.API_BACK}/courses/`, {
            method: "GET",
            headers: headersList
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setData(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
    };

    const filterDataTable = () => {
        let dataTableFiltered = data?.filter((item) =>
            (searchTerm.name && item.name.toLowerCase().includes(searchTerm.name.toLowerCase())) ||
            (searchTerm.speciality_name && item.speciality_data.name.toLowerCase().includes(searchTerm.speciality_name.toLowerCase()))
        );

        if(dataTableFiltered.length === 0){
            fetchData()
        } else {
            setData(dataTableFiltered)
        }
    }

    const [fields, setFields] = useState<FieldsInterface[]>([
        { name: "name", label: "Nom", type: "text", placeholder: "Entrez le nom du cours", value: "" },
        // { name: "head", label: "Chef du département", type: "text", placeholder: "Entrez le chef du departement", value: "" },
        { name: "description", label: "Description", type: "text", placeholder: "Entrez une description", value: "" }
    ]);

    const handlePagination = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
        setPage(newPage);
    }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterDataTable();
    }, [searchTerm]);

    const handleFormSubmit = async (formData: { [key: string]: string }) => {
        console.log("Données soumises:", formData);

        let url = `${URLS.API_BACK}/courses/`

        const response = await handlePost(url, formData)

        if (response.status === 201) {
            fetchData();
        }
    };

    const handleView = (id: number) => {
        setShowModalInfo(true)
        const item = data.find((item) => item.id === id);
        if (item) {
            setSelectedItem(item);
        }
        console.log("cliked !!", item);
    
    };

    return (
        <div>
            <Breadcrumb pageName="Liste des Cours" />

            {/* Modal dynamique */}
            <ModalCours showModal={showModal} setShowModal={setShowModal} onSubmit={handleFormSubmit} title="Creer un cours" fields={fields} />

            <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6 dark:bg-boxdark">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-md ">Recherche</h3>
                        <div className="w-full dark:bg-gray-800 rounded-lg pt-2 mb-6">
                        <div className="flex gap-2">
                            <input
                            type="text"
                            name="name"
                            placeholder="nom du cours"
                            value={searchTerm.name}
                            onChange={handleSearchChange}
                            className="px-4 py-2 rounded-lg border border-stroke shadow-default w-1/3 dark:bg-boxdark"
                            />
                            <input
                            type="text"
                            name="speciality_name"
                            placeholder="spécialité"
                            value={searchTerm.speciality_name}
                            onChange={handleSearchChange}
                            className="px-4 py-2 rounded-lg border border-stroke shadow-default w-1/3 dark:bg-boxdark"
                            />
                            <button onClick={filterDataTable} className="ml-1 px-2 py-2 bg-blue-700 text-white  rounded-lg hover:bg-blue-900 transition">
                            Rechercher
                            </button>
                        </div>
                        </div>
                    </div>
                    <HassAccess role={user?.status} allowedRoles={["Admin"]}>
                        <div className="flex flex-row justify-center items-center mt-2">
                            <button className="ml-1 px-2 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-400 transition" onClick={() => setShowModal(true)} >
                            <div className="flex space-x-1">
                                <span className="text-md">Ajouter</span> 
                                <PlusCircleIcon className="h-6 z-6" />
                            </div>
                            </button>
                        </div>
                    </HassAccess>
                </div>

                <div className="flex flex-col gap-10">
                    <DataCours data={data} onView={handleView} />
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    <CardFooterWithPagination currentPage={page} totalPages={totalPages} onPageChange={handlePagination} />
                </div>

            </div>
        </div>
    )
};

export default Cours;
