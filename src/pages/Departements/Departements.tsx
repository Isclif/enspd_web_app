import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import AuthUser from "../../components/AuthUser/AuthUser";
import DataDep from "../../components/Tables/DataDep";

import URLS from "../../js/ConfigUrl"

interface DataItem {
  id: number;
  nom: string;
  nom_prof: string;
}

const Departements = () => {
  const {token} = AuthUser()
  let headersList = {
    "Authorization": `Bearer ${token}` 
   }

  const [data, setData] = useState<DataItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`${URLS.API_BACK}/dep/departements/`, {
              method: "GET",
              headers: headersList
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données');
            }
            const data = await response.json();
            setData(data.results);
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
      <Breadcrumb pageName="Liste des departements" />

      <div className="flex flex-col gap-10">
        <DataDep data={data} onEdit={handleEdit} />
      </div>
    </>
  )
};

export default Departements;
