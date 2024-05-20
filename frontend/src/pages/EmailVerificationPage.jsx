import { useMutation } from "@tanstack/react-query";
import OTPInput from "../components/OTPInput";
import { useToast } from "../hooks/toast-messages/useToast";
import { useEffect } from "react";
import userService from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EmailVerificationPage = () => {
  const { addToast } = useToast();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const {
    mutate: requestOTP,
    isError,
    error,
  } = useMutation({
    mutationFn: () => userService.createEmailVerificationOTP(), // Ensure the mutation function takes necessary parameters, like user email
    onError: (error) => {
      console.error("Error sending OTP:", error);
      addToast(
        "Virhe lähetettäessä vahvistuskoodia, ota yhteyttä ylläpitäjään",
        { style: "error" }
      );
    },
    onSuccess: () => {
      addToast("Vahvistuskoodi lähetetty sähköpostiisi.", { style: "success" });
    },
  });

  const {
    mutate: verifyOTP,
    isError: verifyIsError,
    error: verifyError,
  } = useMutation({
    mutationFn: (otp) => userService.sendEmailVerificationOTP(otp),
    onError: (error) => {
      console.error("Error verifying OTP:", error);
      addToast(
        "Virhe vahvistaessa vahvistuskoodia, tarkista koodi tai yritä uudelleen",
        { style: "error" }
      );
    },
    onSuccess: (data) => {
      addToast("Sähköpostiosoitteesi on nyt vahvistettu.", {
        style: "success",
      });
      if (data) {
        login(data);
      }
    },
  });

  useEffect(() => {
    if (user && !user.emailVerified) {
      requestOTP();
    }
  }, [user, requestOTP]);

  useEffect(() => {
    if (user.email_verified) {
      switch (user.role) {
        case 1:
          navigate("/opettaja");
          break;
        case 2:
          navigate("/vierailija");
          break;
        case 3:
          navigate("/");
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="bg-bgPrimary text-textPrimary grid place-items-center h-screen w-screen">
      <div className="bg-bgSecondary border-borderPrimary flex h-full w-full sm:max-w-[500px] flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Sähköpostin vahvistus
        </div>
        <div className="relative flex h-full pt-20 flex-col gap-10 p-8 sm:p-12 items-center justify-center">
          <p>Syötä sähköpostiisi lähetetty koodi. Etkö saanut linkkiä?</p>
          <button
            className="bg-headerPrimary hover:bg-buttonHoverColor cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => requestOTP()}
          >
            Lähetä uudelleen
          </button>
          <OTPInput length={8} onComplete={verifyOTP} />
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
