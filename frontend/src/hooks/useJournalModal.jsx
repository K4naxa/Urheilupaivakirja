import { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import JournalEntryModal from "../components/JournalEntryModal";
import NewJournalEntryPage from "../pages/student/journal-entry/NewJournalEntryPage";
import EditJournalEntryPage from "../pages/student/journal-entry/edit/EditJournalEntryPage";

const JournalModalContext = createContext();

export function useJournalModal() {
  return useContext(JournalModalContext);
}

export const JournalModalProvider = ({ children }) => {
  const [isBigModalOpen, setBigModalOpen] = useState(false);
  const [bigModalContent, setBigModalContent] = useState(null);

  const openBigModal = (type, payload) => {
    payload = payload || {};
    let content;
    switch (type) {
      case "new":
        content = (
          <NewJournalEntryPage
            onClose={closeBigModal}
            date={payload.date || null}
          />
        );
        break;
      case "edit":
        content = (
          <EditJournalEntryPage
            onClose={closeBigModal}
            entryId={payload.entryId}
          />
        );
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
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isBigModalOpen]);

  return (
    <JournalModalContext.Provider value={{ openBigModal, closeBigModal }}>
      {children}
      {isBigModalOpen &&
        createPortal(
          <JournalEntryModal
            isOpen={isBigModalOpen}
            onClose={closeBigModal}
            content={bigModalContent}
          />,
          document.getElementById("big-modal-container")
        )}
    </JournalModalContext.Provider>
  );
};
