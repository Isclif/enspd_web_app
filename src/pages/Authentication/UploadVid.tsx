import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import VideoPlayer from "../../components/VideosStream/VideoPlayer";

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

// Taille de chaque chunk (2 Mo)
const CHUNK_SIZE = 2 * 1024 * 1024;

const UploadVid: React.FC = () => {

    const [file, setFile] = useState<File | null>(null); // Déclaration du type File pour la variable 'file'
    const [image, setImage] = useState<File | null>(null);

    const [pdf, setPdf] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const [thumbNail, setThumbNail] = useState<string | null>(null);
    const [completeImage, setCompleteImage] = useState<string | null>(null); 

    const [hlsList, setHlsList] = useState<string | null>(null);

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

    const handleUploadPdf = async () => {
      if (!pdf) return;
  
      const formData = new FormData();
      formData.append('file', pdf);
  
      try {
        const response = await fetch('http://localhost:8000/api/upload_file/', {
          method: "POST",
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
          body: formData
        });

        const data: PdfFileUrl = await response.json()
  
        setFileUrl(data.file_url);
      } catch (err) {
        console.log("Échec de l'envoi");
      }
    };

    const handleUpload = async () => {
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

        try {
            const response = await fetch(`http://localhost:8000/api/upload_chunk/`, {
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
  
      // console.log("Upload terminé !");
    };

    const handleUploadImage = async () => {
      if (!image) return; // Si aucun fichier n'est sélectionné, on arrête
  
      const formData = new FormData();
      formData.append("image_file", image);

      try {
          const response = await fetch(`http://localhost:8000/api/upload_image/`, {
            method: "POST",
            body: formData,
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //   },
          });
    
          if (!response.ok) {
            throw new Error(`Erreur lors de l'envoi de l'image`);
          }
    
          console.log(`Image envoyé`);
        } catch (error) {
          console.error(`Erreur lors de l'envoi de l'image:`, error);
          return;
        }
    };

    const handleGetHls = async () => {

      let idVideo = "cd201d9a-124f-4f88-96b3-1ca6b1c1a802"; 

      try {
          const response = await fetch(`http://localhost:8000/api/video/${idVideo}/hls_playlist/`, {
            method: "GET",
            // body: formData,
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //   },
          });
    
          if (!response.ok) {
            throw new Error(`Erreur lors de la recuperation du hls`);
          }

          const data: PlaylistResponse = await response.json()
    
          console.log("playListDetail", data.playlist);

          setHlsList(data.playlist)
        } catch (error) {
          console.error(error);
          return;
        }
    };

    const handleGetThumbnail = async ( complete: boolean     ) => {

      let idImage = "5d4a442d-81df-4b5a-b675-ae111e599f3a"; 

      try {
          const response = await fetch(`http://localhost:8000/api/image/${idImage}/get_thumbnail/?complete_image=${complete}`, {
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
            const data: CompletImage = await response.json()
            setCompleteImage(data.image); // Stocker l'image complète
          } else {
            const data: ThumbNailUrl = await response.json()
            setThumbNail(data.thumbnail); // Stocker le thumbnail
          }

          // setThumbNail(data.thumbnail)
        } catch (error) {
          console.error(error);
          return;
        }
    };
  
    return (
      <div>
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
          <button onClick={handleUpload}>Uploader en chunks</button>
        </div>

        <div>
          <button onClick={handleGetHls}>Recuperer la video hls</button>
        </div>

        <div>
          <VideoPlayer playlistUrl={ hlsList } />
        </div>

        <div className="pt-20">
          <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
          <button onClick={handleUploadImage}>Upload Image</button>
        </div>

        <div className="pt-20">
          {thumbNail && <img src={thumbNail} alt="Image Thumbnail" />}
          <button onClick={() => handleGetThumbnail(false)}>get ThumbNail</button>
        </div>

        <div className="pt-20">
          {completeImage && <img src={completeImage} alt="Image Complète" />}
          <button onClick={() => handleGetThumbnail(true)}>get completeImage</button>
        </div>

        <div className="bg-yellow-500 my-6">
          <h2>Uploader un fichier PDF</h2>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />

          <button onClick={handleUploadPdf} disabled={!pdf}>Envoyer</button>

          {fileUrl && (
            <p>
              Fichier disponible ici : <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
            </p>
          )}
        </div>
  

      </div>
    );
  };

export default UploadVid;
  