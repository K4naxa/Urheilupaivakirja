import React, { createContext, useContext, useState } from "react";
import ConfirmModal from "../components/confirm-modal/ConfirmModal";
import AccountDeleteConfirmModal from "../components/confirm-modal/AccountDeleteConfirmModal";
import AdminAccountDeleteConfirmModal from "../components/confirm-modal/AdminAccountDeleteConfirmModal";
import MergeConfirmModal from "../components/confirm-modal/MergeConfirmModal";

const ConfirmModalContext = createContext();

export const useConfirmModal = () => useContext(ConfirmModalContext) || { openConfirmModal: () => {}, closeConfirmModal: () => {} };

export const ConfirmModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openConfirmModal = (modalProps) => {
    const { type = "default" } = modalProps;
    setModals((prevModals) => [
      ...prevModals,
      { ...modalProps, isOpen: true, id: Math.random(), type },
    ]);
  };

  const closeConfirmModal = (id) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
  };

  return (
    <ConfirmModalContext.Provider value={{ openConfirmModal, closeConfirmModal }}>
      {children}

      {modals.map((modal) => {
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
              // Close the modal after agreeing
              if (typeof modal.onAgree === "function") {
                modal.onAgree(...args);
              }
              closeConfirmModal(modal.id);
            }}
          />
        );
      })}
    </ConfirmModalContext.Provider>
  );
};
