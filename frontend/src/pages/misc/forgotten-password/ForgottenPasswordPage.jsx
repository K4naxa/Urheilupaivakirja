import OTPInput from "../../../components/OTPInput";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";
import userService from "../../../services/userService";

const ForgottenPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    mutate: requestPasswordReset,
    isError,
    error,
  } = useMutation({
    mutationFn: () => userService.requestPasswordReset(email), // Ensure the mutation function takes necessary parameters, like user email
    onError: (error) => {
      console.error("Error requesting password reset:", error);
      addToast("Tapahtui virhe, ota yhteyttä ylläpitoon", { style: "error" });
    },
    onSuccess: () => {
      navigate("/unohditko-salasanasi/vahvista", { state: { email: email } });
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    requestPasswordReset();
  };

  return (
    <div className="bg-bgkPrimary text-textPrimary grid place-items-center  h-screen w-screen">
      <div className="bg-bgkSecondary border-borderPrimary flex h-full  w-full sm:max-w-[500px] flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Salasanan palautus
        </div>
        <form
          onSubmit={handleSend}
          className="relative flex h-full pt-20 flex-col gap-10 p-8 sm:p-12 items-center justify-center"
        >
          <p>Syötä sähköpostiosoitteesi</p>
          <div className=" flex w-full flex-col gap-1 relative">
            <input
              type="email"
              value={email}
              required
              placeholder="Sähköposti"
              className={` text-lg  text-textPrimary border-borderPrimary bg-bgkSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1 `} //${ errors.emailError ? " border-red-500" : ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="bg-headerPrimary text-bgkPrimary w-full h-10 rounded-md">
            Lähetä
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgottenPasswordPage;
