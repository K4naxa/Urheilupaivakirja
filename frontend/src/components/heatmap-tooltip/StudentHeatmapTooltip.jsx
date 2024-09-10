import {
  FiPlusCircle,
  FiEdit3,
  FiSun,
  FiSunrise,
  FiSunset,
} from "react-icons/fi";
import dayjs from "dayjs";
import { Tooltip } from "react-tooltip";
import React, { useState, useMemo } from "react";
import { useBigModal } from "../../hooks/useBigModal";
import { useAuth } from "../../hooks/useAuth";
import { useHeatmapContext } from "../../hooks/useHeatmapContext";

const StudentHeatmapTooltip = ({ studentData }) => {
  const { openBigModal } = useBigModal();
  const { user } = useAuth();
  const { tooltipContent, tooltipUser, tooltipDate } = useHeatmapContext();

  const TooltipContent = React.memo(({ user, openBigModal }) => {
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
          return <FiSunrise className="text-xl" title="Aamu" />;
        case "Päivä":
          return <FiSun className="text-xl" title="Päivä" />;
        case "Ilta":
          return <FiSunset className="text-xl" title="Ilta" />;
        default:
          return null;
      }
    };

    const convertTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (hours === 0) {
        return `${minutes}min`;
      }
      if (minutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${minutes}min`;
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

    const sortedDayEntries = useMemo(() => {
      return dayEntries
        ?.slice()
        .sort((a, b) => a.time_of_day_id - b.time_of_day_id);
    }, [dayEntries]);

    return (
      <>
        <div className="flex flex-col gap-1 text-textPrimary">
          <h2 className="mt-1 text-sm font-semibold text-center">
            {dayjs(day).format("DD.MM.YYYY")}
          </h2>

          {sortedDayEntries?.length > 0 && (
            <>
              {allEntriesAreExercises ? (
                <div className="space-y-1 border-t border-borderPrimary">
                  {sortedDayEntries.map((entry, index) => (
                    <div key={entry.id}>
                      <div
                        className={`p-1 bg-bgSecondary hover:bg-bgPrimary  cursor-pointer ${
                          index > 0 ? "border-t border-borderPrimary" : ""
                        }`}
                        onClick={() => toggleDetails(entry.id)}
                      >
                        {/* Header Row */}
                        <div className="flex justify-between items-center">
                          {/* Time of Day Icon (stick to the right) */}
                          <div className="p-2 text-center">
                            {renderTimeOfDayIcon(entry.time_of_day_name)}
                          </div>
                          {/* Main content (centered) */}
                          <div className="flex flex-col justify-center items-center w-full px-1">
                            <span className="text font-semibold text-textPrimary">
                              {(() => {
                                if (
                                  entry.workout_type_id === 1 ||
                                  entry.workout_type_id === 2
                                ) {
                                  return entry.workout_type_name;
                                }
                                if (entry.workout_category_id === 1) {
                                  return user.sport;
                                }
                                if (entry.workout_type_id === 3) {
                                  return entry.workout_category_name;
                                }
                                return null;
                              })()}
                            </span>

                            {/* Updated row with length and intensity */}
                            <div className="flex justify-center space-x-1">
                              <span className="text-sm text-textPrimary">
                                {convertTime(entry.length_in_minutes)},
                              </span>

                              {/* convert intensity to lower case */}
                              <span className="text-sm text-textPrimary">
                                {entry.workout_intensity_name.toLowerCase()}
                              </span>
                            </div>
                          </div>

                          {user.role === 3 && (
                            <button
                              className="flex justify-center items-center p-2 hover:text-primaryColor"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row toggle
                                openBigModal("editJournalEntry", {
                                  entryId: entry.id,
                                  studentData,
                                });
                                simulateClickOutside();
                              }}
                            >
                              <FiEdit3 className=" text-xl" />
                            </button>
                          )}
                        </div>

                        {/* Expanded Details */}
                        {expandedEntry === entry.id && (
                          <div className="space-y-3 pt-1 text-center">
                            <div className="flex justify-center">
                              <p className="text-textSecondary text-center">
                                {entry.details
                                  ? entry.details
                                  : "Ei lisätietoja"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                sortedDayEntries.map((entry) => (
                  <div key={entry.id} className="text-center pt-2 border-t border-borderPrimary">
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
              (sortedDayEntries?.length > 0 ? (
                allEntriesAreExercises ? (
                  <>
                    <button
                      className="flex items-center p-2  text-white rounded cursor-pointer bg-primaryColor hover:bg-hoverPrimary"
                      onClick={() => {
                        openBigModal("newJournalEntry", {
                          date: dayjs(day).format("YYYY-MM-DD"),
                          studentData,
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
                    className="flex items-center p-2 text-white rounded cursor-pointer bg-primaryColor hover:bg-hoverPrimary"
                    onClick={() => {
                      openBigModal("editJournalEntry", {
                        entryId: sortedDayEntries[0].id,
                        studentData,
                      });
                      simulateClickOutside();
                    }}
                  >
                    <FiEdit3 className="text-xl" />
                    <p className="ml-2 text-sm">Muokkaa</p>
                  </button>
                )
              ) : (
                <button
                  className="flex items-center p-2 text-white rounded cursor-pointer bg-primaryColor hover:bg-hoverPrimary"
                  onClick={() => {
                    openBigModal("newJournalEntry", {
                      date: dayjs(day).format("YYYY-MM-DD"),
                      studentData,
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
  });
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
