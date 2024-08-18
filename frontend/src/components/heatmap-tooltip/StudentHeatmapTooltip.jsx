import {
  FiPlusCircle,
  FiEdit3,
  FiSun,
  FiSunrise,
  FiSunset,
} from "react-icons/fi";
import dayjs from "dayjs";
import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import { useJournalModal } from "../../hooks/useJournalModal";
import { useAuth } from "../../hooks/useAuth";
import { useHeatmapContext } from "../../hooks/useHeatmapContext";

const StudentHeatmapTooltip = () => {
  const { openBigModal } = useJournalModal();
  const { user } = useAuth();
  const { tooltipContent } = useHeatmapContext();
  const { tooltipUser } = useHeatmapContext();
  const { tooltipDate } = useHeatmapContext();

  const TooltipContent = ({ user, openBigModal }) => {
    const [expandedEntry, setExpandedEntry] = useState(null);
    const dayEntries = tooltipContent;
    const day = tooltipDate;

    const simulateClickOutside = () => {
      const benignElement = document.getElementById("benign-target");
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      if (benignElement) {
        benignElement.dispatchEvent(clickEvent);
      } else {
        console.error("Where is the benign-target element?");
      }
    };

    const renderTimeOfDayIcon = (timeOfDay) => {
      switch (timeOfDay) {
        case "Aamu":
          return <FiSunrise className="text-lg" title="Aamu" />;
        case "Päivä":
          return <FiSun className="text-lg" title="Päivä" />;
        case "Ilta":
          return <FiSunset className="text-lg" title="Ilta" />;
        default:
          return null;
      }
    };

    const allEntriesAreExercises = dayEntries?.every(
      (entry) => entry.entry_type_id === 1
    );

    const toggleDetails = (entryId) => {
      if (expandedEntry === entryId) {
        setExpandedEntry(null);
      } else {
        setExpandedEntry(entryId);
      }
    };

    dayEntries.sort((a, b) => a.time_of_day_id - b.time_of_day_id);

    return (
      <>
        <div className="flex flex-col gap-1 text-textPrimary">
          <h2 className="mt-1 text-sm font-semibold text-center">
            {dayjs(day).format("DD.MM.YYYY")}
          </h2>

          {dayEntries?.length > 0 && (
            <>
              {allEntriesAreExercises ? (
                <table className="w-full text-right text-textPrimary">
                  <tbody>
                    {dayEntries.map((entry) => (
                      <React.Fragment key={entry.id}>
                        <tr
                          className="cursor-pointer hover:bg-bgGray"
                          onClick={() => toggleDetails(entry.id)}
                        >
                          <td className="flex justify-center px-2">
                            {renderTimeOfDayIcon(entry.time_of_day_name)}
                          </td>
                          <td className="px-2 ">
                            {entry.workout_category_name}
                          </td>
                          <td className="px-2">
                            {entry.length_in_minutes} min
                          </td>
                          {user.role === 3 && (
                            <td className="px-2">
                              <button
                                className="flex justify-center"
                                onClick={(e) => {
                                  e.stopPropagation(); // to prevent row toggle
                                  openBigModal("edit", { entryId: entry.id });
                                  simulateClickOutside();
                                }}
                              >
                                <FiEdit3 className="text-textPrimary hover:text-primaryColor" />
                              </button>
                            </td>
                          )}
                        </tr>
                        {expandedEntry === entry.id && (
                          <tr>
                            <td colSpan={5}>
                              <div>
                                <p>...</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                dayEntries.map((entry) => (
                  <div key={entry.id} className="text-center">
                    <p>
                      {entry.entry_type_id === 3
                        ? "Sairauspäivä"
                        : entry.entry_type_id === 2
                          ? "Lepopäivä"
                          : "Jotain meni vikaan!"}
                    </p>
                  </div>
                ))
              )}
            </>
          )}

          <div className="flex justify-center gap-2 py-1">
            {user.role === 3 &&
              (dayEntries?.length > 0 ? (
                allEntriesAreExercises ? (
                  <>
                    <button
                      className="flex items-center px-4 py-2 text-white rounded cursor-pointer bg-primaryColor hover:bg-hoverPrimary"
                      onClick={() => {
                        openBigModal("new", {
                          date: dayjs(day).format("YYYY-MM-DD"),
                        });
                        simulateClickOutside();
                      }}
                    >
                      <FiPlusCircle className="text-xl" />
                      <p className="ml-2 text-sm">Uusi merkintä</p>
                    </button>
                  </>
                ) : (
                  <button
                    className="flex items-center px-4 py-2 text-white rounded cursor-pointer bg-primaryColor hover:bg-hoverPrimary"
                    onClick={() => {
                      openBigModal("edit", { entryId: dayEntries[0].id });
                      simulateClickOutside();
                    }}
                  >
                    <FiEdit3 className="text-xl" />
                    <p className="ml-2 text-sm">Muokkaa</p>
                  </button>
                )
              ) : (
                <button
                  className="flex items-center px-4 py-2 text-white rounded cursor-pointer bg-primaryColor hover:bg-hoverPrimary"
                  onClick={() => {
                    openBigModal("new", {
                      date: dayjs(day).format("YYYY-MM-DD"),
                    });
                    simulateClickOutside();
                  }}
                >
                  <FiPlusCircle className="text-xl" />
                  <p className="ml-2 text-sm">Uusi merkintä</p>
                </button>
              ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <Tooltip
      anchorSelect=".clickableCalendarDay"
      className="z-10 border nice-shadow border-borderPrimary"
      place="bottom"
      openOnClick={true}
      clickable={true}
      opacity={1}
      offset="2"
      style={{
        backgroundColor: "rgb(var(--color-bg-secondary))",
        padding: "0.5rem",
      }}
    >
      {tooltipContent && (
        <TooltipContent user={user} openBigModal={openBigModal} />
      )}
    </Tooltip>
  );
};

export { StudentHeatmapTooltip };
