import React, { useEffect } from "react";
import URLS from "../../js/ConfigUrl"
import AuthUser from "../AuthUser/AuthUser"

interface DataItem {
    id: number;
    name: string;
    head_name: string;
}

interface ModalFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  fields: any[];
}

const ModalSpecialitiesInfo: React.FC<ModalFormProps> = ({
    showModal,
    setShowModal,
    title,
    fields,
    }) =>  {

    const {token} = AuthUser()
    
    if (!showModal) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-brightness-50 ">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full transform scale-100 dark:bg-boxdark">
            <h3 className="text-xl font-semibold mb-6">{title}</h3>

            {fields?.map((elm) => (
                <div className="space-y-3">
                    <div>
                        <span className="font-bold">Nom : </span>{elm.name}
                    </div>
                    <div>
                        <span className="font-bold">Description : </span>{elm.description}
                    </div>
                    <div>
                        <span className="font-bold">Departement : </span>{elm.department_name}
                    </div>
                </div>
            ))}

            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Fermer
                </button>
            </div>
        </div>
        </div>
    );
};

export default ModalSpecialitiesInfo;
