import { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BigModal from "../components/BigModal";
import NewJournalEntryPage from "../pages/student/journal-entry/NewJournalEntryPage";
import EditJournalEntryPage from "../pages/student/journal-entry/EditJournalEntryPage";
import NewNewsEntryPage from "../pages/teacher/news/NewNewsEntryPage";
import EditNewsEntryPage from "../pages/teacher/news/EditNewsEntryPage";

const BigModalContext = createContext();

export function useBigModal() {
  return useContext(BigModalContext);
}

export const BigModalProvider = ({ children }) => {
  const [isBigModalOpen, setBigModalOpen] = useState(false);
  const [bigModalContent, setBigModalContent] = useState(null);

  const openBigModal = (type, payload = {}) => {
    const { date = null, studentData = null, entryId = null } = payload;
    let content;
    switch (type) {
      case "newJournalEntry":
        content = (
          <NewJournalEntryPage
            onClose={closeBigModal}
            date={payload.date || null}
            studentData={studentData}
          />
        );
        break;
      case "editJournalEntry":
        content = (
          <EditJournalEntryPage
            onClose={closeBigModal}
            entryId={payload.entryId}
            studentData={studentData}
          />
        );
        break;

      case "newNewsEntry":
        content = (
          <NewNewsEntryPage
            onClose={closeBigModal}
            date={payload.date || null}
          />
        );
        break;

        case "editNewsEntry":
          content = (
            <EditNewsEntryPage
              onClose={closeBigModal}
              entryId={entryId}
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
    <BigModalContext.Provider value={{ openBigModal, closeBigModal }}>
      {children}
      {isBigModalOpen &&
        createPortal(
          <BigModal
            isOpen={isBigModalOpen}
            onClose={closeBigModal}
            content={bigModalContent}
          />,
          document.getElementById("big-modal-container")
        )}
    </BigModalContext.Provider>
  );
};
