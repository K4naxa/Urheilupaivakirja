import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmModal from "../../components/confirm-modal/confirmModal";
import { useQuery } from "@tanstack/react-query";
import formatDate from "../../utils/formatDate";

function VisitorProfilePage() {
  const { logout } = useAuth();

  // statet Modalia varten
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [continueButton, setContinueButton] = useState("");
  const [agreeStyle, setAgreeStyle] = useState("");
  const [handleUserConfirmation, setHandleUserConfirmation] = useState(
    () => {}
  );

  const { data: visitorData, isLoading: visitorDataLoading } = useQuery({
    queryKey: ["visitorData"],
    queryFn: () => userService.getVisitorData(),
    staleTime: 15 * 60 * 1000,
  });

  const getAccountAge = (date) => {
    const today = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (visitorDataLoading) {
      return;
    }
    console.log("visitorData", visitorData);
  }, [visitorDataLoading, visitorData]);
  const handleAccountDelete = () => {
    setShowConfirmModal(true);
    setAgreeStyle("red");
    setModalMessage(
      `Haluatko varmasti poistaa käyttäjän ${visitorData.first_name} ${visitorData.last_name}? 
  
      Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`
    );
    setContinueButton("Poista");

    const handleUserConfirmation = async () => {
      try {
        await userService.deleteUser(visitorData.id);
        await logout(); // Ensure this clears tokens/sessions
      } catch (error) {
        console.error("Error deleting user or logging out:", error);
      } finally {
        setShowConfirmModal(false);
      }
    };
    setHandleUserConfirmation(() => handleUserConfirmation);
  };

  if (visitorDataLoading) {
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
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Etunimi:</p>{" "}
              <p>{visitorData.first_name}</p>
              {visitorData.email}
            </div>
            <div className="flex gap-2">
              <p className="text-textSecondary">Sukunimi:</p>{" "}
              <p>{visitorData.last_name}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Sähköposti:</p>{" "}
              <p>{visitorData.email}</p>
            </div>
          </div>
          <div className="px-2 py-4">
            <div className="flex gap-2">
              <p className="text-textSecondary">Käyttäjä luotu:</p>{" "}
              <p>
                {formatDate(new Date(visitorData.created_at), "dd/MM/yyyy")}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="text-textSecondary">Käyttäjän ikä:</p>{" "}
              <p>{getAccountAge(visitorData.created_at)}vrk</p>
            </div>
          </div>

          <div className="flex px-2 py-4 w-full justify-center gap-2 ">
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
        <ConfirmModal
          isOpen={showConfirmModal}
          onDecline={() => setShowConfirmModal(false)}
          onAgree={handleUserConfirmation}
          text={modalMessage}
          agreeButton={continueButton}
          declineButton={"Peruuta"}
          agreeStyle={agreeStyle}
        />
      </div>
    );
}

export default VisitorProfilePage;
