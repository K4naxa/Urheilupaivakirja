import TeacherHeader from "../../../layouts/teacher-layout/TeacherLayout.jsx";
import HeatMap_Year from "../../../components/HeatMap_Year.jsx";

function TeacherHome() {
  return (
    <div className="teacherHomeContainer">
      <div className="teacherHomeContent">
        <h1>Teacher Home</h1>
        <HeatMap_Year />
      </div>
    </div>
  );
}
export default TeacherHome;
