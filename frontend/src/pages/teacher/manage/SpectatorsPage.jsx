import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import spectatorService from "../../../services/spectatorService";
import LoadingScreen from "../../../components/LoadingScreen";
import { FiTrash2 } from "react-icons/fi";
import formatDate from "../../../utils/formatDate";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useToast } from "../../../hooks/toast-messages/useToast";

const SpectatorsPage = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();
  const [newSpectatorEmail, setNewSpectatorEmail] = useState("");
  const { addToast } = useToast();

  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = (spectator) => {
    console.log("Deleting spectator:", spectator);
    const handleUserConfirmation = async () => {
      await spectatorService.deleteUser(spectator.id).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["studentsAndJournals"],
        });
      });
      queryClient.invalidateQueries({ spectators });
    };

    const modalText = (
      <span>
        Haluatko varmasti poistaa vierailijan
        <br />
        <strong>
          {spectator.first_name} {spectator.last_name}?
        </strong>
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

  const inviteSpectator = useMutation({
    mutationFn: () =>
      spectatorService.inviteSpectator(newSpectatorEmail),
    onError: (error) => {
      console.error("Error inviting spectator:", error);
      addToast("Virhe kutsuttaessa vierailijaa", { style: "error" });
    },
    onSuccess: (user) => {
      addToast("Vierailijakutsu lähetetty", { style: "success" });
      queryClient.invalidateQueries({invitedSpectators});
    },
  });

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!newSpectatorEmail) {
      setErrorMessage("Syötä sähköpostiosoite");
      return;
    }
    await inviteSpectator.mutate();
    setNewSpectatorEmail("");
   }

  const { data: spectators, isLoading: spectatorsLoading } = useQuery({
    queryKey: ["spectators"],
    queryFn: () => spectatorService.getSpectators(),
    config: {
      enabled: false,
    },
  });

  const { data: invitedSpectators } = useQuery({
    queryKey: ["invitedSpectators"],
    queryFn: () => spectatorService.getInvitedSpectators(),
    config: {
      enabled: false,
    },
  });

  return (
    <div className="w-full items-center bg-bgSecondary rounded-md p-2">
      <div>
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
        <div className="flex flex-col w-full px-4 ">
          <div className="flex gap-4 justify-center w-full items-end">
            <form onSubmit={handleSendInvitation}className="flex flex-col w-3/4">
              <label htmlFor="newSpectatorInput" className="my-0.5">
                Kutsu uusi vierailija
              </label>
              <div className="flex">
                <input
                  className="flex-grow text-textPrimary bg-bgGray p-1 
                border border-borderPrimary rounded-l-md
                focus-visible:outline-none"
                  type="text"
                  placeholder="Vierailijan sähköpostiosoite"
                  value={newSpectatorEmail}
                  onChange={(e) => setNewSpectatorEmail(e.target.value)}
                  id="newSpectatorInput"
                />

                <button className="rounded-r w-max px-4 py-2 text-white bg-primaryColor border border-primaryColor whitespace-nowrap align-bottom">
                  Lähetä
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-col w-full ">
          <h2 className="text-xl m-2">Vierailijat</h2>
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
    <div className="flex w-full border border-borderPrimary rounded-md p-2">
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

export default SpectatorsPage;
