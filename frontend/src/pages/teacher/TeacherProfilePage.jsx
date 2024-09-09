import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/toast-messages/useToast";

import { FiCheck, FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import cc from "../../utils/cc";
import courseService from "../../services/courseService";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirmModal } from "../../hooks/useConfirmModal";

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function TeacherProfilePage() {
  const { logout, logoutAll } = useAuth();
  const { addToast } = useToast();

  const { openConfirmModal } = useConfirmModal();

  const [updatedCourseSegments, setUpdatedCourseSegments] = useState([]);

  const [updatedEmail, setUpdatedEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [courseSegmentsError, setCourseSegmentsError] = useState("");

  const [creatingSegment, setCreatingSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentValue, setNewSegmentValue] = useState("");
  const [newSegmentErrorMessage, setNewSegmentErrorMessage] = useState("");

  const queryclient = useQueryClient();

  const { data: profileData, isLoading: profileDataLoading } = useQuery({
    queryKey: ["profileData"],
    queryFn: () => userService.getProfileData(),
    staleTime: 15 * 60 * 1000,
  });

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

  const { data: courseSegments } = useQuery({
    queryKey: ["courseSegments"],
    queryFn: () => courseService.getCourseSegments(),
    staleTime: 15 * 60 * 1000,
  });

  const validateEmail = (email) => {
    const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (email.length === 0) {
      setEmailError("Sähköpostiosoite ei voi olla tyhjä");
      return false;
    }
    if (email === profileData.email) {
      setEmailError("Sähköpostiosoite on jo käytössä");
      return false;
    }

    if (!email.match(emailRegEx)) {
      setEmailError("Sähköpostiosoite ei ole kelvollinen");
      return false;
    }
    return true;
  };
  const handleEmailUpdate = async () => {
    try {
      //  TODO: LISÄÄ TÄNNE EMAIL MUUTOSEN KÄSITTELY

      addToast("Sähköposti päivitetty", { style: "success" });
    } catch (error) {
      addToast("Virhe päivitettäessä sähköpostia", { style: "error" });
    }
  };

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

  const handleCourseSegmentsUpdate = async () => {
    setShowConfirmModal(true);
    setAgreeStyle("");
    setModalMessage(
      `Haluatko varmasti tallentaa kurssin muutokset: ${updatedCourseSegments.map((segment) => " " + segment.name + " = " + segment.value)}?`
    );
    setContinueButton("Päivitä");
    const handleUpdate = async () => {
      try {
        let updatedPositions = updatedCourseSegments.map((segment, index) => {
          return { ...segment, order_number: index + 1 };
        });
        courseService.updateCourseSegments(updatedPositions);
      } catch (error) {
        addToast("Virhe päivitettäessä merkintöjen määrä vaatimusta", {
          style: "error",
        });
      }
      addToast("Merkintöjen määrä vaatimus päivitetty", { style: "success" });
      queryclient.invalidateQueries({ queryKey: ["courseSegments"] });
      setShowConfirmModal(false);
    };
    setHandleUserConfirmation(() => handleUpdate);
  };

  const handleAccountDelete = () => {
    const handleLogout = () => {
      logout();
    };
    openConfirmModal({
      handleLogout: handleLogout,
      text: `Haluatko varmasti poistaa käyttäjän ${profileData.first_name} ${profileData.last_name}? Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`,
      type: "adminAccountDelete",
      inputPlaceholder: "Syötä salasanasi varmistaaksesi poiston",
      inputType: "password",
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
    });
  };

  useEffect(() => {
    if (profileData) {
      setUpdatedEmail(profileData.email);
    }
  }, [profileData]);
  useEffect(() => {
    if (courseSegments) {
      setUpdatedCourseSegments([...courseSegments]);
    }
  }, [courseSegments]);

  const handleSegmentCreation = async () => {
    try {
      await courseService.createCourseSegment({
        name: newSegmentName,
        value: newSegmentValue,
      });
      addToast("Segmentti luotu", { style: "success" });
      setNewSegmentName("");
      setNewSegmentValue("");
      queryclient.invalidateQueries({ queryKey: ["courseSegments"] });
    } catch (error) {
      addToast("Virhe luotaessa segmenttiä", { style: "error" });
    }
  };

  const handleSegmentDelete = async (segment) => {
    setShowConfirmModal(true);
    setAgreeStyle("red");
    setModalMessage(
      `Haluatko varmasti poistaa segmentin <br>
      nimi: ${segment.name} Vaaditut merkinnät: ${segment.value}? 
`
    );
    setContinueButton("Poista");

    const handleUserConfirmation = async () => {
      try {
        await courseService.deleteCourseSegment(segment.id);
        addToast("Segmentti poistettu", { style: "success" });
        queryclient.invalidateQueries({ queryKey: ["courseSegments"] });
      } catch (error) {
        addToast("Virhe poistettaessa segmenttiä", { style: "error" });
      }
      setShowConfirmModal(false);
    };
    setHandleUserConfirmation(() => handleUserConfirmation);
  };
  // Drag and drop segment sorting functions

  class MyPointerSensor extends PointerSensor {
    static activators = [
      {
        eventName: "onPointerDown",
        handler: ({ nativeEvent: event }) => {
          console.log(event.target);
          if (
            !event.isPrimary ||
            event.button !== 0 ||
            isInteractiveElement(event.target)
          ) {
            return false;
          }

          return true;
        },
      },
    ];
  }
  function isInteractiveElement(element) {
    const interactiveElements = [
      "button",
      "input",
      "textarea",
      "select",
      "option",
      "svg",
      "polyline",
      "path",
    ];

    if (interactiveElements.includes(element.tagName.toLowerCase())) {
      return true;
    }

    return false;
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setUpdatedCourseSegments((segments) => {
        const oldIndex = segments.findIndex(
          (segment) => segment.id === active.id
        );
        const newIndex = segments.findIndex(
          (segment) => segment.id === over.id
        );
        return arrayMove(segments, oldIndex, newIndex);
      });
    }
  };

  function SortableItem({ segment, inputClass }) {
    const [isEditing, setIsEditing] = useState(false);
    const [segmentID, setSegmentID] = useState(segment.id);
    const [segmentName, setSegmentName] = useState(segment.name);
    const [segmentValue, setSegmentValue] = useState(segment.value);

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: segment.id, disabled: isEditing });

    const handleSegmentChanges = () => {
      setUpdatedCourseSegments((segments) =>
        segments.map((segment) =>
          segment.id === segmentID
            ? { ...segment, name: segmentName, value: segmentValue }
            : segment
        )
      );
    };

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-2 border rounded-md shadow-sm border-borderPrimary touch-none hover:shadow-md"
      >
        <div className="flex items-center gap-2">
          {" "}
          <small className="text-textSecondary">Nimi: </small>
          {isEditing ? (
            <input
              type="text"
              value={segmentName}
              disabled={!isEditing}
              onChange={(e) => setSegmentName(e.target.value)}
              className={cc(inputClass, "disabled:border-bgSecondary")}
            />
          ) : (
            <div className={cc(inputClass, "w-full border-bgSecondary")}>
              {segmentName}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {" "}
          <small className="text-textSecondary">Vaaditut merkinnät: </small>
          {isEditing ? (
            <input
              type="number"
              value={segmentValue}
              disabled={!isEditing}
              onChange={(e) => setSegmentValue(e.target.value)}
              className={cc(inputClass, "max-w-20 disabled:border-bgSecondary")}
            />
          ) : (
            <div className={cc(inputClass, "border-bgSecondary")}>
              {segmentValue}
            </div>
          )}
        </div>

        <div>
          {" "}
          {isEditing ? (
            <button
              className="border rounded-md IconBox bg-bgSecondary text-btnGreen border-bgSecondary hover:border-borderPrimary"
              onClick={() => {
                setIsEditing(false);
                handleSegmentChanges();
              }}
            >
              <FiCheck />
            </button>
          ) : (
            <button
              className="border text-iconGray rounded-md IconBox bg-bgSecondary border-bgSecondary hover:border-borderPrimary"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit3 />
            </button>
          )}
          <button
            className="border rounded-md IconBox bg-bgSecondary text-btnRed border-bgSecondary hover:border-borderPrimary"
            onClick={() => handleSegmentDelete(segment)}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    );
  }

  const sensors = useSensors(
    useSensor(MyPointerSensor),
    useSensor(TouchSensor)
  );

  const inputClass =
    "text-lg text-textPrimary border-borderPrimary border rounded-md p-1 bg-bgGray focus-visible:outline-none focus-visible:border-primaryColor";
  const disabledInputClass =
    "text-lg text-textPrimary border-borderPrimary border rounded-md p-1 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  if (profileDataLoading || !courseSegments) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingScreen />
      </div>
    );
  } else
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col w-full gap-8 p-4 divide-y rounded-md md:max-w-4xl">
          {/* Kurssin tiedot container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-primaryColor">
            <div>
              <h1 className="text-xl">Kurssin tiedot</h1>
              <small className="text-textSecondary">
                Voit luoda uuden segmentin, muokata olemassa olevia segmenttejä
                tai muuttaa näiden järjestystä vetämällä ja pudottamalla niitä
              </small>
            </div>

            <div className="flex flex-col">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
              >
                {" "}
                {/* segment edition container */}
                <div className="flex flex-col w-full gap-4">
                  <SortableContext
                    items={updatedCourseSegments.map((segment) => segment.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {updatedCourseSegments?.map((segment, index) => (
                      <SortableItem
                        key={segment.id}
                        segment={segment}
                        inputClass={inputClass}
                      />
                    ))}
                  </SortableContext>

                  {creatingSegment ? (
                    <div className="flex items-center gap-4 p-2 border rounded-md shadow-sm border-borderPrimary touch-none">
                      <div>
                        {" "}
                        <small className="text-textSecondary">Nimi: </small>
                        <input
                          type="text"
                          value={newSegmentName}
                          onChange={(e) => setNewSegmentName(e.target.value)}
                          className={cc(inputClass)}
                        />
                      </div>
                      <div>
                        <small className="text-textSecondary">
                          Vaaditut merkinnät:{" "}
                        </small>
                        <input
                          type="number"
                          value={newSegmentValue}
                          onChange={(e) => setNewSegmentValue(e.target.value)}
                          className={cc(inputClass, "max-w-20")}
                        />
                      </div>
                      <div className="flex self-end gap-4 justify-self-end">
                        <button
                          onClick={() => {
                            setCreatingSegment(false);
                            setNewSegmentErrorMessage("");
                            setNewSegmentName("");
                            setNewSegmentValue("");
                          }}
                        >
                          Peruuta
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (newSegmentName && newSegmentValue) {
                              handleSegmentCreation();
                              setCreatingSegment(false);
                              setNewSegmentErrorMessage("");
                            } else {
                              setNewSegmentErrorMessage(
                                "Nimi ja vaaditut merkinnät ovat pakollisia"
                              );
                            }
                          }}
                        >
                          Luo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={cc(
                        "border rounded-md  border-borderPrimary  hover:bg-hoverDefault hover:text-primaryColor p-1  text-lg"
                      )}
                      onClick={() => setCreatingSegment(true)}
                    >
                      +
                    </button>
                  )}
                  <small className="mt-0 text-red-500">
                    {newSegmentErrorMessage}
                  </small>
                </div>
              </DndContext>

              <button
                className="p-2 mt-4 text-white w-fit Button hover:bg-hoverPrimary"
                onClick={(e) => {
                  e.preventDefault();
                  if (courseSegments) {
                    setCourseSegmentsError("");
                    handleCourseSegmentsUpdate();
                  }
                }}
              >
                Tallenna
              </button>
            </div>
          </div>

          {/* Profiilin tiedot container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Profiilin tiedot</h1>
              <small className="text-textSecondary">
                Tarkistele tai päivitä käyttäjäsi tietoja
              </small>
            </div>

            <form className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="name">
                Nimi
              </label>
              <input
                type="text"
                name="name"
                disabled
                value={profileData.first_name + " " + profileData.last_name}
                className={cc(
                  inputClass,
                  "cursor-not-allowed",
                  "disabled:text-opacity-70"
                )}
              />
            </form>

            <form className="flex flex-col max-w-xl">
              <label className="text-textSecondary" htmlFor="email">
                Sähköposti
              </label>
              <input
                type="email"
                name="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className={cc(inputClass, "disabled:text-opacity-80")}
              />
              <small className="text-red-500">{emailError}</small>
              <button
                className="p-2 mt-4 text-white w-fit Button hover:bg-hoverPrimary"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateEmail(updatedEmail)) {
                    setEmailError("");
                    handleEmailUpdate();
                  }
                }}
              >
                Tallenna
              </button>
            </form>
          </div>

          {/* Päivitä salasana container */}
          <div className="flex flex-col gap-4 p-6 border rounded-md shadow-sm bg-bgSecondary border-borderPrimary">
            <div>
              <h1 className="text-xl">Päivitä salasana</h1>
              <small className="text-textSecondary">
                Muista käyttää pitkää ja turvallista salasanaa. Salasanan vaihto
                kirjaa sinut ulos kaikilta muilta laitteiltasi.{" "}
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
                  className={cc(inputClass, "px-2 bg-bgGray")}
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
                  className={cc(inputClass, "disabled:text-opacity-80")}
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
                  className={cc(inputClass, "disabled:text-opacity-80")}
                />
                <small className="text-red-500">{newPasswordError}</small>
              </div>
              <button
                className="p-2 text-white w-fit Button hover:bg-hoverPrimary"
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
              <h1 className="text-xl">Poista käyttäjä</h1>
              <small className="text-textSecondary">
                Kun käyttäjä on poistettu, kaikki käyttäjän tiedot poistetaan
                pysyvästi. Tämä toiminto on peruuttamaton.
              </small>
            </div>
            <button
              className="w-32 text-white Button p-2 hover:bg-red-800 bg-iconRed"
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

export default TeacherProfilePage;
