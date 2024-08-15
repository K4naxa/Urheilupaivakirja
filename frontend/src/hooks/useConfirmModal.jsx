import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/confirm-modal/confirmModal';

const ConfirmModalContext = createContext();

export const useConfirmModal = () => useContext(ConfirmModalContext);

export const ConfirmModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openConfirmModal = (modalProps) => {
    setModals([...modals, { ...modalProps, isOpen: true, id: Math.random() }]);
  };

  const closeConfirmModal = (id) => {
    setModals(modals.filter(modal => modal.id !== id));
  };

  return (
    <ConfirmModalContext.Provider value={{ openConfirmModal, closeConfirmModal }}>
      {children}
      {modals.map(modal => (
        <ConfirmModal
          key={modal.id}
          {...modal}
          onDecline={() => closeConfirmModal(modal.id)}
          onAgree={() => {
            modal.onAgree();
            closeConfirmModal(modal.id);
          }}
        />
      ))}
    </ConfirmModalContext.Provider>
  );
};
