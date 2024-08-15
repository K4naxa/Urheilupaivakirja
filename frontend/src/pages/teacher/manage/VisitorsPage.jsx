import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import userService from "../../../services/userService";
import LoadingScreen from "../../../components/LoadingScreen";
import { FiTrash2 } from "react-icons/fi";
import formatDate from "../../../utils/formatDate";
import { useConfirmModal } from "../../../hooks/useConfirmModal";

const VisitorsPage = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();

  const [errorMessage, setErrorMessage] = useState("");


  const handleDelete = (spectator) => {

    const handleUserConfirmation = async () => {
      await userService.deleteUser(spectator.user_id).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["studentsAndJournals"],
        });
      });
      queryClient.invalidateQueries({ spectators });
    };

    const modalText = (
      <span>
        Haluatko varmasti poistaa vierailijan
        <br/>
        <strong>{spectator.first_name} {spectator.last_name}?</strong>
        <br />
        Tämä poistaa kaikki vierailijan tiedot pysyvästi.`
      </span>
    );    

    openConfirmModal({
      onAgree: handleUserConfirmation,
      text: modalText,
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
      useTimer: true,
    });
  };

  const { data: spectators, isLoading: spectatorsLoading } = useQuery({
    queryKey: ["spectators"],
    queryFn: () => userService.getSpectators(),
    config: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!spectatorsLoading) console.log(spectators);
  }, [spectators, spectatorsLoading]);

  return (
    <div className="w-full items-center bg-bgSecondary rounded-md">
      {/* Mobile header / error Message */}
      <div>
        <div
          className="md:hidden text-2xl text-center py-4 bg-primaryColor w-full
       rounded-b-md shadow-md"
        >
          Vierailijat
        </div>

        {/* Error Header */}
        {errorMessage && (
          <div
            id="errorHeader"
            className="bg-btnRed w-full text-textPrimary text-center text-lg p-2
          mb-4 animate-menu-appear-top shadow-md rounded-b-md relative"
          >
            <button
              onClick={() => setErrorMessage("")}
              className="absolute right-4 bottom-1/2 translate-y-1/2"
            >
              X
            </button>
            {errorMessage}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full gap-8 border border-borderPrimary p-4 rounded-md">
        <div className="flex flex-col w-full p-4 ">
          <div className="flex gap-4 justify-center w-full items-end">
            <div className="flex flex-col w-3/4">
              <label htmlFor="newVisitorInput">Kutsu uusi vierailija</label>
              <input
                type="text"
                name="newVisitorInput"
                id="newVisitorInput"
                placeholder="Vierailijan sähköposti"
                className="text-textPrimary bg-bgGray p-1 
                  border border-borderPrimary rounded-md
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor mt-1"
              />
            </div>
            <button className="Button bg-bgGray border border-primaryColor h-10 align-bottom">
              Lähetä
            </button>
          </div>
        </div>
        <div className="flex-col w-full ">
          <h2 className="text-xl">Vierailijat</h2>
          <div className="flex flex-col gap-4">
            {spectatorsLoading ? (
              <div>{LoadingScreen()}</div>
            ) : (
              spectators.map((spectator) => (
                <CreateSpectatorCard
                  spectator={spectator}
                  handleDelete={handleDelete}
                  key={spectator.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateSpectatorCard = ({ spectator, handleDelete }) => {
  const calcTimeFromLogin = (loginTime) => {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const diff = now - loginDate;
    const diffInMinutes = diff / 1000 / 60;
    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minuuttia sitten`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} tuntia sitten`;
    } else {
      return `${Math.floor(diffInMinutes / 60 / 24)} päivää sitten`;
    }
  };

  const created_at = formatDate(new Date(spectator.created_at), "d.m.Y");
  const last_login_at = spectator.last_login_at
    ? calcTimeFromLogin(spectator.last_login_at)
    : null;

  return (
    <div className="flex w-full border border-borderPrimary rounded-md">
      <div className="flex flex-col gap-2 p-2  w-full">
        {/* name and email row */}
        <div className="flex flex-wrap gap-4 items-end">
          <span className="text-lg">
            {spectator.first_name} {spectator.last_name}
          </span>
          <span className="text-textSecondary">{spectator.email}</span>
        </div>

        {/* additional info row */}
        <div className="flex gap-4 flex-wrap">
          <span className="text-textSecondary">
            Rekisteröitynyt: {created_at || "Ei rekisteröitynyt"}
          </span>
          <span className="text-textSecondary">
            Viimeksi kirjautunut: {last_login_at || "Ei kirjautunut"}
          </span>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <button
          className="IconButton text-iconRed"
          onClick={() => handleDelete(spectator)}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default VisitorsPage;
