import React, { useEffect, useState } from "react";
import URLS from "../../js/ConfigUrl"
import AuthUser from "../AuthUser/AuthUser"
import { v4 as uuidv4 } from "uuid";
import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";

interface DataItem {
    id: number;
    name: string;
    head_name: string;
    username: string;
}

interface ModalFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: { [key: string]: string }, uploadHandler: (id: string) => void) => void;
  title: string;
  fields: any[];
  idCours: string;
  courseData: any[]
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


const CHUNK_SIZE = 2 * 1024 * 1024;

const ModalModifyCourseContent: React.FC<ModalFormProps> = ({
    showModal,
    setShowModal,
    onSubmit,
    title,
    fields,
    idCours,
    courseData
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

    const [textContent, setTextContext] = React.useState<string>();
    const [selectedType, setSelectedType] = React.useState<string>();
    const [selectedName, setSelectedName] = React.useState<string>();

    const [file, setFile] = useState<File | null>(null); // Déclaration du type File pour la variable 'file'
    const [image, setImage] = useState<File | null>(null);

    const [pdf, setPdf] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const [thumbNail, setThumbNail] = useState<string | null>(null);
    const [completeImage, setCompleteImage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const selected = e.target.files[0];
    
        if (selected.size > 10 * 1024 * 1024) {
            console.log("Le fichier dépasse 10 Mo.");
            return;
        }
    
        if (selected.type !== "application/pdf") {
            console.log("Seuls les fichiers PDF sont autorisés.");
            return;
        }
    
        setPdf(selected);
        }
    };

    const handleUploadPdf = async (id: string) => {
        if (!pdf) return;

        const formData = new FormData();
        formData.append('file', pdf);
        formData.append('self_id', id);
        formData.append('token', String(token));

        try {
            const response = await fetch(`${URLS.API_BACK_FILE}/api/upload_file/`, {
            method: "POST",
            // headers: {
            //   'Content-Type': 'multipart/form-data',
            // },
            body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de l'envoi du pdf`);
            }

            const data: PdfFileUrl = await response.json()

            // setFileUrl(data.file_url);

            let ended = "upload pdf terminé"

            return data.file_url

            // return data
        } catch (err) {
            console.log("Échec de l'envoi");
        }
    };

    const handleUpload = async (id: string) => {
        if (!file) return; // Si aucun fichier n'est sélectionné, on arrête

        const fileId = uuidv4(); // Génère un ID unique pour ce fichier
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // Calcul du nombre total de chunks

        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append("file_id", fileId);
            formData.append("chunk_number", i.toString()); // 'chunk_number' doit être une chaîne
            formData.append("total_chunks", totalChunks.toString()); // 'total_chunks' doit être une chaîne
            formData.append("file_name", file.name);
            formData.append("file", chunk);
            formData.append("self_id", id);
            formData.append('token', String(token));


            try {
                const response = await fetch(`${URLS.API_BACK_FILE}/api/upload_chunk/`, {
                method: "POST",
                body: formData,
                //   headers: {
                //     "Content-Type": "multipart/form-data",
                //   },
                });
        
                if (!response.ok) {
                    throw new Error(`Erreur lors de l'envoi du chunk ${i + 1}: ${response.statusText}`);
                }
        
                console.log(`Chunk ${i + 1} envoyé`);
            } catch (error) {
                console.error(`Erreur lors de l'envoi du chunk ${i + 1}:`, error);
                return;
            }
        }

        let ended = "upload video terminé"

        return ended

        // console.log("Upload terminé !");
        };

    const handleUploadImage = async (id: string) => {
        if (!image) return; // Si aucun fichier n'est sélectionné, on arrête

        const formData = new FormData();
            formData.append("self_id", id);
            formData.append("image_file", image);
            formData.append('token', String(token));


        try {
            const response = await fetch(`${URLS.API_BACK_FILE}/api/upload_image/`, {
                method: "POST",
                body: formData,
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   },
            });
        
            if (!response.ok) {
                throw new Error(`Erreur lors de l'envoi de l'image`);
            }

            let ended = "upload image terminé"

            return ended
        
            // console.log(`Image envoyé`);
            } catch (error) {
            console.error(`Erreur lors de l'envoi de l'image:`, error);
            return;
        }
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormData({
    //     ...formData,
    //     [e.target.name]: e.target.value,
    //     });

    //     console.log(formData);
    // };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // let uploadHandler;

        const uploadHandler =
            selectedType === "image"
                ? handleUploadImage
                : selectedType === "video"
                ? handleUpload
                : selectedType === "pdf"
                ? handleUploadPdf
                : () => {};

        if (!selectedName) return window.alert("le nom du contenu est requis")
        // if (!formData.description) return window.alert("la description n'est pas forcement requise")
        if (!selectedType) return window.alert("le type du contenu est requis")

        if(selectedType === "text"){
            if (!textContent) return window.alert("veuillez entrer le contenu de votre cours")
        }
        
        if(selectedType === "image"){
            if (!image) return window.alert("veuillez choisir l'image")
            // uploadHandler = handleUploadImage;
        }

        if(selectedType === "video"){
            if (!file) return window.alert("veuillez choisir la video")
            // uploadHandler = handleUpload;
        }

        if(selectedType === "pdf"){
            if (!pdf) return window.alert("veuillez choisir le pdf")
            // uploadHandler = handleUploadPdf;
        }

        onSubmit({title: selectedName as string, type: selectedType as string, course: idCours as string, content: textContent as string}, uploadHandler);

        setFormData((prev) =>
            Object.keys(prev).reduce((acc, key) => {
                acc[key] = "";
                return acc;
            }, {} as { [key: string]: string })
        );

        setSelectedType("")
            
        setShowModal(false);
    };

    useEffect(()=>{
        setSelectedType(courseData?.type)
        setTextContext(courseData?.content)
        setSelectedName(courseData?.title)
    }, [courseData])

    const typeContent = [
        {
            "id" : "1",
            "type" : "video",
        },
        {
            "id" : "2",
            "type" : "pdf",
        },
        {
            "id" : "3",
            "type" : "image",
        },
        {
            "id" : "4",
            "type" : "text",
        }
    ]

    if (!showModal) return null;

    console.log("selectedType :", selectedType, "courseData?.type :", courseData?.type)

    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-brightness-50 z-10">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full transform scale-100 dark:bg-boxdark">
            <h3 className="text-xl font-semibold text-center mb-6">{title}</h3>
            <form className="w-full" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col px-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
                    <input
                    name="course_name"
                    type="text"
                    value={selectedName }
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Entrez le nom du cours"
                    />
                </div>
                <div className="flex-none px-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Type contenu</label>
                    <select 
                        name="type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">selectionner le type de contenu</option>
                        {typeContent?.map((elm) => (
                            <option key={elm.id} value={elm.type}>{elm.type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {<div className="flex flex-col px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">Contenu</label>
                <textarea
                name="text_content"
                value={textContent}
                onChange={(e) => setTextContext(e.target.value)}
                className="w-full h-32 p-3 border border-zinc-300 rounded-md resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-400"
                placeholder={"Saisissez ou copiez et coller votre cour ici..."}
                />
            </div>}

            {/* <div>
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                <button onClick={handleUpload}>Uploader en chunks</button>
            </div> */}

            {/* <div className="pt-20">
            <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
            <button onClick={handleUploadImage}>Upload Image</button>
            </div> */}

            {/* <div className="bg-yellow-500 my-6">
                <h2>Uploader un fichier PDF</h2>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />

                <button onClick={handleUploadPdf} disabled={!pdf}>Envoyer</button>
            </div>  */}
            
            {/* pdf file input */}
            {selectedType === "pdf" && <div className="pl-3 pt-3 flex items-center space-x-4">
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
                >
                    <ArrowUpCircleIcon className="h-6 w-6 text-gray-500" />
                    Importer un fichier
                </label>

                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                    const fileName = e.target.files?.[0]?.name || "Aucun fichier choisi";
                    document.getElementById("file-name")!.textContent = fileName;
                    handleFileChange(e);
                    }}
                    accept="application/pdf" 
                />

                <span id="file-name" className="text-sm text-zinc-500 italic">Aucun fichier choisi</span>
            </div>}

            {/* image file input */}
            {selectedType === "image" && <div className="pl-3 pt-3 flex items-center space-x-4">
                <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
                >
                    <ArrowUpCircleIcon className="h-6 w-6 text-gray-500" />
                    Importer une image
                </label>

                <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                    const fileName = e.target.files?.[0]?.name || "Aucune image choisie";
                    document.getElementById("file-image")!.textContent = fileName;
                    setImage(e.target.files ? e.target.files[0] : null);
                    }}
                    accept="image/*"
                />

                <span id="file-image" className="text-sm text-zinc-500 italic">Aucune image choisie</span>
            </div>}

            {/* video file input */}
            {selectedType === "video" && <div className="pl-3 pt-3 flex items-center space-x-4">
                <label
                    htmlFor="video-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
                >
                    <ArrowUpCircleIcon className="h-6 w-6 text-gray-500" />
                    Importer une video
                </label>

                <input
                    id="video-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                    const fileName = e.target.files?.[0]?.name || "Aucune video choisie";
                    document.getElementById("video-name")!.textContent = fileName;
                    setFile(e.target.files ? e.target.files[0] : null);
                    }}
                    accept="video/*"
                />

                <span id="video-name" className="text-sm text-zinc-500 italic">Aucune video choisie</span>
            </div>}



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
                Modifier
                </button>
                <button
                type="button"
                onClick={() => {setShowModal(false);}}
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

export default ModalModifyCourseContent;
