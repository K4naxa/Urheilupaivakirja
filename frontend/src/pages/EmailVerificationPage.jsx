import { useMutation, useQuery } from "@tanstack/react-query";
import OTPInput from "../components/OTPInput";
import { useToast } from "../hooks/toast-messages/useToast";
import { useEffect } from "react";
import registerService from "../services/registerService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FiArrowLeft } from "react-icons/fi";

const EmailVerificationPage = () => {
  const { addToast } = useToast();
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Query to check if OTP already exists
  const { data: otpExists } = useQuery({
    queryKey: ["checkIfOTPExists"],
    queryFn: () => registerService.checkIfOTPExists(),
    enabled: !!user, // Run this query only if the user exists
  });

  const {
    mutate: requestOTP,
    isError,
    error,
  } = useMutation({
    mutationFn: () => registerService.createEmailVerificationOTP(),
    onError: (error) => {
      if (error.response.status === 429) {
        const waitTimeMs = error.response.data.wait_time;
        const minutes = Math.floor(waitTimeMs / 1000 / 60);
        const seconds = Math.floor((waitTimeMs / 1000) % 60);

        const minuteString = `${minutes} minuutin`;
        var secondString;
        if (seconds === 0) {
          secondString = "";
        } else {
          secondString = ` ja ${seconds} sekunnin`;
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
      addToast("Vahvistuskoodi on lähetetty sähköpostiisi.", { style: "success" });
    },
  });

  const {
    mutate: verifyOTP,
    isError: verifyIsError,
    error: verifyError,
  } = useMutation({
    mutationFn: (otp) => registerService.sendEmailVerificationOTP(otp),
    onError: () => {
      addToast(
        "Virhe tarkistettaessa vahvistuskoodia, tarkista koodi tai yritä uudelleen",
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
    if (user && !user.emailVerified && otpExists === false) {
      requestOTP();
    }
  }, [user, otpExists, requestOTP]);

  useEffect(() => {
    if (user?.email_verified) {
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
      <div className="bg-bgSecondary border-borderPrimary flex h-full w-full sm:max-w-[500px] flex-col self-center sm:border shadow-md min-h-max sm:h-[max-content] sm:rounded-md overflow-y-auto">
        <div className="relative bg-primaryColor text-white border-borderPrimary border-b p-5 text-center text-xl shadow-md sm:rounded-t-md ">
          Sähköpostin vahvistus
          <button
            onClick={() => {
              logout();
            }}
            className="absolute top-0 left-0 text-2xl hover:scale-125 transition-transform duration-150 p-5"
          >
            <FiArrowLeft />
          </button>
        </div>
        <div className="relative flex h-full pt-20 flex-col gap-10 p-2 sm:p-12 items-center md:justify-center">
          <p className="text-center">
            Syötä sähköpostiisi lähetetty koodi. Etkö saanut linkkiä?
          </p>
          <button
            className="bg-primaryColor hover:bg-buttonHoverColor cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-75 hover:bg-hoverPrimary active:scale-95"
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
