import { Chip } from "@nextui-org/react";
import { Movie } from "./MoviesList";

const colorMap = {
  episode: "primary",
  season: "secondary",
  language: "danger",
};
const variantMap = { episode: "flat", season: "flat", language: "flat" };
const boldMap = { episode: true, season: true, language: true };
const sizeMap = { resolution: "sm", source: "sm", audio: "sm" };
const displayMap = {
  episode: (e: number) => (e == 0 ? "FULL" : `E.${e}`),
  season: (s: number) => `S.${s}`,
  source: (s: string) => s?.toUpperCase(),
  language: (l: string) => l?.toUpperCase(),
};

export default function SmartChip(props: {
  key: keyof Movie;
  value: any;
  display?: boolean;
  onClickFilter?: Function;
  deletable?: boolean;
}) {
  const {
    key,
    value,
    display = true,
    onClickFilter = () => null,
    deletable = false,
  } = props;

  if (!display) return null;

  return (
    <Chip
      key={key}
      className="text-small cursor-pointer z-40"
      variant={variantMap[key] || "faded"}
      radius="sm"
      size={sizeMap[key] || "md"}
      classNames={{ closeButton: "opacity-30" }}
      color={colorMap[key] || "default"}
      onClick={(e) => onClickFilter?.(key, value, isCustom, e)}
      onClose={
        deletable ? (e) => onClickFilter?.(key, value, isCustom, e) : undefined
      }
    >
      <p className={boldMap[key] ? "font-bold" : ""}>
        {displayMap[key]?.(value) || value}
      </p>
    </Chip>
  );
}
