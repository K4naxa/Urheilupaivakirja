import { AiOutlineLoading } from "react-icons/ai";
export default function LoadingScreen() {
  return (
    <div className="flex h-full w-full justify-center align-middle text-xl">
      <div className="p-10 flex gap-8 text-textSecondary">
        Ladataan..{" "}
        <p className="grid place-items-center animate-spin text-2xl text-headerPrimary">
          <AiOutlineLoading />
        </p>
      </div>
    </div>
  );
}
