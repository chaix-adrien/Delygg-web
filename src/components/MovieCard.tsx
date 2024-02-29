import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { FullMovie } from "./MoviesList";
import { useBoolean } from "ahooks";
import { Tooltip } from "@nextui-org/react";
import { MouseEventHandler } from "react";

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

export function makeChip(
  key: string,
  value: any,
  isCustom: boolean,
  condition: boolean,
  onClickFilter?: Function,
  deletable?: boolean
) {
  return condition ? (
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
  ) : null;
}

export default function MovieCard(props: {
  movie: FullMovie;
  onClickFilter: Function;
  isAlreadyInDl: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}) {
  const { movie, onClickFilter, onClick, isAlreadyInDl } = props;

  return (
    <Card
      key={movie.name}
      onClick={onClick}
      isHoverable={!isAlreadyInDl}
      isPressable={!isAlreadyInDl}
      className={`w-full  ${
        isAlreadyInDl ? "bg-success-100" : "cursor-pointer"
      }`}
    >
      <CardHeader className="flex gap-3">
        <div className="flex justify-between w-full">
          <Tooltip
            content={movie.name.replace(/\./gm, " ")}
            offset={20}
            color="foreground"
            placement="top-start"
            closeDelay={0}
          >
            <p>
              {movie.title}
              {movie.year ? ` (${movie.year})` : ""}
            </p>
          </Tooltip>
          <div className="flex justify-between gap-2">
            {makeChip(
              "language",
              movie.language,
              true,
              (movie.language && movie.language !== "multi") as boolean,
              onClickFilter
            )}
            {makeChip(
              "season",
              movie.season,
              false,
              Boolean(movie.season),
              onClickFilter
            )}
            {makeChip(
              "episode",
              movie.episode,
              true,
              typeof movie.episode === "number",
              onClickFilter
            )}
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="w-full flex justify-start flex-wrap gap-2">
          {makeChip(
            "resolution",
            movie.resolution,
            true,
            Boolean(movie.resolution),
            onClickFilter
          )}
          {makeChip(
            "source",
            movie.source,
            true,
            Boolean(movie.source),
            onClickFilter
          )}
          {makeChip(
            "audio",
            movie.audio,
            true,
            Boolean(movie.audio),
            onClickFilter
          )}
          <div className="self-end flex gap-4 ml-auto">
            <p className="self-end italic text-sm">{movie.date}</p>
            <p className="self-end font-bold  ">{movie.size}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
