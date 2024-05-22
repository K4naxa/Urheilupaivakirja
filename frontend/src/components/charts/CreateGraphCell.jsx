export default function CreateGraphCell({ value, max, text }) {
  if (value === null || undefined) value = 0;
  if (max === 0 || null || undefined) max = 1;
  const percentage = Math.round((value / max) * 1000) / 10;

  return (
    <div className="flex flex-col w-8 items-center">
      <div
        className={`flex flex-col-reverse h-44 w-full bg-bgSecondary rounded-md`}
      >
        <div
          className={`flex  w-full bg-primaryColor rounded-sm`}
          style={{ height: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-textSecondary text-sm">{percentage}%</p>

      <h4 className="text-textPrimary">{text}</h4>
    </div>
  );
}
