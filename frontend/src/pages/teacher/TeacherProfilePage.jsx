import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../hooks/toast-messages/useToast";

import { FiCheck, FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import cc from "../../utils/cc";
import courseService from "../../services/courseService";
import { useQueryClient } from "@tanstack/react-query";

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
  const { logout } = useAuth();
  const { addToast } = useToast();

  // statet Modalia varten
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [continueButton, setContinueButton] = useState("");
  const [agreeStyle, setAgreeStyle] = useState("");
  const [handleUserConfirmation, setHandleUserConfirmation] = useState(
    () => {}
  );

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

  const { data: spectatorData, isLoading: spectatorDataLoading } = useQuery({
    queryKey: ["spectatorData"],
    queryFn: () => userService.getProfileData(),
    staleTime: 15 * 60 * 1000,
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
    if (email === spectatorData.email) {
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
      queryclient.invalidateQueries({queryKey: ["courseSegments"]});
      setShowConfirmModal(false);
    };
    setHandleUserConfirmation(() => handleUpdate);
  };

  const handleAccountDelete = () => {
    setShowConfirmModal(true);
    setAgreeStyle("red");
    setModalMessage(
      `Haluatko varmasti poistaa käyttäjän ${spectatorData.first_name} ${spectatorData.last_name}? 
  
      Tämä toiminto on peruuttamaton ja poistaa kaikki käyttäjän tiedot pysyvästi.`
    );
    setContinueButton("Poista");

    const handleUserConfirmation = async () => {
      try {
        await userService.deleteUser(spectatorData.id);
        await logout();
        addToast("Käyttäjä poistettu", { style: "success" });
      } catch (error) {
        console.error("Error deleting user or logging out:", error);
      } finally {
        setShowConfirmModal(false);
      }
    };
    setHandleUserConfirmation(() => handleUserConfirmation);
  };

  useEffect(() => {
    if (spectatorData) {
      setUpdatedEmail(spectatorData.email);
    }
  }, [spectatorData]);
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
      queryclient.invalidateQueries({queryKey: ["courseSegments"]});
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
        queryclient.invalidateQueries({queryKey: ["courseSegments"]});
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
              className="border rounded-md IconBox bg-bgSecondary text-btnGray border-bgSecondary hover:border-borderPrimary hover:text-hoverGray"
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
    "text-lg text-textPrimary border-borderPrimary border rounded-md p-1 bg-bgSecondary focus-visible:outline-none focus-visible:border-primaryColor";

  if (spectatorDataLoading || !courseSegments) {
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
                          peruuta
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
                className="p-2 mt-4 text-white w-fit Button"
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
                value={spectatorData.first_name + " " + spectatorData.last_name}
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
                className="p-2 mt-4 text-white w-fit Button"
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
                  className={cc(inputClass, "disabled:text-opacity-80")}
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

export default TeacherProfilePage;
