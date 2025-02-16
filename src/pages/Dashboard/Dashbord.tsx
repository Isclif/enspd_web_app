import React from 'react';
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




const Dashbord: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Departements" total="10">
          <SwatchIcon className="h-12 w-12 text-[#f5e685]" />
        </CardDataStats>

        <CardDataStats title="Professeurs" total="75">
          <UsersIcon className="h-12 w-12 text-[#4d8eb8]" />
        </CardDataStats>

        <CardDataStats title="Etudiants" total="2002">
          <UserGroupIcon className="h-12 w-12 text-[#4db85e]" />
        </CardDataStats>
        
        <CardDataStats title="Rapport d'activités" total="3456">
          <DocumentIcon className="h-12 w-12 text-[#c74444]" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2 md:mt-6  md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo /> */}
        <div className='col-span-6'><ChartThree /></div>
        <div className='col-span-6'><Calendar /></div>
      </div>
    </>
  );
};

export default Dashbord;
