import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { MouseEventHandler } from "react";
import { Movie } from "./MoviesList";
import SmartChip from "./SmartChip";

export default function MovieCard(props: {
  movie: Movie;
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
            <SmartChip
              key="language"
              value={movie.language}
              display={Boolean(movie.language && movie.language !== "multi")}
              onClickFilter={onClickFilter}
            />
            <SmartChip
              key="season"
              value={movie.season}
              display={Boolean(movie.season)}
              onClickFilter={onClickFilter}
            />
            <SmartChip
              key="episode"
              value={movie.episode}
              display={typeof movie.episode === "number"}
              onClickFilter={onClickFilter}
            />
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="w-full flex justify-start flex-wrap gap-2">
          <SmartChip
            key="resolution"
            value={movie.resolution}
            display={Boolean(movie.resolution)}
            onClickFilter={onClickFilter}
          />
          <SmartChip
            key="source"
            value={movie.source}
            display={Boolean(movie.source)}
            onClickFilter={onClickFilter}
          />
          <SmartChip
            key="audio"
            value={movie.audio}
            display={Boolean(movie.audio)}
            onClickFilter={onClickFilter}
          />
          <div className="self-end flex gap-4 ml-auto">
            <p className="self-end italic text-sm">{movie.date}</p>
            <p className="self-end font-bold  ">{movie.size}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
