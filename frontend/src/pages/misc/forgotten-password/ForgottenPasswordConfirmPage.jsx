import OTPInput from "../../../components/OTPInput";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../hooks/toast-messages/useToast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";
import userService from "../../../services/userService";
import { useLocation } from "react-router-dom";

const ForgottenPasswordConfirmPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const {
    mutate: requestPasswordReset,
    isError,
    error,
  } = useMutation({
    mutationFn: (otp) => userService.verifyPasswordResetOTP(email, otp),
    onError: (error) => {
      console.error("Error requesting password reset:", error);
      addToast("Tapahtui virhe, ota yhteyttä ylläpitoon", { style: "error" });
    },
    onSuccess: (data) => {
      addToast("Vahvistuskoodi lähetetty sähköpostiisi.", { style: "success" });
      navigate("/unohditko-salasanasi/uusi-salasana", {
        replace: true,
        state: { resetToken: data.resetToken, email: email },
      });
    },
  });

  return (
    <div className="bg-bgkPrimary text-textPrimary grid place-items-center  h-screen w-screen">
      <div className="bg-bgkSecondary border-borderPrimary flex h-full  w-full sm:max-w-[500px] flex-col self-center border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="bg-headerPrimary border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md">
          Salasanan palautus
        </div>
        <div className="relative flex h-full pt-20 flex-col gap-10 p-8 sm:p-12 items-center justify-center">
          <p>Syötä sähköpostiisi lähetetty koodi.</p>
          <OTPInput length={6} onComplete={requestPasswordReset} />
        </div>
      </div>
    </div>
  );
};

export default ForgottenPasswordConfirmPage;
