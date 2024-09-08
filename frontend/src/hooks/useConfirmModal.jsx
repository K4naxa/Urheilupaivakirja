import React, { createContext, useContext, useState } from "react";
import ConfirmModal from "../components/confirm-modal/ConfirmModal";
import AccountDeleteConfirmModal from "../components/confirm-modal/AccountDeleteConfirmModal";
// Import the new modal component
import AdminAccountDeleteConfirmModal from "../components/confirm-modal/AdminAccountDeleteConfirmModal";
import MergeConfirmModal from "../components/confirm-modal/MergeConfirmModal";

const ConfirmModalContext = createContext();

export const useConfirmModal = () => useContext(ConfirmModalContext);

export const ConfirmModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openConfirmModal = (modalProps) => {
    const { type = "default" } = modalProps; // set default here
    setModals([
      ...modals,
      { ...modalProps, isOpen: true, id: Math.random(), type },
    ]);
  };

  const closeConfirmModal = (id) => {
    setModals(modals.filter((modal) => modal.id !== id));
  };

  return (
    <ConfirmModalContext.Provider
      value={{ openConfirmModal, closeConfirmModal }}
    >
      {children}
      {modals.map((modal) => {
        // Render the modal based on the type property
        let ModalComponent;
        switch (modal.type) {
          case "accountDelete":
            ModalComponent = AccountDeleteConfirmModal;
            break;
          case "adminAccountDelete":
            ModalComponent = AdminAccountDeleteConfirmModal;
            break;
          case "merge":
            ModalComponent = MergeConfirmModal;
            break;
          case "compare":
            ModalComponent = CompareConfirmModal;
            break;
          default:
            ModalComponent = ConfirmModal;
        }
        return (
<ModalComponent
  key={modal.id}
  {...modal}
  onDecline={() => closeConfirmModal(modal.id)}
  onAgree={(...args) => {
    if (modal.type === "merge") {
      modal.onAgree(...args);
    } else {
      modal.onAgree();
    }
    closeConfirmModal(modal.id);
  }}
/>

        );
      })}
    </ConfirmModalContext.Provider>
  );
};
