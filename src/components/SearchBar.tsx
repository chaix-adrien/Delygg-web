import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDebounceFn } from "ahooks";

export default function SearchBar(props: {
  yggUrl: string;
  onChange: Function;
}) {
  const [search, setSearch] = useState("");
  const { run } = useDebounceFn(() => props.onChange(search), { wait: 500 });

  useEffect(run, [search, run]);

  return (
    <Input
      isClearable
      type="search"
      value={search}
      className="min-w-56 w-56 flex-grow "
      onValueChange={setSearch}
      variant="bordered"
      placeholder={`Rechercher un torrent${
        props.yggUrl ? ` sur ${props.yggUrl}` : "..."
      }`}
      onClear={() => setSearch("")}
    />
  );
}
