import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import userService from "../../services/userService";
import { useToast } from "../../hooks/toast-messages/useToast";

const AccountDeleteConfirmModal = ({
  onDecline,
  handleLogout,
  text,
  closeOnOutsideClick = true,
}) => {
  const { addToast } = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const deleteUser = useMutation({
    mutationFn: (password) => userService.deleteUserSelf(password),
    onError: (error) => {
      console.error("Error deleting account:", error);
      addToast("Virhe poistettaessa käyttäjätunnusta", { style: "error" });
      setError("Virhe poistettaessa käyttäjätunnusta");
    },
    onSuccess: () => {
      addToast("Käyttäjätunnuksesi on poistettu", { style: "success" });
      handleLogout();
      onDecline();
    },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onDecline();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDecline]);

  const handleAgree = async () => {
    try {
      const verified = await userService.verifyPassword(password);
      if (verified) {
        deleteUser.mutate(password);
      } else {
        setError("Väärä salasana. Yritä uudelleen.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("Virhe tarkistettaessa salasanaa. Yritä uudelleen.");
    }
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleAgree();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleAgree]);

  return createPortal(
    <div
      className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen bg-modalPrimary bg-opacity-50 text-textPrimary z-50"
      onClick={closeOnOutsideClick ? onDecline : undefined}
    >
      <div
        className="flex max-w-[420px] flex-col bg-bgSecondary gap-4 p-6 m-4 rounded-md shadow-lg border border-borderPrimary"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center">{text}</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="password"
          placeholder="Syötä salasanasi varmistaaksesi poiston"
          className="w-full p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center gap-8">
          <button
            className="w-20 py-1.5 border rounded-md border-borderPrimary hover:bg-hoverDefault"
            onClick={onDecline}
          >
            Peruuta
          </button>
          <button
            className="w-20 py-1.5 border rounded-md  text-white bg-btnRed border-btnRed hover:bg-red-800 "
            onClick={handleAgree}
          >
            Poista
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("confirm-modal-container")
  );
};

export default AccountDeleteConfirmModal;
