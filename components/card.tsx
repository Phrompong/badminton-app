import clsx from "clsx";

interface ICardProps {
  title: string;
  total: number;
  containerStyle?: string;
}

export const Card: React.FC<ICardProps> = ({
  title,
  total,
  containerStyle,
}) => {
  return (
    <div
      className={clsx(
        "gap-4 flex flex-col border border-slate-200 border-2 p-4 rounded-xl w-full h-32 hover:shadow-lg",
        containerStyle,
      )}
    >
      <span className="text-white font-bold">{title}</span>
      <span className="text-xl font-semibold">{total}</span>
    </div>
  );
};

export default Card;
