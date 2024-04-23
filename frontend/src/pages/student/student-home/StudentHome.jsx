import { useMainContext } from "../../../hooks/mainContext";

function StudentHome() {
  const { theme } = useMainContext();
  console.log(theme);
  return (
    <div className={`bg-primary-${theme}`}>
      <h1>Student Home</h1>
    </div>
  );
}

export default StudentHome;
