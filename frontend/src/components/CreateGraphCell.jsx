export default function CreateGraphCell({ value, max, text }) {
  if (value === null || undefined) value = 0;
  if (max === 0 || null || undefined) max = 1;
  const percentage = Math.round((value / max) * 1000) / 10;

  return (
    <div className="flex flex-col w-full">
      <h4 className="text-textPrimary">{text}</h4>
      <p className="text-textSecondary text-sm">{percentage}%</p>
      <div className={`flex h-1 w-full bg-graphSecondary rounded-sm`}>
        <div
          className={`flex h-full bg-graphPrimary rounded-sm`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
