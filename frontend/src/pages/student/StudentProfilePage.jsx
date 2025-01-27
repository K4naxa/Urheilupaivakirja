import { useEffect, useState } from "react";
import userService from "../../services/userService";
import studentService from "../../services/studentService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import cc from "../../utils/cc";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useToast } from "../../hooks/toast-messages/useToast";
import { useOutletContext } from "react-router-dom";


function StudentProfilePage() {
  const { studentData, studentDataLoading, studentDataError } =
    useOutletContext();

  const { logout, logoutAll } = useAuth();
  const { addToast } = useToast();

  const { openConfirmModal } = useConfirmModal();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const passwordUpdate = useMutation({
    mutationFn: () => userService.changePassword(currentPassword, newPassword),
    onError: (error) => {
      console.error("Error updating password:", error);

      let errorMessage = "Virhe päivitettäessä salasanaa.";

      if (error.response) {
        // the code looks weird but it matches the backend..
        switch (error.response.status) {
          case 400:
            if (
              error.response.data.message ===
              "New password cannot be the same as the old password"
            ) {
              errorMessage = "Uusi salasana ei voi olla sama kuin vanha.";
            } else if (error.response.data.errors) {
              errorMessage =
                "Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää vähintään yhden ison kirjaimen sekä numeron";
            } else {
              errorMessage = "Virheellinen pyyntö. Tarkista syötetyt tiedot.";
            }
            break;
          case 401:
            errorMessage = "Vanha salasana on virheellinen.";
            break;
          case 404:
            errorMessage = "Käyttäjää ei löytynyt.";
            break;
          case 500:
            errorMessage =
              "Palvelinvirhe. Yritä myöhemmin uudelleen. Ongelman jatkuessa ota yhteyttä ylläpitäjään.";
            break;
          default:
            errorMessage = "Tuntematon virhe tapahtui. Yritä uudelleen.";
        }
      }
      addToast(errorMessage, { style: "error" });
      setNewPasswordError(errorMessage);
    },
    onSuccess: () => {
      addToast("Salasana päivitetty", { style: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setNewPasswordError("");
    },
  });

  const getAccountAge = (date) => {
    const today = new Date();
    const created = new Date(date);
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (studentData) {
      countTrainedTime(studentData.total_minutes);
    }
  }, [studentData]);

  const validateNewPasswords = () => {
    let passwordError = "";
    let newPasswordError = "";

    // Regular expressions for validation
    const lengthCheck = /.{8,}/; // At least 8 characters
    const capitalLetterCheck = /[A-Z]/; // At least one uppercase letter
    const numberCheck = /[0-9]/; // At least one number

    // Check if current password is empty
    if (currentPassword.length === 0) {
      passwordError = "Nykyinen salasana ei voi olla tyhjä";
    } else {
      setPasswordError("");
    }

    // Check if new passwords are empty
    if (newPassword.length === 0 || confirmPassword.length === 0) {
      newPasswordError = "Salasanat eivät voi olla tyhjiä";
    } else if (newPassword !== confirmPassword) {
      // Check if new passwords match
      newPasswordError = "Salasanat eivät täsmää";
    } else if (
      !lengthCheck.test(newPassword) ||
      !capitalLetterCheck.test(newPassword) ||
      !numberCheck.test(newPassword)
    ) {
      // Check if the new password meets the criteria
      newPasswordError =
        "Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää vähintään yhden ison kirjaimen sekä numeron";
    }

    // If there are any errors, set them and return false
    if (passwordError.length > 0 || newPasswordError.length > 0) {
      setPasswordError(passwordError);
      setNewPasswordError(newPasswordError);
      return false;
    }
    return true;
  };

  const handlePasswordUpdate = async () => {
    try {
      passwordUpdate.mutate(currentPassword, newPassword);
    } catch (error) {
      addToast("Virhe päivitettäessä salasanaa", { style: "error" });
    }
  };

  const handleAccountDelete = () => {
    const handleLogout = () => {
      logout();
    };
    openConfirmModal({
      handleLogout: handleLogout,
      text: `Haluatko varmasti poistaa käyttäjän ${studentData.first_name} ${studentData.last_name}? Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`,
      type: "accountDelete",
      inputPlaceholder: "Syötä salasanasi varmistaaksesi poiston",
      inputType: "password",
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
    });
  };

  const [trainedHours, setTrainedHours] = useState(0);
  const [trainedMinutes, setTrainedMinutes] = useState(0);
  const countTrainedTime = (totalMinutes) => {
    setTrainedHours(Math.floor(totalMinutes / 60));
    setTrainedMinutes(totalMinutes % 60);
    return;
  };

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary disabled:text-opacity-70 border rounded-md p-1 bg-bgGray focus-visible:outline-none focus-visible:border-primaryColor";
  const disabledInputClass =
    "text-lg text-textPrimary border-borderPrimary border rounded-md p-1 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  if (studentDataLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen />
      </div>
    );
  }

  if (studentDataError) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>Data not available.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col w-full gap-8 p-4 divide-y rounded-md md:max-w-4xl">
        {/* Merkinnät container */}
        <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-primaryColor">
          <div>
            <h1 className="text-xl">Merkinnät</h1>
            <small className="text-textSecondary">
              Yhteenveto tehdyistä merkinnöistä
            </small>
          </div>
          <div className="flex flex-col gap-4">
            <div className="">
              <p>Merkintöjen määrä:</p>
              <p className={disabledInputClass}>
                {studentData.total_entries_count} <small>kpl</small>
              </p>
            </div>
            <div className="">
              <p>Aktiivisten päivien määrä:</p>
              <p className={disabledInputClass}>
                {studentData.unique_days_count} <small>kpl</small>
              </p>
            </div>
            <div className="">
              <p>Harjoitusten määrä:</p>
              <p className={disabledInputClass}>
                {studentData.entry_type_1_count} <small>kpl</small>
              </p>
            </div>
            <div>
              <p>Treenattu aika:</p>
              <p className={disabledInputClass}>
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
            <label className="text-textPrimary" htmlFor="name">
              Nimi
            </label>
            <input
              type="text"
              name="name"
              disabled
              value={studentData.first_name + " " + studentData.last_name}
              className={cc(disabledInputClass, "disabled:text-opacity-60")}
            />
          </div>

          <div className="flex flex-col max-w-xl">
            <label className="text-textPrimary" htmlFor="email">
              Sähköposti
            </label>
            <input
              value={studentData.email}
              disabled
              className={cc(disabledInputClass, "disabled:text-opacity-60")}
            />
          </div>
          <div className="flex flex-col max-w-xl">
            <label className="text-textPrimary" htmlFor="sport">
              Toimipaikka
            </label>
            <input
              value={studentData.campus_name}
              disabled
              className={cc(disabledInputClass, "disabled:text-opacity-60")}
            />
          </div>

          <div className="flex flex-col max-w-xl">
            <label className="text-textPrimary" htmlFor="sport">
              Ryhmä
            </label>
            <input
              value={studentData.group_name}
              disabled
              className={cc(disabledInputClass, "disabled:text-opacity-60")}
            />
          </div>

          <div className="flex flex-col max-w-xl">
            <label className="text-textPrimary" htmlFor="sport">
              Laji
            </label>
            <input
              value={studentData.sport_name}
              disabled
              className={cc(disabledInputClass, "disabled:text-opacity-60")}
            />
          </div>

          <div className="flex flex-col max-w-xl">
            <label className="text-textPrimary" htmlFor="sport">
              Käyttäjä luotu
            </label>
            <input
              value={format(new Date(studentData.created_at), "dd.MM.yyyy")}
              disabled
              className={cc(disabledInputClass, "disabled:text-opacity-60")}
            />
          </div>
        </div>

        {/* Päivitä salasana container */}
        <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
          <div>
            <h1 className="text-xl">Päivitä salasana</h1>
            <small className="text-textSecondary">
              Muista käyttää pitkää ja turvallista salasanaa. Salasanan vaihto
              kirjaa sinut ulos kaikilta muilta laitteiltasi.
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
              className="p-2 text-white w-fit Button border-2 hover:bg-hoverPrimary "
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

        <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
          <div className="flex flex-col max-w-xl">
            <h1 className="text-xl ">Kirjaudu ulos</h1>
            <small className="text-textSecondary">
              Voit myös kirjautua ulos kaikilla laitteilla. Toiminnossa on
              muutaman minuutin viive.
            </small>
          </div>
          <div className="flex max-w-[400px] justify-between flex-wrap">
            <button
              className="p-2 text-white w-fit Button border-2 hover:bg-hoverPrimary "
              onClick={() => {
                logout();
              }}
            >
              Kirjaudu ulos
            </button>

            <button
              className="p-2 text-white w-fit Button border-2 hover:bg-hoverPrimary "
              onClick={() => {
                logoutAll();
              }}
            >
              Kirjaudu ulos kaikilla laitteilla
            </button>
          </div>
        </div>

        {/* Käyttäjän postamisen container */}
        <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
          <div className="flex flex-col max-w-xl">
            <h1 className="text-xl">Poista käyttäjä</h1>
            <small className="text-textSecondary">
              Kun käyttäjä on poistettu, kaikki käyttäjän tiedot poistetaan
              pysyvästi. Tämä toiminto on peruuttamaton.
            </small>
          </div>
          <button
            className="w-32 text-white Button border-2 p-2 hover:bg-red-800 bg-iconRed"
            onClick={() => {
              handleAccountDelete();
            }}
          >
            Poista käyttäjä
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfilePage;
