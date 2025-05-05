import { BookOpenIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from 'react-router-dom';

interface DataTableProps {
    data: any[];
    onView: (id: number) => void;
}
const DataCoursEnrollments: React.FC<DataTableProps> = ({data, onView}) => {

  function truncateText(text: string, maxLength: number) {
    if (text?.length <= maxLength) return text;
    return text?.slice(0, maxLength) + "...";
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        {
            data?.length === 0 ? <div className="h-24 flex justify-center items-center">Vous n'etes pas encore inscrit a un cours pour l'instant.</div> 
            : 
            <div className="max-w-full pt-5 flex flex-col md:flex-row md:flex-wrap gap-2">
                {data?.map((elm) =>(
                    <Link to={`/cours/${elm.course_data.id}`} key={elm.id} >
                        <div className="p-2 flex border-zinc-300 border rounded-md hover:cursor-pointer hover:bg-yellow-200">
                            <div className="h-36 min-w-36 w-auto bg-zinc-50 rounded-md p-2 dark:bg-boxdark">
                                <div className="font-bold pb-1">{elm.course_data.name}</div>
                                <div className=""><span>Specialité : </span>{elm.course_data.speciality}</div>
                                <div className="break-all sm:block hidden"><span>Département : </span>{truncateText(elm.course_data.dept_name, 20)}</div>
                                <div className="pt-1"><span>Profésseur : </span>{elm.course_data.instructor}</div>
                            </div>
                            <div className="h-36 w-36 bg-blue-50 rounded-md ml-4 flex justify-center items-center hover">
                                <BookOpenIcon className="h-36 w-36 text-blue-900" /> 
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        }
    </div>
  );
};

export default DataCoursEnrollments;
