import React, { useState, useRef } from "react";
import { CameraIcon, PencilSquareIcon, PrinterIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import AuthUser from "../components/AuthUser/AuthUser";

const Profile = () => {
  const { user } = AuthUser();
  const [profilePic, setProfilePic] = useState(user.profile_picture || "https://via.placeholder.com/150");
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);
  const profileRef = useRef(null);

  const [fields, setFields] = useState([
    { name: "username", label: "Username", type: "text", placeholder: "Entrez le nom d'utilisateur", value: user.username || "" },
    { name: "email", label: "Email", type: "email", placeholder: "Entrez l'email", value: user.email || "" },
    { name: "matricule", label: "Matricule", type: "text", placeholder: "Entrez le matricule", value: user.matricule || "" },
    { name: "telephone", label: "Téléphone", type: "tel", placeholder: "Entrez le téléphone", value: user.telephone || "" },
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (index, value) => {
    const newFields = [...fields];
    newFields[index].value = value;
    setFields(newFields);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = profilePic;
    link.download = "profile_picture.png";
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Mon Profil</h2>
      
      {/* Photo de Profil + Modifier */}
      <div className="flex items-center justify-center space-x-6 relative">
        <div className="relative">
          {/* Image du profil */}
          <img 
            src={profilePic} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover" 
          />
          
          {/* Icône Caméra pour changer l'image */}
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white shadow-lg hover:bg-blue-600 transition"
          >
            <CameraIcon className="w-6 h-6" />
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageChange} 
          />
        </div>

        {/* Informations utilisateur */}
        <div>
          <h3 className="text-xl font-bold">{fields.find(f => f.name === "username").value}</h3>
          <p className="text-gray-600">{fields.find(f => f.name === "email").value}</p>
          <button 
            onClick={() => setEditMode(true)} 
            className="flex items-center mt-2 text-blue-600 hover:text-blue-800"
          >
            <PencilSquareIcon className="w-5 h-5 mr-1" /> Modifier
          </button>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Informations personnelles</h4>
        {editMode ? (
          <div className="mt-2 space-y-3">
            {fields.map((field, index) => (
              <div key={field.name}>
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={() => setEditMode(false)}>
              Enregistrer
            </button>
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {fields.map((field) => (
              <li key={field.name}>
                <strong>{field.label} :</strong> {field.value || "Non spécifié"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Boutons Imprimer & Télécharger */}
      <div className="flex justify-center space-x-6 mt-6">
        {/* Bouton Imprimer */}
        <button 
          onClick={handlePrint} 
          className="flex items-center bg-red-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          <PrinterIcon className="w-6 h-6 mr-2" /> Imprimer
        </button>

        {/* Bouton Télécharger */}
        <button 
          onClick={handleDownload} 
          className="flex items-center bg-green-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          <ArrowDownTrayIcon className="w-6 h-6 mr-2" /> Télécharger
        </button>
      </div>
    </div>
  );
};

export default Profile;
