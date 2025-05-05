import React, { useEffect, useState } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import AuthUser from "../../components/AuthUser/AuthUser";
import DataDep from "../../components/Tables/DataDep";

import URLS from "../../js/ConfigUrl"
import CardFooterWithPagination from "../../components/Pagination/Pagination";
import { PlusCircleIcon, CheckBadgeIcon, UserCircleIcon, BookOpenIcon, BookmarkSlashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import ModalFormDept from "../../components/Modals/ModalDep";

import { useFetch } from "../../js/useFetch"
import { Link, useParams } from "react-router-dom";
import ModalCoursContenu from "../../components/Modals/ModalCoursContenu";
import VideoPlayer from "../../components/VideosStream/VideoPlayer";
import ModalModifyCourseContent from "../../components/Modals/ModalModifyCourseContent";

interface DataItem {
    id: number;
    content: string;
    course_data: {
        id: string,
        instructor: string,
        instructor_id: string,
        name: string,
        speciality: string
    };
    title: string;
    type: string
}

interface PlaylistResponse {
    playlist: string; // L'URL de la playlist HLS
  }
  
  interface ThumbNailUrl {
    thumbnail: string; // L'URL de la playlist HLS
  }
  
  interface CompletImage {
    image: string; // L'URL de la playlist HLS
  }
  
  interface PdfFileUrl {
    file_url: string; // L'URL de la playlist HLS
  }

  interface FieldsInterface {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
  }

const CoursContentView = () => {

    const { handlePost, handleFetch, handleDelete, handlePatch } = useFetch();

    const {token, user} = AuthUser()
    let headersList = {
        "Authorization": `Bearer ${token}` 
    }

    const { uuid } = useParams<{ uuid: string }>();

    const [showModal, setShowModal] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    
    const [data, setData] = useState<DataItem>();
    const [hlsList, setHlsList] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const [thumbNail, setThumbNail] = useState<string | null>(null);
    const [completeImage, setCompleteImage] = useState<string | null>(null); 


    const isValidUUID = (uuid: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    };

    const fetchData = async () => {
        try {
          const result = await handleFetch(`${URLS.API_BACK}/content_courses_detail/${uuid}/`);
  
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

    const handleGetHls = async () => {
  
        try {
            const response = await fetch(`${URLS.API_BACK_FILE}/api/video/${data?.id}/hls_playlist/`, {
              method: "GET",
              // body: formData,
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   },
            });
      
            if (!response.ok) {
              throw new Error(`Erreur lors de la recuperation du hls`);
            }
  
            const dataHls: PlaylistResponse = await response.json()
      
            console.log("playListDetail", dataHls.playlist);
  
            setHlsList(dataHls.playlist)
          } catch (error) {
            console.error(error);
            return;
        }
    };

    const getPdfUrl = async () => {
  
        try {
            const response = await fetch(`${URLS.API_BACK_FILE}/api/doc/${data?.id}/get_pdf_url/`, {
              method: "GET",
              // body: formData,
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   },
            });
      
            if (!response.ok) {
              throw new Error(`Erreur lors de la recuperation du hls`);
            }

            const pdfUrl: PdfFileUrl = await response.json()
  
            setFileUrl(pdfUrl.file_url)
          } catch (error) {
            console.error(error);
            return;
        }
    };
    
    const handleGetThumbnail = async ( complete: boolean ) => {

        try {
            const response = await fetch(`${URLS.API_BACK_FILE}/api/image/${data?.id}/get_thumbnail/?complete_image=${complete}`, {
                method: "GET",
                // body: formData,
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   },
            });
        
            if (!response.ok) {
                throw new Error(`Erreur lors de la recuperation du hls`);
            }

            
        
            // console.log("thumbnail", data.thumbnail);

            if (complete) {
                const cImage: CompletImage = await response.json()
                setCompleteImage(cImage.image); // Stocker l'image complète
            } else {
                const tImage: ThumbNailUrl = await response.json()
                setThumbNail(tImage.thumbnail); // Stocker le thumbnail
            }

            // setThumbNail(data.thumbnail)
            } catch (error) {
            console.error(error);
            return;
        }
    };

    const handleFormPatch = async (formData: { [key: string]: string }, functionMedia: (id: string) => void) => {
        console.log("Données soumises:", formData);

        let deleteVideoFile
        let deletePdfFile
        let deleteImageFile

        let passed = true

        let patchUrl = `${URLS.API_BACK}/content_courses_detail/${data?.id}/`
        let urlVideo = `${URLS.API_BACK_FILE}/api/video/${data?.id}/hls_playlist/`
        let urlImg = `${URLS.API_BACK_FILE}/api/image/${data?.id}/get_thumbnail/?complete_image=${true}`
        let urlPdf = `${URLS.API_BACK_FILE}/api/doc/${data?.id}/get_pdf_url/`

        let urlDelFile = `${URLS.API_BACK_FILE}/api/delete_file/${data?.type}/${data?.id}/`

        if (data?.type === "pdf"){
            let response = await handleFetch(urlPdf)
            if (response.status === 200) {
                deletePdfFile = await handleDelete(urlDelFile)
                if (deletePdfFile.status === 200){
                    passed = true
                }
                else{
                    passed = false
                }
            }
        }

        if (data?.type === "video"){
            let response = await handleFetch(urlVideo)
            if (response.status === 200) {
                deleteVideoFile = await handleDelete(urlDelFile)
                if (deleteVideoFile.status === 200){
                    passed = true
                }
                else{
                    passed = false
                }
            }
        }

        if (data?.type === "image"){
            let response = await handleFetch(urlImg)
            if (response.status === 200) {
                deleteImageFile = await handleDelete(urlDelFile)
                if (deleteImageFile.status === 200){
                    passed = true
                }
                else{
                    passed = false
                }
            }
        }

        // if(passed){
            const response = await handlePatch(patchUrl, formData)
            if (response.status === 200) {
                let message = await functionMedia(response.id)
                // setMessageSuccess(String(message))
                fetchData();
            }
        // }
        // else {
        //     window.alert("une erreur est survenue !!")
        // }
    };

    const [fields, setFields] = useState<FieldsInterface[]>([
        { name: "name", label: "Nom", type: "text", placeholder: "Entrez le nom du cours", value: data?.title || "" },
    ]);

    useEffect(() => {
        if (uuid && isValidUUID(uuid)) {
            fetchData()
        } else {
        console.log('UUID invalide');
        }
    }, [uuid]);

    useEffect(() => {
        if (data?.type === "image") {
            handleGetThumbnail(true)
        }

        if (data?.type === "pdf") {
            getPdfUrl()
        }

        if (data?.type === "video") {
            handleGetHls()
        }
    }, [data]);

    return (
        <>
            {/* Modal dynamique */}
            <ModalModifyCourseContent showModal={showModal} setShowModal={setShowModal} onSubmit={handleFormPatch} title="Modifier contenu du cours" fields={fields} idCours={(data?.course_data.id ?? '').toString()} courseData={data} />

            <Breadcrumb pageName={`Cours - ${data?.course_data.name}`} />
            <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 mb-6 dark:bg-boxdark">
                <div className="py-2 flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className="text-xl font-bold">Titre</div>
                        <div className="underline text-blue-400">{data?.title}</div>
                    </div>
                    {/* <span>Type : {data?.type}</span> */}
                    {/* <span>Modifier</span> */}
                    {user?.id === data?.course_data.instructor_id &&
                        <button className="ml-1 px-2 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition" onClick={() => setShowModal(true)} >
                            <div className="flex space-x-1">
                                <span className="text-md">Modifier</span> 
                                <PencilSquareIcon className="h-6 z-6" />
                            </div>
                        </button>
                    }
                </div>
                <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                <div className="py-2 flex items-center space-x-3">
                    <span className="text-xl font-bold">Spécialité</span> 
                    <span className="">{data?.course_data.speciality}</span>
                </div>
                <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                <div>
                    <span className="text-xl font-bold">Contenu</span> 
                    <div className="flex space-x-2 pt-2">
                        <span className="">{data?.content}</span>
                    </div>
                </div>

        
                {data?.type === "pdf" && 
                    <div>
                        <hr className="border-t border-dashed border-gray-400 mt-5 mb-1 ml-1" />
                        {fileUrl && (
                            <div>
                                <div className="text-center font-semibold">Pdf</div>
                                <div className="pt-2 text-center">
                                    Téléchargez le pdf ici : <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:cursor-pointer hover:underline">Télecharger</a>
                                </div>
                            </div>
                        )}
                    </div>
                }
                {data?.type === "image" && 
                    <div>
                        <hr className="border-t border-dashed border-gray-400 mt-5 mb-1 ml-1" />
                        <div className="text-center font-semibold">Image</div>
                        <div className="pt-2 flex justify-center">
                            {completeImage && <img src={completeImage} alt="Image Complète" className="rounded-md"/>}
                        </div>
                    </div>
                }

                {data?.type === "video" && 
                    <div>
                        <hr className="border-t border-dashed border-gray-400 mt-5 mb-1 ml-1" />
                        <div className="text-center font-semibold">Video</div>
                        <div className="pt-2 flex justify-center z-0">
                            <VideoPlayer playlistUrl={ hlsList }/>
                        </div>
                    </div>
                }           
                <div className="pt-6">
                    <div className="text-xl font-bold text-center">Professeur</div>
                    <hr className="border-t border-dashed border-gray-400 mt-2 mb-1 ml-1" />
                    <div className="pt-2 flex flex-col justify-center items-center">
                        <div className="bg-zinc-300 w-36 h-28 rounded-md">
                            <UserCircleIcon className="h-28 w-36 text-gray-500" />
                        </div>
                        <div className="font-bold text-center">
                            Dr {data?.course_data.instructor.toLocaleUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default CoursContentView;
