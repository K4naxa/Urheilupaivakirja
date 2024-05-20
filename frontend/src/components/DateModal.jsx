import { useEffect } from "react";
import { useDateModal } from "../hooks/useDateModal";
import { FiBookOpen, FiPlusCircle } from "react-icons/fi";
import { useJournalModal } from "../hooks/useJournalModal";
import dayjs from "dayjs";

const DateModal = () => {
  const { dateModalPos, selectedDate, hideDateModal } = useDateModal();
  const { openBigModal } = useJournalModal();
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById("date-modal");
      if (modal && !modal.contains(event.target)) {
        hideDateModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideDateModal]);

  const onClickShow = () => {
    console.log("Show");
    hideDateModal();
  };

  const onClickAdd = () => {
    openBigModal("new", { date: selectedDate });
    hideDateModal();
  };

  const modalStyle = {
    left: `${dateModalPos.x}px`,
    top: `${dateModalPos.y}px`,
  };

  const arrowStyle = {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeft: "11px solid transparent",
    borderRight: "11px solid transparent",
    borderBottom: `11px solid white`,
    left: `${dateModalPos.arrowLeft}px`,
    top: "-10px",
  };

  const arrowBackgroundStyle = {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeft: "11px solid transparent",
    borderRight: "11px solid transparent",
    borderBottom: `11px solid black`,
    borderRadius: "0px",
    left: `${dateModalPos.arrowLeft}px`,
    top: "-10px",
  };

  console.log("arrowLeft", dateModalPos.arrowLeft);

  return (
    <div
      id="date-modal"
      style={modalStyle}
      className="absolute z-50 p-2.5 bg-bgSecondary border border-borderPrimary rounded shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div style={arrowBackgroundStyle}></div>
      <div style={arrowStyle}></div>

      <div className="flex justify-center items-center">
        <h2 className="text-sm font-semibold">
          {dayjs(selectedDate).format("DD.MM.YYYY")}
        </h2>
      </div>
      <div className="flex justify-between">
        <div
          className="m-1 px-4 py-2 bg-headerPrimary text-white rounded cursor-pointer flex items-center"
          onClick={onClickShow}
        >
          <FiBookOpen className="text-xl" />
          <p className="ml-2 text-sm">Näytä</p>
        </div>
        <div
          className="m-1 px-4 py-2 bg-headerPrimary text-white rounded cursor-pointer flex items-center"
          onClick={onClickAdd}
        >
          <FiPlusCircle className="text-xl" />
          <p className="ml-2 text-sm">Lisää</p>
        </div>
      </div>
    </div>
  );
};

export default DateModal;
