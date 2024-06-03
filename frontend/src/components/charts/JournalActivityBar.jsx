import cc from "../../utils/cc";
const cleanPercentage = (percentage) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Circle = ({ colour, pct, shadow }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100;
  return (
    <circle
      className={cc(pct ? "transition-all duration-700 ease-in-out" : "")}
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""} // remove colour as 0% sets full circumference
      strokeWidth={"1.2rem"}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
      filter={shadow ? "url(#shadow)" : ""}
    ></circle>
  );
};

const Text = ({ percentage }) => {
  return (
    <text
      className="fill-textSecondary text-3xl font-semibold"
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

const JournalActivityBar = ({ percentage }) => {
  const pct = cleanPercentage(percentage);
  return (
    <div className="w-full rounded-md flex items-center justify-center  ">
      <svg
        className="w-full h-full"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`rotate(-90 ${"100 100"})`}>
          <Circle colour="rgb(var(--color-bg-gray))" />
          <Circle colour="rgb(var(--color-primary))" pct={pct} />
        </g>
        <Text percentage={pct} />
      </svg>
    </div>
  );
};

export default JournalActivityBar;
