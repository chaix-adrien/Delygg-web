import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import useFiltersState from "@comp/hooks/useFiltersState";
import Filters from "./Filters";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { MdSearchOff } from "react-icons/md";
import ModalLoading from "./ModalLoading";
import LocalApi from "@comp/apis/Local";
import { Select, SelectItem } from "@nextui-org/react";
import { SortBy, SortOrder } from "./constants";
import SearchBar from "./SearchBar";
import { unstable_batchedUpdates } from "react-dom";
import ModalActiveTorrent from "./ModalActiveTorrent";

export interface Movie {
  name: string;
  link: string;
  size: string;
  date: string;
  episode: string;
  season: string;
  language: string;
  resolution: string;
  source: string;
  audio: string;
  year: string;
  title: string;
}

export default function MovieList() {
  const filtersState = useFiltersState();
  const { apiFilters, customFilters, addFilters } = filtersState;
  const [search, setSearch] = useState("");
  const [currentDl, setCurrentDl] = useState<boolean>(false);
  const [emptySearch, setEmptySearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [yggUrl, setYggUrl] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [activeTorrentsList, setActiveTorrentsList] = useState([]);
  const [sortBy, setSortBy] = useState({
    sort: ["publish_date"],
    order: ["desc"],
  });

  const refreshList = () =>
    LocalApi.getTorrentsList().then(setActiveTorrentsList);

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setIsLoading(true);
      setEmptySearch(false);
    });
    refreshList();
    LocalApi.search(search, apiFilters, sortBy).then((searchResult: any) => {
      const { results, baseUrl } = searchResult;

      unstable_batchedUpdates(() => {
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
    });
  }, [customFilters, apiFilters, sortBy, search]);

  return (
    <div className="flex flex-col gap-2 w-full justify-center">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <SearchBar yggUrl={yggUrl} onChange={setSearch} />
        <div className="flex items-center w-52 gap-4 flex-grow sm:flex-grow-0">
          <Select
            label="Sort by"
            className="min-w-24 w-24 flex-grow"
            size="sm"
            selectedKeys={sortBy.sort}
            onSelectionChange={(sort) =>
              sort.size > 0 && setSortBy({ ...sortBy, sort: [...sort] })
            }
          >
            {SortBy.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Sort by"
            className="min-w-20 w-20"
            size="sm"
            selectedKeys={sortBy.order}
            renderValue={(items) => items[0].rendered}
            onSelectionChange={(order) =>
              setSortBy({ ...sortBy, order: [...order] })
            }
          >
            {SortOrder.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
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
      <ModalActiveTorrent activeTorrentsList={activeTorrentsList} />
    </div>
  );
}
