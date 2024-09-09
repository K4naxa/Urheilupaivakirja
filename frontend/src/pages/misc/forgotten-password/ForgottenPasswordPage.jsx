import OTPInput from "../../../components/OTPInput";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";
import userService from "../../../services/userService";
import { FiArrowLeft } from "react-icons/fi";

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
      if (error.response.status === 429) {
        const waitTimeMs = error.response.data.wait_time;
        const minutes = Math.floor(waitTimeMs / 1000 / 60);
        const seconds = Math.floor((waitTimeMs / 1000) % 60);

        const minuteString = `${minutes}m`;
        var secondString;
        if (seconds === 0) {
          secondString = "";
        } else {
          secondString = `  ${seconds}s`;
        }
        addToast(
          `Voit lähettää uuden vahvistuskoodin ${minuteString}${secondString} kuluttua.`,
          { style: "error" }
        );
        return;
      } else {
        addToast(
          "Virhe lähetettäessä vahvistuskoodia, ota yhteyttä ylläpitäjään",
          { style: "error" }
        );
      }
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
    <div className="bg-bgPrimary text-textPrimary grid place-items-center  h-screen w-screen">
      <div className="bg-bgSecondary border-borderPrimary flex h-full  w-full sm:max-w-[500px] flex-col self-center shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className=" relative bg-primaryColor text-white border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          <p>Salasanan palautus</p>

          <Link
            to="/LoginPage"
            className="absolute bottom-1/2 translate-y-1/2 left-5 text-3xl"
          >
            <FiArrowLeft />
          </Link>
        </div>
        <form
          onSubmit={handleSend}
          className="relative flex h-full pt-20 flex-col gap-10 p-8 sm:p-12 items-center md:justify-center"
        >
          <p>Syötä sähköpostiosoitteesi</p>
          <div className=" flex w-full flex-col gap-1 relative">
            <input
              type="email"
              value={email}
              required
              placeholder="Sähköposti"
              className={` text-lg  text-textPrimary border-borderPrimary bg-bgSecondary h-10 w-full focus-visible:outline-none focus-visible:border-primaryColor border-b p-1 `} //${ errors.emailError ? " border-red-500" : ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="bg-primaryColor text-bgPrimary w-full h-10 rounded-md duration-75 hover:bg-hoverPrimary active:scale-95">
            Lähetä
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgottenPasswordPage;
