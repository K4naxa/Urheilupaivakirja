import { useState, useEffect } from "react";
import cc from "../../utils/cc";

const cleanPercentage = (percentage) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Circle = ({ colour, pct }) => {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 2 / 100; // Adjust for half circle
  return (
    <circle
      className={cc(pct ? "transition-all duration-700 ease-in-out" : "")}
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circ / 2 ? colour : ""} // remove colour as 0% sets full circumference
      strokeWidth={"0.4rem"}
      strokeDasharray={`${circ / 2} ${circ / 2}`} // Adjust for half circle
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
      transform="rotate(-180 100 100)" // Rotate to make it a half-circle
    ></circle>
  );
};

const Text = ({ value, REQUIRED_COMPLETION }) => {
  return (
    <>
      <text
        className="fill-textSecondary text-[0.6rem] font-medium"
        x="50%"
        y="65%" // Adjust text position for half circle
        dominantBaseline="central"
        textAnchor="middle"
      >
        Kurssi suoritus
      </text>
      <text
        className="text-lg font-semibold fill-textSecondary"
        x="50%"
        y="80%" // Adjust text position for half circle
        dominantBaseline="central"
        textAnchor="middle"
      >
        {value} / {REQUIRED_COMPLETION}
      </text>
    </>
  );
};

const CourseComplitionBar = ({ value, REQUIRED_COMPLETION }) => {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const percentage = (value / REQUIRED_COMPLETION) * 100;
    const pct = cleanPercentage(percentage);
    setTimeout(() => setAnimatedPct(pct), 100); // Slight delay for smoother animation
  }, [value, REQUIRED_COMPLETION]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 rounded-md max-w-96">
      <svg
        className="w-full h-full"
        viewBox="0 0 200 100" // Adjust viewBox for half circle
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          <Circle colour="rgb(var(--color-bg-gray))" pct={0} />
          {value !== 0 && (
            <Circle colour="rgb(var(--color-primary))" pct={animatedPct} />
          )}
        </g>
        <Text value={value} REQUIRED_COMPLETION={REQUIRED_COMPLETION} />
      </svg>
      <p className="p-2 text-center text-textSecondary">
        Olet suorittanut kurssistasi{" "}
        {((value / REQUIRED_COMPLETION) * 100).toFixed(0)}%
      </p>
    </div>
  );
};

export default CourseComplitionBar;
