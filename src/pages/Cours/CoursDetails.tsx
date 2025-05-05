import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import AuthUser from "../../components/AuthUser/AuthUser";
import DataDep from "../../components/Tables/DataDep";

import URLS from "../../js/ConfigUrl"
import CardFooterWithPagination from "../../components/Pagination/Pagination";
import { PlusCircleIcon, CheckBadgeIcon, UserCircleIcon, BookOpenIcon, BookmarkSlashIcon } from "@heroicons/react/24/solid";
import ModalFormDept from "../../components/Modals/ModalDep";

import { useFetch } from "../../js/useFetch"
import { Link, useParams } from "react-router-dom";
import ModalCoursContenu from "../../components/Modals/ModalCoursContenu";


interface DataItem {
    id: string;
    name: string;
    instructor_name: string;
    description: string;
    contents: any [];
    instructor: string;
    speciality_data: {
        id: string,
        name: string,
        dept_name: string
    },
    enrollments: any[]
}

interface FieldsInterface {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
}

const CoursDetails = () => {

    const { handlePost, handleFetch } = useFetch();

    const [showModal, setShowModal] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");

    const [fields, setFields] = useState<FieldsInterface[]>([
        { name: "title", label: "Nom", type: "text", placeholder: "Entrez le nom du contenu", value: "" },
        // { name: "contenu", label: "Contenu", type: "text", placeholder: "Entrez le contenu de votre cours", value: "" }
    ]);


    const {token, user} = AuthUser()
    let headersList = {
        "Authorization": `Bearer ${token}` 
    }

    const [data, setData] = useState<DataItem>();

    const { uuid } = useParams<{ uuid: string }>();

    const isValidUUID = (uuid: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    };

    const fetchData = async () => {
      try {
        const result = await handleFetch(`${URLS.API_BACK}/courses/${uuid}/`);

        // if (!response.ok) {
        //   throw new Error(`Erreur HTTP ${response.status}: Impossible de récupérer les données`);
        // }
    
        // Si ton API renvoie { data: {...} }, garde `result.data`
        // Sinon, utilise `result` directement
        setData(result.data);
    
      } catch (error) {
        console.error(error);
      }
    };

    const alreadyEnrrolled = () => {
        // let checkEnrolled: any[] | undefined = [];
        let checkEnrolled = data?.enrollments.filter((elm)=>(elm.student === user?.id))
        if(checkEnrolled?.length > 0){
            setEnrolled(true)
        }
    }

    const handleFormSubmit = async (formData: { [key: string]: string }, functionMedia: (id: string) => void) => {
        console.log("Données soumises:", formData);

        let url = `${URLS.API_BACK}/content_courses/${data?.id}/`

        const response = await handlePost(url, formData)

        if (response.status === 201) {
            let message = await functionMedia(response.id)
            setMessageSuccess(String(message))
            fetchData();
        }
    };

    const handlesubscribe = async (course_id: string ) => {
        console.log("Données course_id:", course_id);

        const data_course = {course_id}

        let url = `${URLS.API_BACK}/enrollments/`

        const response = await handlePost(url, data_course)

        if (response.status === 201) {
            setMessageSuccess("inscription fais avec succes")
            fetchData();
        }
    };
  
    useEffect(() => {
        if (uuid && isValidUUID(uuid)) {
            fetchData()
        } else {
        console.log('UUID invalide');
        }
    }, [uuid]);

    useEffect(() => {
        alreadyEnrrolled()
    }, [data]);
  

    return (
        <>
            <Breadcrumb pageName="Cours - Détails" />

            {/* <div>{messageSuccess ? messageSuccess : "Null"}</div> */}

            {/* Modal dynamique */}
            <ModalCoursContenu showModal={showModal} setShowModal={setShowModal} onSubmit={handleFormSubmit} title="Creer contenu du cours" fields={fields} idCours={(data?.id ?? '').toString()} />


            <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6 dark:bg-boxdark">
                <div className="py-2 flex justify-between items-center">
                    <div className="text-xl font-bold">{data?.name}</div>
                    <div className="flex">
                        {(user?.id !== data?.instructor && user?.is_superuser !== true && enrolled !== true) &&
                            <button className="ml-1 px-2 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-400 transition" onClick={() => handlesubscribe(data?.id as string)} >
                                <div className="flex space-x-1">
                                    <span className="text-md">S'inscrire</span>
                                    <PlusCircleIcon className="h-6 z-6" />
                                </div>
                            </button>
                        }
                        {user?.id === data?.instructor &&
                            <button className="ml-1 px-2 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition" onClick={() => setShowModal(true)} >
                                <div className="flex space-x-1">
                                    <span className="text-md">Creer contenu</span> 
                                    <PlusCircleIcon className="h-6 z-6" />
                                </div>
                            </button>
                        }
                    </div>
                </div>
                <div className="md:w-[700px]">
                    {data?.description}
                </div>
                <div className="pt-6">
                    <div>
                        <span className="text-xl font-bold">Spécialités du cours </span> 
                        <div className="flex space-x-2 pt-2">
                            <div><CheckBadgeIcon className="h-6 w-6 text-gray-500" /></div>
                            <span className="">{data?.speciality_data.name}</span>
                        </div>
                    </div>
                    <div className="pt-6">
                        <span className="text-xl font-bold">Contenu du cours </span> 
                        {data?.contents.length === 0 ? 
                            <div className="flex space-x-2 pt-2">
                                <BookmarkSlashIcon className="h-6 w-6 text-gray-500" />
                                <span>Ce cours n'a pas encore de contenu</span>
                            </div> 
                        : 
                            null
                        }
                        {data?.contents?.map((elm)=>(
                            <div key={elm.id} className="mt-4">
                                <div key={elm.id} className="flex space-x-2 pt-2">
                                    <div><BookOpenIcon className="h-6 w-6 text-gray-500" /></div>
                                    <span className="font-bold">{elm.title}</span>
                                </div> 
                                <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                                <div className="space-x-4">
                                    <span>Type du contenu : {elm.type}</span>
                                    <span className="font-bold text-blue-400 underline">
                                        <Link to={`/cours_content_detail/${elm.id}`}>Acceder</Link>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6">
                        <div className="text-xl font-bold text-center">Professeur</div>
                        <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                        <div className="pt-2 flex flex-col justify-center items-center">
                            <div className="bg-zinc-300 w-36 h-28 rounded-md">
                                <UserCircleIcon className="h-28 w-36 text-gray-500" />
                            </div>
                            <div className="font-bold text-center">
                                Dr {data?.instructor_name.toLocaleUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default CoursDetails;