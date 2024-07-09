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

export default function AvgExcerciseTimeChart() {
  const avgEntriesData = [
    {
      date: new Date("2021-01-01").toLocaleDateString("fi-FI"),
      avgExcerciseTime: 4,
    },
    {
      date: new Date("2021-02-01").toLocaleDateString("fi-FI"),
      avgExcerciseTime: 2,
    },
    {
      date: new Date("2021-03-01").toLocaleDateString("fi-FI"),
      avgExcerciseTime: 3,
    },
    {
      date: new Date("2021-04-01").toLocaleDateString("fi-FI"),
      avgExcerciseTime: 5,
    },
    {
      date: new Date("2021-05-01").toLocaleDateString("fi-FI"),
      avgExcerciseTime: 1,
    },
    {
      date: new Date("2021-06-01").toLocaleDateString("fi-FI"),
      avgExcerciseTime: 2,
    },
  ];

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart
          data={avgEntriesData}
          margin={{ top: 0, right: 0, left: -35, bottom: 0 }}
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
            dataKey="avgExcerciseTime"
            name="Uudet Opiskelijat"
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
            dataKey="avgExcerciseTime"
            stroke="rgb(var(--color-primary))"
            activeDot={{ r: 8 }}
            name="Keskimääräinen liikunta-aika (min)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
