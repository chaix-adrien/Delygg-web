import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useDebouncedState from "../hooks/useDebouncedState";
import MovieCard from "./MovieCard";
import useFiltersState from "@comp/hooks/useFiltersState";
import Filters from "./Filters";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { MdSearchOff } from "react-icons/md";
import ModalLoading from "./ModalLoading";
import LocalApi from "@comp/apis/Local";
import Deluge from "@comp/apis/Deluge";

const DelugeApi = new Deluge();

export interface Movie {
  name: string;
  link: string;
  size: string;
  date: string;
}

export default function MovieList() {
  const filtersState = useFiltersState();
  const { apiFilters, customFilters, addFilters } = filtersState;
  const [currentDl, setCurrentDl] = useState<boolean>(false);
  const [emptySearch, setEmptySearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [yggUrl, setYggUrl] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [search, debouncedSearch, setSearch] = useDebouncedState("");
  const [activeTorrentsList, setActiveTorrentsList] = useState([]);

  const refreshList = () =>
    LocalApi.getTorrentsList().then(setActiveTorrentsList);
  useEffect(() => {
    setIsLoading(true);
    setEmptySearch(false);
    refreshList();
    LocalApi.search(debouncedSearch, apiFilters).then((searchResult: any) => {
      const { results, baseUrl } = searchResult;

      let resultsFiltered = results.filter((movie: Movie) =>
        customFilters.every(
          ([key, filterValues]) =>
            !filterValues.length || filterValues.includes(movie[key])
        )
      );
      if (!resultsFiltered.length) {
        setEmptySearch(true);
        resultsFiltered = results;
      }
      setResults(resultsFiltered);
      setYggUrl(baseUrl);
      setIsLoading(false);
    });
  }, [debouncedSearch, customFilters, apiFilters]);

  return (
    <div className="flex flex-col gap-2 w-full justify-center">
      <Input
        isClearable
        type="search"
        value={search}
        onValueChange={setSearch}
        variant="bordered"
        placeholder={`Rechercher un torrent${
          yggUrl ? ` sur ${yggUrl}` : "..."
        }`}
        onClear={() => setSearch("")}
      />
      <Filters filtersState={filtersState} />
      {emptySearch && (
        <div className="w-full flex justify-center items-center gap-4 m-4">
          <MdSearchOff className="text-3xl" />
          <p>Empty search, displaying unfiltered results</p>
        </div>
      )}
      {isLoading
        ? Array.from(Array(10).keys()).map((k) => <MovieCardSkeleton key={k} />)
        : results.map((movie) => {
            return (
              <MovieCard
                key={movie.name}
                movie={movie}
                isAlreadyInDl={activeTorrentsList.some((n) =>
                  movie.name.includes(n)
                )}
                onClick={() =>
                  LocalApi.download(movie.link, setCurrentDl).then(refreshList)
                }
                onClickFilter={(key: string, value: any, _, e) => {
                  addFilters(key, value.toString());
                  e.stopPropagation();
                }}
              />
            );
          })}
      <ModalLoading isOpen={currentDl} />
    </div>
  );
}
