import React from "react";
import { Plus, X } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  onAddClick: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onAddClick }) => {
  return (
    <div className="w-full bg-[#0c2461] text-white p-3 rounded-lg mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mx-auto">{title}</h2>
        <div className="flex gap-3 ml-auto">
          <button className="flex gap-2 px-4 py-1 text-white font-semibold rounded-lg hover:bg-gray-200 transition">
            Supprimer <X size={30} className="text-yellow-500" />
          </button>
          <button className="flex gap-2 px-4 py-1 text-white font-semibold rounded-lg hover:bg-gray-200 transition" onClick={onAddClick} >
            Ajouter <Plus size={30} className="text-yellow-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
