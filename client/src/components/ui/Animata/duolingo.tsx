import { LoadingIcon } from "../Icons/SelectMore";

interface Props {
  title: string;
  handleSubmit: (value: any) => void;
  isLoading: boolean;
}

export default function DuolingoButton({
  title,
  handleSubmit,
  isLoading,
}: Props) {
  return (
    <button
      className="box-border inline-block h-sm transform-gpu cursor-pointer touch-manipulation whitespace-nowrap rounded-lg border-b-4 border-solid border-transparent bg-green-600 px-4 py-2 text-center text-sm font-bold uppercase leading-5 tracking-wider text-white outline-none transition-all duration-200 hover:brightness-110 active:border-b-0 active:border-t-4 active:bg-none disabled:cursor-auto"
      role="button"
      onClick={handleSubmit}
    >
      {isLoading ? <div className="flex items-center justify-center" >{<LoadingIcon />}</div> : <>{title}</>}

      <span className="absolute inset-0 -z-10 rounded-lg border-b-4 border-solid border-transparent bg-green-500" />
    </button>
  );
}
