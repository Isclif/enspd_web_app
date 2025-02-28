import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DataTable from "../../components/Tables/DataTableUsers";
import AuthUser from "../../components/AuthUser/AuthUser";
import SectionHeader from "../../components/Header/SectionHeader";
import ModalForm from "../../components/Modals/Modal ";
import CardFooterWithPagination from "../../components/Pagination/Pagination";



interface DataItem {
  id: number;
  username: string;
  first_name: string;
  email: string;
  matricule: string;
  telephone: string;
  status: string;
  speciality: string;
  sexe: string;
}

const Etudiants = () => {
  const { token } = AuthUser();
  let headersList = {
    Authorization: `Bearer ${token}`,
  };

  const [data, setData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState({
    username: "",
    matricule: "",
    speciality: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [fields, setFields] = useState([
    { name: "username", label: "Username", type: "text", placeholder: "Entrez le nom d'utilisateur", value: "" },
    { name: "email", label: "Email", type: "email", placeholder: "Entrez l'email", value: "" },
    { name: "matricule", label: "Matricule", type: "text", placeholder: "Entrez le matricule", value: "" },
    { name: "telephone", label: "Téléphone", type: "tel", placeholder: "Entrez le téléphone", value: "" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/list-etudiants/?page=${page}&username=${searchTerm.username}&matricule=${searchTerm.matricule}&speciality=${searchTerm.speciality}`,
          {
            method: "GET",
            headers: headersList,
          }
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setData(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [searchTerm, page, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({
      ...searchTerm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handlePagination = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFormSubmit = (data: { [key: string]: string }) => {
    // Traitement des données du formulaire ici (par exemple, envoyer à l'API)
    console.log("Données soumises:", data);
  };

  return (
    <>
      <Breadcrumb pageName="Liste des étudiants" />

      {/* Section Gestion des étudiants */}
      <SectionHeader title="Gestion des Etudiants" onAddClick={() => setShowModal(true)} />

      {/* Modal dynamique */}
      <ModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={handleFormSubmit}
        title="Ajouter un étudiant"
        fields={fields}
      />

      {/* Liste des étudiants */}
      <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6">
        <h3 className="text-xl font-semibold text-center mb-4">Liste des étudiants</h3>

        {/* Formulaire de recherche sous le tableau des étudiants */}
        <div className="w-full dark:bg-gray-800 rounded-lg p-5 mb-6">
          <div className="flex gap-2 justify-between">
            {/* Champs de recherche */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={searchTerm.username}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-lg border border-stroke shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-1/3"
            />
            <input
              type="text"
              name="matricule"
              placeholder="Matricule"
              value={searchTerm.matricule}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-lg border border-stroke shadow-default w-1/3"
            />
            <input
              type="text"
              name="speciality"
              placeholder="Spécialité"
              value={searchTerm.speciality}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-lg border border-stroke w-1/3 shadow-default dark:border-strokedark"
            />
            {/* Bouton Rechercher */}
            <button
              onClick={handleSearch}
              className="ml-1 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Rechercher
            </button>
          </div>
        </div>

        <DataTable data={data} />

             {/* Pagination */}
             <div className="mt-6">
    <CardFooterWithPagination
    currentPage={page} 
    totalPages={totalPages} 
    onPageChange={handlePagination}
    
    />
  </div>
      </div>

 
    </>
  );
};

export default Etudiants;
