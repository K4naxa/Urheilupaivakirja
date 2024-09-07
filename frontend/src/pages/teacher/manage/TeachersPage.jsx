import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import teacherService from "../../../services/teacherService";
import LoadingScreen from "../../../components/LoadingScreen";
import { FiTrash2 } from "react-icons/fi";
import formatDate from "../../../utils/formatDate";
import { useConfirmModal } from "../../../hooks/useConfirmModal";

const TeachersPage = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();

  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = (teacher) => {
    const handleUserConfirmation = async () => {
      await teacherService.deleteUser(teacher.user_id).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["StudentsList"],
        });
      });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    };

    const modalText = (
      <span>
        Haluatko varmasti poistaa opettajan
        <br />
        <strong>
          {teacher.first_name} {teacher.last_name}?
        </strong>
        <br />
        Tämä poistaa kaikki opettajan tiedot pysyvästi.`
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

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teacherService.getTeachers(),
    config: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!teachersLoading) console.log(teachers);
  }, [teachers, teachersLoading]);

  return (
    <div className="w-full items-center bg-bgSecondary rounded-md">
      {/* Mobile header / error Message */}
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
      <div className="flex flex-col w-full gap-8 border border-borderPrimary p-4 rounded-md">
        <div className="flex flex-col w-full p-4 ">
          <div className="flex gap-4 justify-center w-full items-end">
            <div className="flex flex-col w-3/4">
              <label htmlFor="newTeacherInput">Kutsu uusi vierailija</label>
              <input
                type="text"
                name="newTeacherInput"
                id="newTeacherInput"
                placeholder="Vierailijan sähköposti"
                className="text-textPrimary bg-bgGray p-1 
                  border border-borderPrimary rounded-md
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor mt-1"
              />
            </div>
            <button className="Button bg-bgGray border border-primaryColor h-10 align-bottom">
              Lähetä kutsu
            </button>
          </div>
        </div>
        <div className="flex-col w-full ">
          <h2 className="text-xl">Henkilökunta</h2>
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
    <div className="flex w-full border border-borderPrimary rounded-md">
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
          onClick={() => handleDelete(teacher)}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default TeachersPage;
