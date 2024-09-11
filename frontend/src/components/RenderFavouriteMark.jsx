import { useState } from "react";
import { TbPin, TbPinFilled, TbPinnedOff } from "react-icons/tb";
import studentService from "../services/studentService";

const RenderFavouriteMark = ({ journal, pinnedStudentsData, queryClient }) => {
  let isPinned = false;
  if (pinnedStudentsData) {
    isPinned = pinnedStudentsData.find(
      (pinnedStudent) => pinnedStudent.pinned_user_id === journal.user_id
    );
  }

  const [hover, setHover] = useState(false);

  const handlePinClick = async () => {
    try {
      if (isPinned) {
        await studentService.unpinStudent(journal.user_id).then(() => {});
      } else {
        await studentService.pinStudent(journal.user_id).then(() => {});
      }
    } catch (error) {
      console.log(error);
    } finally {
      queryClient.invalidateQueries({queryKey: ["pinnedStudents"]})
    }
  };

  return (
    <div
      className="absolute flex items-center justify-center w-6 h-6 cursor-pointer top-1 right-1"
      onClick={() => handlePinClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isPinned ? (
        hover ? (
          <TbPinnedOff size={20} className="text-primaryColor" />
        ) : (
          <TbPinFilled size={20} className="text-primaryColor" />
        )
      ) : (
        <TbPin
          size={20}
          className="text-textPrimary opacity-10 hover:text-primaryColor hover:opacity-100"
        />
      )}
    </div>
  );
};

export default RenderFavouriteMark;
