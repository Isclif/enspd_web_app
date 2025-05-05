import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
import Calendar from '../Calendar';
import { UsersIcon } from "@heroicons/react/16/solid";
import { UserGroupIcon } from "@heroicons/react/16/solid";
import { DocumentIcon } from "@heroicons/react/16/solid";
import { SwatchIcon } from "@heroicons/react/16/solid";

import { useFetch } from "../../js/useFetch"
import URLS from "../../js/ConfigUrl"


interface DataStats {
  departements: number;
  professeurs: number;
  etudiants: number;
  rapports: number;
}

interface StudentData {
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

// interface StudentStats {
//   students: number;
// }

// interface ProfStats {
//   profs: number;
// }

// interface ActivityStats {
//   rappAct: number;
// }

const Dashbord: React.FC = () => {

  const { handlePost, handleFetch } = useFetch();

  const [dataStats, setDataStats] = useState<DataStats>({
    departements: 0,
    professeurs: 0,
    etudiants: 0,
    rapports: 0,
  });

  const [studentsData, setStudentsData] = useState<StudentData[]>([]);

  // Fonction pour mettre à jour une donnée spécifique
  const updateDataStat = (key: keyof DataStats, value: number) => {
    setDataStats((prevDataStats) => ({
      ...prevDataStats,
      [key]: value,
    }));
  };

  const fetchDeps = async () => {
    let depUrl = `${URLS.API_BACK}/departments/`

    const departments = await handleFetch(depUrl)

    if (departments.status == 200) {
      updateDataStat("departements", departments.length)
    }
  }

  const fetchProfs = async () => {
    let profUrl = `${URLS.API_BACK}/professeurs/`

    const profs = await handleFetch(profUrl)

    if (profs.status == 200) {
      updateDataStat("professeurs", profs.length)
    }
  }

  const fetchEtudiants = async () => {
    let etudUrl = `${URLS.API_BACK}/etudiants/`

    const etudiants = await handleFetch(etudUrl)

    if (etudiants.status == 200) {
      setStudentsData(etudiants)
      updateDataStat("etudiants", etudiants.length)
    }
  }

  const fetchRapports = async () => {
    let rapUrl = `${URLS.API_BACK}/activity_repports/`

    const rapports = await handleFetch(rapUrl)

    if (rapports.status == 200) {
      updateDataStat("rapports", rapports.length)
    }
  }

  useEffect(() => {
    fetchDeps();
    fetchRapports();
    fetchEtudiants();
    fetchProfs()
  }, []);


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Departements" total={dataStats.departements.toString()}>
          <SwatchIcon className="h-12 w-12 text-[#f5e685]" />
        </CardDataStats>

        <CardDataStats title="Professeurs" total={dataStats.professeurs.toString()}>
          <UsersIcon className="h-12 w-12 text-[#4d8eb8]" />
        </CardDataStats>

        <CardDataStats title="Etudiants" total={dataStats.etudiants.toString()}>
          <UserGroupIcon className="h-12 w-12 text-[#4db85e]" />
        </CardDataStats>
        
        <CardDataStats title="Rapport d'activités" total={dataStats.rapports.toString()}>
          <DocumentIcon className="h-12 w-12 text-[#c74444]" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2 md:mt-6  md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo /> */}
        <div className='col-span-6'><ChartThree studentsData={studentsData}/></div>
        <div className='col-span-6'><Calendar /></div>
      </div>
    </>
  );
};

export default Dashbord;
