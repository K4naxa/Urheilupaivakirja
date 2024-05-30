import { useEffect, useState } from "react";
import userService from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";
import { format } from "date-fns";
function StudentProfilePage() {
  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user data");
      try {
        console.log("Fetching user data");
        const response = await userService.getStudentData();
        setUserData(response);
        console.log(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getAccountAge = (date) => {
    const today = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  } else
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className=" flex flex-col bg-bgSecondary p-4 rounded-md border border-borderPrimary divide-y divide-borderPrimary">
          <div className="px-2 py-4">
            <header className="text-xl text-center mb-4">
              Profiili tiedot
            </header>
            <div className="flex justify-around gap-4">
              <div className="border border-borderPrimary px-4 py-2 rounded-md bg-primaryColor text-white ">
                <p>{userData.total_entries_count} merkintää</p>
              </div>
              <div className="border border-borderPrimary px-4 py-2 rounded-md bg-primaryColor text-white">
                {userData.entry_type_1_count} harjoitusta
              </div>
              <div className="border border-borderPrimary px-4 py-2 rounded-md bg-primaryColor text-white ">
                {userData.unique_days_count} aktiivista päivää
              </div>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Etunimi:</p>{" "}
              <p>{userData.first_name}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-textSecondary">Sukunimi:</p>{" "}
              <p>{userData.last_name}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Sähköposti:</p>{" "}
              <p>{userData.email}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Puhelinnumero:</p>{" "}
              <p>{userData.phone}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Laji:</p>{" "}
              <p>{userData.sport_name}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Ryhmä:</p>{" "}
              <p>{userData.group_identifier}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Toimipaikka:</p>{" "}
              <p>{userData.campus_name}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Käyttäjä luotu:</p>{" "}
              <p>{format(new Date(userData.created_at), "dd/MM/yyyy")}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-textSecondary">Käyttäjän ikä:</p>{" "}
              <p>{getAccountAge(userData.created_at)}vrk</p>
            </div>
          </div>

          <div className="flex px-2 py-4 w-full justify-center gap-2 ">
            <button className="Button bg-iconRed text-white w-32">
              Poista Käyttäjä
            </button>
          </div>
        </div>
      </div>
    );
}

export default StudentProfilePage;
