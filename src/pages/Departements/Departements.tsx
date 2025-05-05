import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import AuthUser from "../../components/AuthUser/AuthUser";
import DataDep from "../../components/Tables/DataDep";

import URLS from "../../js/ConfigUrl"
import CardFooterWithPagination from "../../components/Pagination/Pagination";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import ModalFormDept from "../../components/Modals/ModalDep";

import { useFetch } from "../../js/useFetch"
import HassAccess from "../../components/utils/HassAccess";

interface DataItem {
  id: number;
  name: string;
  head: string;
  head_name: string;
  description: string;
}

interface FieldsInterface {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
}

const Departements = () => {

  const { handlePost, handleFetch } = useFetch();


  const {token, user} = AuthUser()
  let headersList = {
    "Authorization": `Bearer ${token}` 
  }

  const [data, setData] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState({
    id: "",
    name: "",
    head_name: "",
  });

  const filterDataTable = () => {
    let dataTableFiltered = data?.filter((item) =>
      (searchTerm.name && item.name.toLowerCase().includes(searchTerm.name.toLowerCase())) ||
      (searchTerm.head_name && item.head_name.toLowerCase().includes(searchTerm.head_name.toLowerCase()))
    );

    if(dataTableFiltered.length === 0){
      fetchData()
    } else {
      setData(dataTableFiltered)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({
      ...searchTerm,
      [e.target.name]: e.target.value,
    });
  };

  const fetchData = async () => {
    try {
        const response = await fetch(`${URLS.API_BACK}/departments/`, {
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

  const [fields, setFields] = useState<FieldsInterface[]>([
    { name: "name", label: "Nom", type: "text", placeholder: "Entrez le nom du departement", value: "" },
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

    let url = `${URLS.API_BACK}/departments/`

    const response = await handlePost(url, formData)

    if (response.status === 201) {
      fetchData();
    }
  };

  const handleEdit = (id: number) => {
    const item = data.find((item) => item.id === id);
    if (item) {
        setSelectedItem(item);
    }
    console.log("cliked !!");
    
  };


  return (
    <>
      <Breadcrumb pageName="Liste des departements" />

      {/* Modal dynamique */}
      <ModalFormDept showModal={showModal} setShowModal={setShowModal} onSubmit={handleFormSubmit} title="Ajouter un departement" fields={fields} />


      <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6 dark:bg-boxdark">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-md ">Recherche</h3>
            <div className="w-full dark:bg-gray-800 rounded-lg pt-2 mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="name"
                  placeholder="nom"
                  value={searchTerm.name}
                  onChange={handleSearchChange}
                  className="px-4 py-2 rounded-lg border border-stroke shadow-default w-1/3 dark:bg-boxdark"
                />
                <input
                  type="text"
                  name="head_name"
                  placeholder="Chef Departement"
                  value={searchTerm.head_name}
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
          <DataDep data={data} onEdit={handleEdit} />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <CardFooterWithPagination currentPage={page} totalPages={totalPages} onPageChange={handlePagination} />
        </div>

      </div>
    </>
  )
};

export default Departements;
