import React from "react";

interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "number";
  placeholder: string;
  value: string;
}

interface ModalFormProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: { [key: string]: string }) => void;
  title: string;
  fields: Field[];
}

const ModalForm: React.FC<ModalFormProps> = ({
  showModal,
  setShowModal,
  onSubmit,
  title,
  fields,
}) => {
  const [formData, setFormData] = React.useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent, role: string) => {
    e.preventDefault();
    onSubmit({ ...formData, role });
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-brightness-50 ">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full transform scale-100">
        <h3 className="text-xl font-semibold text-center mb-6">{title}</h3>
        <form onSubmit={(e) => handleFormSubmit(e, 'etudiant')} className="w-full">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col px-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={(e) => handleFormSubmit(e, 'etudiant')}
            >
              Enregistrer en tant qu'étudiant
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={(e) => handleFormSubmit(e, 'professeur')}
            >
              Enregistrer en tant que professeur
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

export default ModalForm;
