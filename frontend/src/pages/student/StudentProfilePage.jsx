import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useConfirmModal } from "../../hooks/useConfirmModal";

function StudentProfilePage() {
  const { user, logout } = useAuth();

  const { openConfirmModal } = useConfirmModal();

  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["studentData"],
    queryFn: () => userService.getStudentData(),
    staleTime: 15 * 60 * 1000,
  });

  const getAccountAge = (date) => {
    const today = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAccountDelete = () => {
    const handleUserConfirmation = async () => {
      try {
        await userService.deleteUser(userData.user_id);
        await logout(); // Ensure this clears tokens/sessions
      } catch (error) {
        console.error("Error deleting user or logging out:", error);
      }
    };

    openConfirmModal({
      onAgree: handleUserConfirmation,
      text: `Haluatko varmasti poistaa käyttäjän ${userData.first_name} ${userData.last_name}? 
    Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`,
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
    });
  };

  if (userDataLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  } else
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className=" flex flex-col bg-bgSecondary p-4  rounded-md border border-borderPrimary divide-y divide-borderPrimary">
          <div className="px-2 py-2">
            <header className="relative text-xl text-center mb-4">
              <Link
                to={"/"}
                className="absolute bottom-1/2 translate-y-1/2 left-0 text-2xl hover:scale-125 transition-transform duration-150"
              >
                <FiArrowLeft />
              </Link>
              Käyttäjätiedot
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
          <div className="px-2 py-2">
            <div className="flex gap-2 mb-1">
              <p className="text-textSecondary">Etunimi:</p>{" "}
              <p>{userData.first_name}</p>
            </div>
            <div className="flex gap-2 mt-1">
              <p className="text-textSecondary">Sukunimi:</p>{" "}
              <p>{userData.last_name}</p>
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex gap-2">
              <p className="text-textSecondary">Sähköposti:</p>{" "}
              <p>{userData.email}</p>
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex gap-2">
              <p className="text-textSecondary">Laji:</p>{" "}
              <p>{userData.sport_name}</p>
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex gap-2">
              <p className="text-textSecondary">Ryhmä:</p>{" "}
              <p>{userData.group_identifier}</p>
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex gap-2">
              <p className="text-textSecondary">Toimipaikka:</p>{" "}
              <p>{userData.campus_name}</p>
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex gap-2 mb-1">
              <p className="text-textSecondary">Käyttäjä luotu:</p>{" "}
              <p>{format(new Date(userData.created_at), "dd.MM.yyyy")}</p>
            </div>
            <div className="flex gap-2 mt-1">
              <p className="text-textSecondary">Käyttäjän ikä:</p>{" "}
              <p>{getAccountAge(userData.created_at)}vrk</p>
            </div>
          </div>

          <div className="flex px-2 py-2 w-full justify-center gap-2 ">
            <button
              className="Button bg-iconRed text-white w-32"
              onClick={() => {
                handleAccountDelete();
              }}
            >
              Poista Käyttäjä
            </button>
          </div>
        </div>
      </div>
    );
}

export default StudentProfilePage;
