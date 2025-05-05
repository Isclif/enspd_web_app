import React from "react";
import { Plus, X } from "lucide-react";

import { PlusCircleIcon } from "@heroicons/react/24/solid";

interface SectionHeaderProps {
  title: string;
  onAddClick: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onAddClick }) => {
  return (
    <div className="w-full text-white rounded-md mb-4">
      <div className="flex items-center">
        {/* <h2 className="text-md font-semibold mx-auto">{title}</h2> */}
        <div className="ml-auto">
          <button className="ml-1 px-2 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-400 transition" onClick={onAddClick} >
            <div className="flex space-x-1">
              <span className="text-md">Ajouter</span> 
              <PlusCircleIcon className="h-6 z-6" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
