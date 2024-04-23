import { useMainContext } from "../../../hooks/mainContext";

function StudentHome() {
  const { theme } = useMainContext();
  console.log(theme);
  return (
    <div
      className={`bg-primary-${theme} flex justify-center text-primary-${theme}`}
    >
      <h1>Student Home</h1>
    </div>
  );
}

export default StudentHome;
