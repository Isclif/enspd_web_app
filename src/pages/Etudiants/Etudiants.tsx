import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DataTable from "../../components/Tables/DataTableUsers";
import AuthUser from "../../components/AuthUser/AuthUser";

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
  const {token} = AuthUser()
  let headersList = {
    "Authorization": `Bearer ${token}` 
   }

  const [data, setData] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/list-etudiants/", {
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

    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    const item = data.find((item) => item.id === id);
    if (item) {
        setSelectedItem(item);
    }
    console.log("cliked !!");
    
  };

  return (
    <>
      <Breadcrumb pageName="Liste des etudiants" />

      <div className="flex flex-col gap-10">
        <DataTable data={data} onEdit={handleEdit} />
      </div>
    </>
  )
};

export default Etudiants;
