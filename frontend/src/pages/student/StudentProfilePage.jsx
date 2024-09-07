import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { format, set } from "date-fns";
import cc from "../../utils/cc";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useToast } from "../../hooks/toast-messages/useToast";

function StudentProfilePage() {
  const { logout, logoutAll } = useAuth();
  const { addToast } = useToast();

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

  const passwordUpdate = useMutation({
    mutationFn: () => userService.changePassword(currentPassword, newPassword),
    onError: (error) => {
      console.error("Error updating password:", error);
      addToast("Virhe päivitettäessä salasanaa", { style: "error" });
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
    if (userData) {
      countTrainedTime(userData.total_minutes);
    }
  }, [userData]);
  
  const validateNewPasswords = () => {
    let passwordError = "";
    let newPasswordError = "";
  
    console.log("Starting validation");
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
  
    // Regular expressions for validation
    const lengthCheck = /.{8,}/; // At least 8 characters
    const capitalLetterCheck = /[A-Z]/; // At least one uppercase letter
    const numberCheck = /[0-9]/; // At least one number
  
    // Check if current password is empty
    if (currentPassword.length === 0) {
      passwordError = "Nykyinen salasana ei voi olla tyhjä";
      console.log("Password Error:", passwordError);
    } else {
      setPasswordError("");
    }
  
    // Check if new passwords are empty
    if (newPassword.length === 0 || confirmPassword.length === 0) {
      newPasswordError = "Salasanat eivät voi olla tyhjiä"; 
      console.log("New Password Error:", newPasswordError);
    } else if (newPassword !== confirmPassword) {
      // Check if new passwords match
      newPasswordError = "Salasanat eivät täsmää"; 
      console.log("New Password Error:", newPasswordError);
    } else if (
      !lengthCheck.test(newPassword) ||
      !capitalLetterCheck.test(newPassword) ||
      !numberCheck.test(newPassword)
    ) {
      // Check if the new password meets the criteria
      newPasswordError =
        "Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää vähintään yhden ison kirjaimen sekä numeron";
      console.log("New Password Error:", newPasswordError);
    }
  
    // If there are any errors, set them and return false
    if (passwordError.length > 0 || newPasswordError.length > 0) {
      setPasswordError(passwordError);
      setNewPasswordError(newPasswordError);
      console.log("Validation failed with errors:");
      console.log("Password Error:", passwordError);
      console.log("New Password Error:", newPasswordError);
      return false;
    }
  
    console.log("Validation passed");
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
      text: `Haluatko varmasti poistaa käyttäjän ${userData.first_name} ${userData.last_name}? Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`,
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
              <label className="text-textPrimary" htmlFor="name">
                Nimi
              </label>
              <input
                type="text"
                name="name"
                disabled
                value={userData.first_name + " " + userData.last_name}
                className={cc(inputClass, "disabled:text-opacity-60")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textPrimary" htmlFor="email">
                Sähköposti
              </label>
              <input
                value={userData.email}
                disabled
                className={cc(inputClass, "disabled:text-opacity-60")}
              />
            </div>
            <div className="flex flex-col max-w-xl">
              <label className="text-textPrimary" htmlFor="sport">
                Toimipaikka
              </label>
              <input
                value={userData.campus_name}
                disabled
                className={cc(inputClass, "disabled:text-opacity-60")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textPrimary" htmlFor="sport">
                Ryhmä
              </label>
              <input
                value={userData.group_name}
                disabled
                className={cc(inputClass, "disabled:text-opacity-60")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textPrimary" htmlFor="sport">
                Laji
              </label>
              <input
                value={userData.sport_name}
                disabled
                className={cc(inputClass, "disabled:text-opacity-60")}
              />
            </div>

            <div className="flex flex-col max-w-xl">
              <label className="text-textPrimary" htmlFor="sport">
                Käyttäjä luotu
              </label>
              <input
                value={format(new Date(userData.created_at), "dd.MM.yyyy")}
                disabled
                className={cc(inputClass, "disabled:text-opacity-60")}
              />
            </div>
          </div>

          {/* Päivitä salasana container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Päivitä salasana</h1>
              <small className="text-textSecondary">
                Muista käyttää pitkää ja turvallista salasanaa. Salasanan vaihto
                kirjaa sinut ulos kaikilta laitteiltasi.
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
                className="p-2 text-white w-fit Button hover:bg-hoverPrimary "
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
                className="p-2 text-white w-fit Button hover:bg-hoverPrimary "
                onClick={() => {
                  logout();
                }}
              >
                Kirjaudu ulos
              </button>

              <button
                className="p-2 text-white w-fit Button hover:bg-hoverPrimary "
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
              {" "}
              <h1 className="text-xl ">Poista käyttäjä</h1>
              <small className="text-textSecondary">
                Tämä poistaa kaikki käyttäjän tiedot. Toiminto on peruuttamaton.
              </small>
            </div>
            <button
              className="p-2 text-white Button w-fit hover:bg-red-800 bg-iconRed "
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
