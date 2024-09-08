import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import teacherService from "../../../services/teacherService";
import LoadingScreen from "../../../components/LoadingScreen";
import { FiTrash2 } from "react-icons/fi";
import formatDate from "../../../utils/formatDate";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useToast } from "../../../hooks/toast-messages/useToast";

const TeachersPage = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const { addToast } = useToast();

  const [errorMessage, setErrorMessage] = useState("");

  const deleteTeacher = useMutation({
    mutationFn: (teacherId) => teacherService.deleteTeacher(teacherId),
    onError: (error) => {
      console.error("Error deleting teacher:", error);
      addToast("Virhe poistettaessa opettajaa", { style: "error" });
    },
    onSuccess: () => {
      addToast("Opettaja poistettu", { style: "success" });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const revokeInvitationToken = useMutation({
    mutationFn: (id) => teacherService.revokeInvitationToken(id),
    onError: (error) => {
      console.error("Error revoking invitation:", error);
      addToast("Virhe kutsun perumisessa", { style: "error" });
    },
    onSuccess: () => {
      addToast("Kutsu peruttu", { style: "success" });
      queryClient.invalidateQueries({ queryKey: ["invitedTeachers"] });
    },
  });

  const handleDelete = (teacher) => {
    const teacherId = teacher.id;
    console.log("Saved id", teacherId);

    const handleUserConfirmation = (id) => {
      console.log("Deleting teacher", id);
      deleteTeacher.mutate(id);
    };

    const modalText = (
      <span>
        Haluatko varmasti poistaa opettajan
        <br />
        <strong>
          {teacher.first_name} {teacher.last_name}?
        </strong>
        <br />
        Tämä poistaa kaikki opettajan tiedot pysyvästi.
      </span>
    );

    openConfirmModal({
      onAgree: () => handleUserConfirmation(teacherId),
      text: modalText,
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
      useTimer: true,
    });
  };

  const handleRevoke = (invitedTeacher) => {
    const teacherId = invitedTeacher.id;
    const handleUserConfirmation = (id) => {
      revokeInvitationToken.mutate(id);
    };

    const modalText = (
      <span>
        Haluatko varmasti perua kutsun opettajalle
        <br />
        <strong>{invitedTeacher.email}?</strong>
        <br />
      </span>
    );

    openConfirmModal({
      onAgree: () => handleUserConfirmation(teacherId),
      text: modalText,
      agreeButtonText: "Peru",
      agreeStyle: "red",
      declineButtonText: "Takaisin",
      useTimer: true,
    });
  };

  const inviteTeacher = useMutation({
    mutationFn: () => teacherService.inviteTeacher(newTeacherEmail),
    onError: (error) => {
      console.error("Error inviting teacher:", error);
      addToast("Virhe kutsuttaessa opettajaa", { style: "error" });
    },
    onSuccess: (user) => {
      addToast("Opettajakutsu lähetetty", { style: "success" });
      queryClient.invalidateQueries({ queryKey: ["invitedTeachers"] });
    },
  });

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!newTeacherEmail) {
      setErrorMessage("Syötä sähköpostiosoite");
      return;
    }
    await inviteTeacher.mutate();
    setNewTeacherEmail("");
  };

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teacherService.getTeachers(),
    config: {
      enabled: false,
    },
  });

  const { data: invitedTeachers, isLoading: invitedTeachersLoading } =
    useQuery({
      queryKey: ["invitedTeachers"],
      queryFn: () => teacherService.getInvitedTeachers(),
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
          mb-4 animate-menu-appear-top shadow-md relative"
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
          <form onSubmit={handleSendInvitation} className="flex flex-col w-3/4">
            <label htmlFor="newTeacherInput" className="my-0.5">
              Kutsu uusi opettaja
            </label>
            <div className="flex">
              <input
                className="flex-grow text-textPrimary bg-bgGray p-1 
                border border-borderPrimary rounded-l-md
                focus-visible:outline-none"
                type="text"
                placeholder="Opettajan sähköpostiosoite"
                value={newTeacherEmail}
                onChange={(e) => setNewTeacherEmail(e.target.value)}
                id="newTeacherInput"
              />

              <button className="rounded-r w-max px-4 py-2 text-white bg-primaryColor border border-primaryColor whitespace-nowrap align-bottom">
                Lähetä
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex-col w-full">
        {invitedTeachersLoading ? (
          <div>{LoadingScreen()}</div>
        ) : (
          invitedTeachers.length > 0 && (
            <>
              <h2 className="text-xl m-2">Kutsutut opettajat</h2>
              <div className="flex flex-col gap-4">
                {invitedTeachers.map((teacher) => (
                  <CreateInvitedTeacherCard
                    teacher={teacher}
                    handleRevoke={handleRevoke}
                    key={teacher.id}
                  />
                ))}
              </div>
            </>
          )
        )}
      </div>

      <div className="flex-col w-full ">
        <h2 className="text-xl m-2">Opettajat</h2>
        <div className="flex flex-col gap-4">
          {teachersLoading ? (
            <div>{LoadingScreen()}</div>
          ) : (
            teachers.map((teacher) => (
              <CreateTeacherCard
                teacher={teacher}
                handleDelete={handleDelete}
                key={teacher.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CreateTeacherCard = ({ teacher, handleDelete }) => {
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

  const created_at = formatDate(new Date(teacher.created_at), "d.m.Y");
  const last_login_at = teacher.last_login_at
    ? calcTimeFromLogin(teacher.last_login_at)
    : null;

  return (
    <div className="flex w-full border border-borderPrimary rounded-md p-2">
      <div className="flex flex-col gap-2 p-2  w-full">
        {/* name and email row */}
        <div className="flex flex-wrap gap-4 items-end">
          <span className="text-lg">
            {teacher.first_name} {teacher.last_name}
          </span>
          <span className="text-textSecondary">{teacher.email}</span>
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
          onClick={() => {
            handleDelete(teacher);
          }}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const CreateInvitedTeacherCard = ({ teacher, handleRevoke }) => {
  const created_at = formatDate(new Date(teacher.created_at), "d.m.Y");
  const expires_at = formatDate(new Date(teacher.expires_at), "d.m.Y");

  return (
    <div className="flex w-full border border-borderPrimary rounded-md p-2">
      <div className="flex flex-col gap-2 p-2  w-full">
        {/* name and email row */}
        <div className="flex flex-wrap gap-4 items-end">
          <span className="text-textSecondary">{teacher.email}</span>
        </div>

        {/* additional info row */}
        <div className="flex gap-4 flex-wrap">
          <span className="text-textSecondary">
            Lähetetty: {created_at || "Ei rekisteröitynyt"}
          </span>
          <span className="text-textSecondary">
            Vanhenee: {expires_at || "Ei kirjautunut"}
          </span>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <button
          className="IconButton text-iconRed"
          onClick={() => {
            handleRevoke(teacher);
          }}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default TeachersPage;
