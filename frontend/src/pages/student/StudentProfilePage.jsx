import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmModal from "../../components/confirm-modal/confirmModal";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import cc from "../../utils/cc";
import { useConfirmModal } from "../../hooks/useConfirmModal";

function StudentProfilePage() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openConfirmModal } = useConfirmModal();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["studentData"],
    queryFn: () => userService.getStudentData(),
    staleTime: 15 * 60 * 1000,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getStudentData();
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

  useEffect(() => {
    if (userData) {
      countTrainedTime(userData.total_minutes);
    }
  }, [userData]);
  const validateNewPasswords = () => {
    let passwordError = "";
    let newPasswordError = "";
    if (currentPassword.length === 0) {
      passwordError = "Nykyinen salasana ei voi olla tyhjä";
    } else {
      setPasswordError("");
    }
    if (newPassword !== confirmPassword) {
      newPasswordError = "Salasanat eivät täsmää";
    } else {
      setNewPasswordError("");
    }
    if (newPassword.length === 0 || confirmPassword.length === 0) {
      newPasswordError = "Salasanat eivät voi olla tyhjiä";
    }

    if (newPassword.length < 8 || confirmPassword.length < 8) {
      newPasswordError = "Salasanan pituuden oltava vähintään 8 merkkiä";
    }

    if (passwordError.length > 0 || newPasswordError.length > 0) {
      setPasswordError(passwordError);
      setNewPasswordError(newPasswordError);
      return false;
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      // TODO: LISÄÄ TÄNNE SALASANAN VAIHTO KÄSITTELY

      addToast("Salasana päivitetty", { style: "success" });
    } catch (error) {
      addToast("Virhe päivitettäessä salasanaa", { style: "error" });
    }
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
  }

  const [trainedHours, setTrainedHours] = useState(0);
  const [trainedMinutes, setTrainedMinutes] = useState(0);
  const countTrainedTime = (totalMinutes) => {
    setTrainedHours(Math.floor(totalMinutes / 60));
    setTrainedMinutes(totalMinutes % 60);
    return;
  };

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary disabled:text-opacity-70 border rounded-md p-1 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  if (userDataLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen />
      </div>
    );
  } else
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col w-full gap-8 p-4 divide-y rounded-md md:max-w-4xl">
          {/* Merkinnät container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-primaryColor">
            <div>
              <h1 className="text-xl">Merkinnät</h1>
              <small className="text-textSecondary">
                Näe tilastoja tehdyistä merkinnöistä
              </small>
            </div>
            <div className="flex flex-col gap-4">
              <div className="">
                <p>Merkintöjen määrä:</p>
                <p className={inputClass}>
                  {userData.total_entries_count} <small>kpl</small>
                </p>
              </div>
              <div className="">
                <p>Aktiivisten päivien määrä:</p>
                <p className={inputClass}>
                  {userData.unique_days_count} <small>kpl</small>
                </p>
              </div>
              <div className="">
                <p>Harjoitusten määrä:</p>
                <p className={inputClass}>
                  {userData.entry_type_1_count} <small>kpl</small>
                </p>
              </div>
              <div>
                <p>Treenattu aika:</p>
                <p className={inputClass}>
                  {trainedHours}
                  <small>h</small> {trainedMinutes}
                  <small>min</small>
                </p>
              </div>
            </div>
          </div>
          {/* Profiilin tiedot container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Käyttäjä</h1>
              <small className="text-textSecondary">
                Tarkistele tai päivitä käyttäjäsi tietoja
              </small>
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="name">
                Nimi
              </label>
              <input
                type="text"
                name="name"
                disabled
                value={userData.first_name + " " + userData.last_name}
                className={cc(inputClass, "disabled:text-opacity-70")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="email">
                Sähköposti
              </label>
              <input
                value={userData.email}
                disabled
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
            </div>
            <div className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="sport">
                Toimipaikka
              </label>
              <input
                value={userData.campus_name}
                disabled
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="sport">
                Ryhmä
              </label>
              <input
                value={userData.name}
                disabled
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="sport">
                Laji
              </label>
              <input
                value={userData.sport_name}
                disabled
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="sport">
                Käyttäjä luotu
              </label>
              <input
                value={format(new Date(userData.created_at), "dd.MM.yyyy")}
                disabled
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
            </div>
          </div>

          {/* Päivitä salasana container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Päivitä salasana</h1>
              <small className="text-textSecondary">
                Muista käyttää pitkää ja turvallista salasanaa
              </small>
            </div>

            <form action="#" className="flex flex-col gap-4">
              <div className="flex flex-col max-w-xl">
                {" "}
                <label className="text-textSecondary" htmlFor="currentPassword">
                  Nykyinen salasana
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={cc(inputClass)}
                />
                <small className="text-red-500">{passwordError}</small>
              </div>

              <div className="flex flex-col max-w-xl">
                {" "}
                <label className="text-textSecondary" htmlFor="newPassword">
                  Uusi salasana
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cc(inputClass)}
                />
                <small className="text-red-500">{newPasswordError}</small>
              </div>

              <div className="flex flex-col max-w-xl">
                {" "}
                <label className="text-textSecondary" htmlFor="confirmPassword">
                  Vahvista salasana
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  name="newPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cc(inputClass)}
                />
                <small className="text-red-500">{newPasswordError}</small>
              </div>
              <button
                className="p-2 text-white w-fit Button"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateNewPasswords()) {
                    setPasswordError("");
                    handlePasswordUpdate();
                  }
                }}
              >
                Tallenna
              </button>
            </form>
          </div>

          {/* Käyttäjän postamisen container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div className="flex flex-col max-w-xl">
              {" "}
              <h1 className="text-xl ">Poista käyttäjä</h1>
              <small className="text-textSecondary">
                Kun käyttäjä on poistettu, kaikki käyttäjän tiedot poistetaan
                pysyvästi. Tämä toiminto on peruuttamaton
              </small>
            </div>
            <button
              className="w-32 text-white Button bg-iconRed"
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
