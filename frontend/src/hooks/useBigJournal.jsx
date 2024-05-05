import { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NewJournalEntryModal from '../components/newJournalEntryModal';
import NewJournalEntryPage from '../pages/student/journal-entry/NewJournalEntryPage';
import EditJournalEntryPage from '../pages/student/journal-entry/edit/EditJournalEntryPage';

const BigJournalContext = createContext();

export function useBigJournal() {
  return useContext(BigJournalContext);
}

export const BigJournalProvider = ({ children }) => {
  const [isBigModalOpen, setBigModalOpen] = useState(false);
  const [bigModalContent, setBigModalContent] = useState(null);

  const openBigModal = (type, entryId) => {
    let content;
    switch (type) {
      case 'new':
        content = <NewJournalEntryPage onClose={closeBigModal} />;
        break;
      case 'edit':
        content = <EditJournalEntryPage onClose={closeBigModal} entryId={entryId} />;
        break;
      default:
        content = <div>Jokin meni vikaan</div>;
    }

    setBigModalContent(content);
    setBigModalOpen(true);
    window.history.pushState({ modalOpen: true }, "");
  };

  const closeBigModal = () => {
    setBigModalOpen(false);
    setBigModalContent(null);
    if (window.history.state?.modalOpen) {
      window.history.back();
    } else {
      window.history.replaceState(null, "");
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (isBigModalOpen && (event.state === null || !event.state?.modalOpen)) {
        closeBigModal();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isBigModalOpen]);

  return (
    <BigJournalContext.Provider value={{ openBigModal, closeBigModal }}>
      {children}
      {isBigModalOpen && (
        createPortal(
          <NewJournalEntryModal
            isOpen={isBigModalOpen}
            onClose={closeBigModal}
            content={bigModalContent}
          />,
          document.getElementById("big-modal-container")
        )
      )}
    </BigJournalContext.Provider>
  );
};
