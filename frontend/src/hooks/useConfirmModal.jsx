import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/confirm-modal/confirmModal';
import AccountDeleteConfirmModal from '../components/confirm-modal/accountDeleteConfirmModal'; // Assume this is another modal component

const ConfirmModalContext = createContext();

export const useConfirmModal = () => useContext(ConfirmModalContext);

export const ConfirmModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openConfirmModal = (modalProps) => {
    const { type = 'default' } = modalProps; // Default type can be set here
    setModals([...modals, { ...modalProps, isOpen: true, id: Math.random(), type }]);
  };

  const closeConfirmModal = (id) => {
    setModals(modals.filter(modal => modal.id !== id));
  };

  return (
    <ConfirmModalContext.Provider value={{ openConfirmModal, closeConfirmModal }}>
      {children}
      {modals.map(modal => {
        // render modal based on type
        const ModalComponent = modal.type === 'accountDelete' ? AccountDeleteConfirmModal : ConfirmModal;
        return (
          <ModalComponent
            key={modal.id}
            {...modal}
            onDecline={() => closeConfirmModal(modal.id)}
            onAgree={() => {
              modal.onAgree();
              closeConfirmModal(modal.id);
            }}
          />
        );
      })}
    </ConfirmModalContext.Provider>
  );
};
