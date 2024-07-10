import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function NewEntriesCountChart({ chartData }) {
  console.log("chartData", chartData);
  // const avgEntriesData = [
  //   {
  //     date: new Date("2021-01-01").toLocaleDateString("fi-FI"),
  //     journalEntriesCount: 4,
  //   },
  //   {
  //     date: new Date("2021-02-01").toLocaleDateString("fi-FI"),
  //     journalEntriesCount: 2,
  //   },
  //   {
  //     date: new Date("2021-03-01").toLocaleDateString("fi-FI"),
  //     journalEntriesCount: 3,
  //   },
  //   {
  //     date: new Date("2021-04-01").toLocaleDateString("fi-FI"),
  //     journalEntriesCount: 5,
  //   },
  //   {
  //     date: new Date("2021-05-01").toLocaleDateString("fi-FI"),
  //     journalEntriesCount: 1,
  //   },
  //   {
  //     date: new Date("2021-06-01").toLocaleDateString("fi-FI"),
  //     journalEntriesCount: 2,
  //   },
  // ];

  return (
    <div style={{ width: "100%", height: 200 }} className="">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgb(var(--color-border-primary))"
          />
          <XAxis
            dataKey="date"
            stroke="rgb(var(--color-text-secondary))"
            name="Päivämäärä"
          />
          <YAxis
            dataKey="value"
            name="Merkintöjen määrä"
            stroke="rgb(var(--color-text-secondary))"
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.2)" }}
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "none",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
            itemStyle={{ color: "rgba(255,255,255,0.8)" }}
          />

          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgb(var(--color-primary))"
            activeDot={{ r: 8 }}
            name="Merkintöjen määrä"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default NewEntriesCountChart;
