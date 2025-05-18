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
  onSubmit: (data: { [key: string]: string }) => void;
  title: string;
  fields: any[];
}

const ModalSpecialities: React.FC<ModalFormProps> = ({
    showModal,
    setShowModal,
    onSubmit,
    title,
    fields,
    }) =>  {

    const {token} = AuthUser()
        let headersList = {
            "Authorization": `Bearer ${token}` 
        }
    
        const [formData, setFormData] = React.useState<{ [key: string]: string }>(
            fields.reduce((acc, field) => {
            acc[field.name] = field.value;
            return acc;
            }, {} as { [key: string]: string })
        );
    
        const [data, setData] = React.useState<DataItem[]>([]);
        const [selectedHeadDepartment, setSelectedHeadDepartment] = React.useState<string>();
    
        // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //     setFormData({
        //     ...formData,
        //     [e.target.name]: e.target.value,
        //     });
    
        //     console.log(formData);
        // };
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
          };
    
        const handleFormSubmit = (e: React.FormEvent) => {
            e.preventDefault();
    
            if (!formData.name) return window.alert("le nom est requis")
            // if (!formData.description) return window.alert("la description n'est pas forcement requise")
            if (!selectedHeadDepartment) return window.alert("veuillez selectionner le nom du departement")
    
            onSubmit({ ...formData, department: selectedHeadDepartment as string});
    
            setFormData((prev) =>
                Object.keys(prev).reduce((acc, key) => {
                    acc[key] = "";
                    return acc;
                }, {} as { [key: string]: string })
            );
    
            setSelectedHeadDepartment("")
              
            setShowModal(false);
        };
    
        const fetchData = async () => {
            try {
            const response = await fetch(
                `${URLS.API_BACK}/departments/`,
                // `${URLS.API_BACK}/list-professeur/?page=${page}&username=${searchTerm.username}&matricule=${searchTerm.matricule}&speciality=${searchTerm.speciality}`,
                {
                method: "GET",
                headers: headersList,
                }
            );
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            const data = await response.json();
            // console.log(data);
            
            setData(data);
            // setTotalPages(data.total_pages);
            } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            }
        };
    
        useEffect(()=>{
            fetchData()
        }, [showModal])
    
        if (!showModal) return null;
    
    
        return (
            <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-brightness-50 ">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full transform scale-100 dark:bg-boxdark">
                <h3 className="text-xl font-semibold text-center mb-6">{title}</h3>
                <form className="w-full" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {fields.map((field) => (
                    <div key={field.name} className="flex flex-col px-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
                        <input
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        className="dark:bg-boxdark w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={field.placeholder}
                        />
                    </div>
                    ))}
                    <div className="flex-none px-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Département</label>
                        <select 
                        name="head"
                        value={selectedHeadDepartment}
                        onChange={(e) => setSelectedHeadDepartment(e.target.value)}
                        className="dark:bg-boxdark w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">selectionner le departement</option>
                            {data?.map((elm) => (
                                <option key={elm.id} value={elm.id}>{elm.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
    
                <div className="flex justify-end gap-4 mt-6">
                    {/* <button
                    type="submit"
                    className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={(e) => handleFormSubmit(e, 'Etudiant')}
                    >
                    Enregistrer en tant qu'étudiant
                    </button> */}
                    <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={(e) => handleFormSubmit(e)}
                    >
                    Enregistrer
                    </button>
                    <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                    Annuler
                    </button>
                </div>
                </form>
            </div>
            </div>
        );
};

export default ModalSpecialities;
