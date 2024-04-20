import TeacherHeader from "../../../layouts/teacher-layout/TeacherLayout.jsx";
import trainingService from "../../../services/trainingService.js";
import dayjs from "dayjs";
import HeatMap_Month from "../../../components/HeatMap_Month.jsx";
import HeatMap_Year from "../../../components/HeatMap_Year.jsx";

import { useEffect, useState } from "react";

function TeacherHome() {
  const [data, setData] = useState([]);

  useEffect(() => {
    trainingService.getJournalEntries().then((data) => {
      console.log(data);
      // clean up the data for the heatmap
      const entries = data.map((entry) => {
        const date = dayjs(entry.date).format("YYYY-MM-DD"); // format the date for the heatmap
        let value = entry.length_in_minutes;

        if (entry.entry_type_id === 3) value = -99; // color value for sick day

        return {
          date: date,
          value: value,
          entry_type: entry.entry_type_id,
        };
      });
      setData(entries);
    });
  }, []);

  return (
    <div className="teacherHomeContainer">
      <div className="teacherHomeContent">
        <h1>Teacher Home</h1>
        <HeatMap_Year data={data} />
        <HeatMap_Month data={data} />
      </div>
    </div>
  );
}
export default TeacherHome;
