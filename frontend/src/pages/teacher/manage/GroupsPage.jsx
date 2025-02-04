import groupService from "../../../services/groupService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useState, useEffect } from "react";
import cc from "../../../utils/cc";
import { useToast } from "../../../hooks/toast-messages/useToast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { TbArrowMergeAltRight } from "react-icons/tb";

// renders a container for a group while checking if it is being edited
function CreateGroupContainer({ group, setGroups, groups, queryclient }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGroup, setEditedGroup] = useState(group.name);
  const [cellError, setCellError] = useState(false);
  const { openConfirmModal } = useConfirmModal();
  const { addToast } = useToast();

  useEffect(() => {
    if (cellError) {
      setTimeout(() => {
        setCellError("");
      }, 7500);
    }
  }, [cellError]);

  // saves the edited group to the server and updates the state
  const handleSave = () => {
    if (editedGroup.length < 4) {
      setCellError("Ryhmän nimen pituus tulee olla vähintään 4 merkkiä.");
      return;
    }
    if (
      groups.find(
        (oGroup) => oGroup.name.toLowerCase() === editedGroup.toLowerCase()
      )
    ) {
      setCellError("Ryhmä on jo olemassa.");
      return;
    }

    const newGroup = {
      id: group.id,
      student_count: group.student_count,
      name: editedGroup,
    };
    groupService
      .editGroup(newGroup)
      .then(() => {
        queryclient.invalidateQueries({ queryKey: ["groups"] });
        addToast("Ryhmän nimi vaihdettu", { style: "success" });
        setIsEditing(false);
      })
      .catch((error) => {
        setCellError(error.response.data.error);
      });
  };

  const mergeGroups = useMutation({
    mutationFn: (mergeFromId, mergeToId) =>
      groupService.mergeGroups(mergeFromId, mergeToId),
    onError: (error) => {
      addToast("Virhe yhdistettäessä lajeja", { style: "error" });
    },
    onSuccess: (res) => {
      addToast(
        `${res.count} oppilasta siirrettiin ryhmästä ${res.mergeFrom} ryhmään ${res.mergeTo}`,
        { style: "success" }
      );
      queryclient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleMerge = () => {
    const handleFinalMerge = (selectedOptionId) => {
      selectedOptionId = Number(selectedOptionId);
      group.id = Number(group.id);
      mergeGroups.mutate({
        mergeFromId: group.id,
        mergeToId: selectedOptionId,
      });
    };

    const typeTextNominative = "ryhmä";
    const typeTextGenitive = "ryhmän";
    const typeTextIllative = "ryhmään";

    const modalText = (
      <span>
        Valitse {typeTextNominative}, johon {typeTextGenitive}
        <br />
        <strong>{group.name}</strong>
        <br />
        opiskelijat siirretään.
      </span>
    );

    openConfirmModal({
      type: "merge",
      text: modalText,
      thatMerges: group,
      typeTextNominative: typeTextNominative,
      typeTextIllative: typeTextIllative,
      onAgree: handleFinalMerge,
      mergeToOptions: groups,
      agreeButtonText: "Seuraava",
      declineButtonText: "Peruuta",
    });
  };

  // deletes the group from the server and updates the state
  // NEW
  const handleDelete = () => {
    const handleUserConfirmation = () => {
      groupService
        .deleteGroup(group.id)
        .then(() => {
          queryclient.invalidateQueries({ queryKey: ["groups"] });
          addToast("Ryhmä poistettu", { style: "success" });

        })
        .catch((error) => {
          addToast("Virhe poistettaessa ryhmää", { style: "error" });
          setCellError(error.response.data.error);
        });
    };

    const modalText = (
      <span>
        Haluatko varmasti poistaa ryhmän
        <br />
        <strong>{group.name}?</strong>
        <br />
      </span>
    );

    openConfirmModal({
      onAgree: () => handleUserConfirmation(),
      text: modalText,
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
      useTimer: true,
    });
  };

  // sets the group's "isEditing" property to "true"
  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedGroup(group.name);
      setIsEditing(false);
    }
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-4 p-2 my-2 rounded-md">
          <input
            autoFocus
            type="text"
            className="w-full p-1 border rounded-md text-textPrimary bg-bgGray border-borderPrimary focus-visible:outline-none"
            data-testid="editInput"
            defaultValue={editedGroup}
            onChange={(e) => setEditedGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
              }
            }}
          />
          <div className="flex gap-4 text-sm">
            <button
              data-testid="saveBtn"
              onClick={() => handleSave(editedGroup)}
              className="Button bg-btnGreen"
            >
              Tallenna
            </button>{" "}
            <button
              onClick={() => handleEdit()}
              data-testid="cancelBtn"
              className="Button bg-btnGray"
            >
              Peruuta
            </button>
          </div>
        </div>
        {cellError && <p className="px-2 text-btnRed">{cellError}</p>}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        {/* main Container */}
        <div className="grid items-center p-2 rounded-md grid-cols-controlpanel3 hover:bg-bgGray">
          <p className="">{group.name}</p>
          <p className="text-center">{group.student_count}</p>
          <div className="flex gap-4 ">
          <button
              id="editBtn"
              title="Muokkaa"
              className="IconButton text-iconGray hover:text-primaryColor"
              onClick={() => handleEdit()}
            >
              <FiEdit3 size={20} />
            </button>
            <button
              id="editBtn"
              title="Yhdistä"
              className="IconButton text-iconGray hover:text-primaryColor"
              onClick={() => handleMerge()}
            >
              <TbArrowMergeAltRight size={20} className="rotate-90" />
            </button>
            <button
              className="IconButton text-iconRed hover:text-red-700 "
              id="deleteBtn"
              title="Poista"
              onClick={() => handleDelete()}
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        {/* error container */}
        {cellError && (
          <p className="p-2 px-4 text-center text-btnRed ">{cellError}</p>
        )}
      </div>
    );
  }
}

const GroupsPage = () => {
  const queryclient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [sortedGroups, setSortedGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [sorting, setSorting] = useState({ name: 0, group: 0 });

  const {
    data: groups,
    error: groupsError,
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: groupService.getGroups,
  });

  useEffect(() => {
    if (groups) {
      setSortedGroups(groups);
    }
    [groups, sortedGroups];
  });

  useEffect(() => {
    if (sorting.name === 0 && sorting.student === 0)
      return setSortedGroups(groups);
    if (sorting.name) {
      if (sorting.name === 1) {
        setSortedGroups((prevGroups) =>
          [...prevGroups].sort((a, b) => (a.name > b.name ? 1 : -1))
        );
      } else if (sorting.name === -1) {
        setSortedGroups((prevGroups) =>
          [...prevGroups].sort((a, b) => (a.name < b.name ? 1 : -1))
        );
      }
    }

    if (sorting.student) {
      if (sorting.student === 1) {
        setSortedGroups((prevGroups) =>
          [...prevGroups].sort((a, b) =>
            a.student_count > b.student_count ? 1 : -1
          )
        );
      } else if (sorting.student === -1) {
        setSortedGroups((prevGroups) =>
          [...prevGroups].sort((a, b) =>
            a.student_count < b.student_count ? 1 : -1
          )
        );
      }
    }
  }, [sorting, groups]);

  const handleNameSorting = () => {
    let newSorting = { ...sorting, student: 0 };
    sorting.name === 0 && (newSorting = { ...newSorting, name: 1 });
    sorting.name === 1 && (newSorting = { ...newSorting, name: -1 });
    sorting.name === -1 && (newSorting = { ...newSorting, name: 0 });
    setSorting(newSorting);
  };
  const handleStudentSorting = () => {
    let newSorting = { ...sorting, name: 0 };
    sorting.student === 0 && (newSorting = { ...newSorting, student: 1 });
    sorting.student === 1 && (newSorting = { ...newSorting, student: -1 });
    sorting.student === -1 && (newSorting = { ...newSorting, student: 0 });
    setSorting(newSorting);
  };

  // Creates a new group of the input and adds it to the server and state
  const handleNewGroup = () => {
    if (newGroup === "") return;

    if (
      groups.some(
        (group) => group.name.toLowerCase() === newGroup.toLocaleLowerCase()
      )
    ) {
      setErrorMessage("Ryhmä on jo olemassa");
      return;
    }
    if (newGroup.length < 4) {
      setErrorMessage("Ryhmän nimi liian lyhyt");
      return;
    }

    groupService.addGroup(newGroup).then(() => {
      groupService.getGroups().then((data) => {
        queryclient.invalidateQueries({ queryKey: ["groups"] });
        addToast("Uusi ryhmä lisätty", { style: "success" });
      });
      setNewGroup("");
      setErrorMessage("");
    });
  };

  const handleInputError = (input, setError, groups) => {
    if (input === "") {
      setError("Ryhmän nimi puuttuu");
      return false;
    }
    if (input.length > 20) {
      setError("Ryhmän nimi liian pitkä");
      return false;
    }
    if (groups.some((group) => group.name === input)) {
      setError("Ryhmä on jo olemassa");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <div className="items-center w-full rounded-md bg-bgSecondary">
      {/* header for mobile*/}
      <div className="w-full py-4 text-2xl text-white text-center shadow-md md:hidden bg-primaryColor round">
        Ryhmät
      </div>
      {/* Error Header */}
      {errorMessage && (
        <div
          id="errorHeader"
          className="relative w-full p-2 mb-4 text-lg text-center shadow-md bg-btnRed text-textPrimary animate-menu-appear-top rounded-b-md"
        >
          <button
            onClick={() => setErrorMessage("")}
            className="absolute translate-y-1/2 right-4 bottom-1/2"
          >
            X
          </button>
          {errorMessage}
        </div>
      )}

      {/* Groups Container */}
      <div className="flex flex-col w-full gap-8 p-4 border rounded-md border-borderPrimary">
        {/* New Groups input */}
        <div className="flex justify-center mt-4 ">
          <input
            className="p-1 border text-textPrimary bg-bgGray border-borderPrimary rounded-l-md focus-visible:outline-none"
            type="text"
            data-testid="newGroupInput"
            placeholder="Uusi ryhmä"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewGroup();
              }
            }}
          />
          <button
            onClick={() => handleNewGroup()}
            className="px-4 py-2 text-white duration-75 select-none rounded-r-md bg-primaryColor hover:bg-hoverPrimary active:scale-95"
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-2" id="groupsContainer">
          <div className="grid w-full px-2 grid-cols-controlpanel3 text-textSecondary">
            <p
              onClick={() => {
                handleNameSorting();
              }}
              className={cc(
                "select-none cursor-pointer",
                sorting.name === 1 && "text-primaryColor",
                sorting.name === -1 && "text-primaryColor"
              )}
            >
              Laji
            </p>
            <p
              onClick={() => handleStudentSorting()}
              className={cc(
                "text-center select-none cursor-pointer",
                sorting.student === 1 && "text-primaryColor",
                sorting.student === -1 && "text-primaryColor"
              )}
            >
              Opiskelijat
            </p>
            <p className="w-16" />
          </div>
          <div
            className="flex flex-col divide-y divide-borderPrimary"
            id="groupsContainer"
          >
            {sortedGroups.map((group) => (
              <CreateGroupContainer
                queryclient={queryclient}
                groups={sortedGroups}
                setGroups={setSortedGroups}
                group={group}
                key={group.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
// Path: frontEnd/src/pages/teacher/manage/student-groups/GroupsPage.css'
