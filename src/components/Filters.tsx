import { Select, SelectItem, Tabs, Tab } from "@nextui-org/react";
import { Categories, SubCategories } from "./constants";
import { FiltersArray } from "@comp/hooks/useFiltersState";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { BsPenFill } from "react-icons/bs";
import { useState } from "react";
import SmartChip from "./SmartChip";

export default function Filters(props: { filtersState: any }) {
  const {
    filters,
    apiFilters,
    customFilters,
    category,
    subCat,
    setFilters,
    removeFilters,
  } = props.filtersState;
  const [selectedKeys, setSelectedKeys] = useState(new Set(["1"]));
  const activeFilters = [...apiFilters, ...customFilters].filter(
    ([k]) => !["category", "subCat"].includes(k)
  );

  return (
    <div className="flex flex-col gap-2 justify-center w-full mb-4">
      <div className="flex w-full justify-center overflow-auto no-scrollbar">
        <Tabs
          size="md"
          selectedKey={category}
          onSelectionChange={(v) => setFilters("category", v as string)}
          classNames={{ base: "w-full", tabList: "w-full" }}
        >
          {Object.entries(Categories).map(([key, value]) => (
            <Tab key={value} title={key} className="flex flex-grow" />
          ))}
        </Tabs>
      </div>
      {category !== "all" && (
        <div className="flex w-full justify-center overflow-auto no-scrollbar">
          <Tabs
            size="sm"
            selectedKey={subCat}
            classNames={{ base: "w-full", tabList: "w-full" }}
            onSelectionChange={(v) => setFilters("subCat", v as string)}
          >
            {Object.entries(SubCategories[category]).map(([key, value]) => (
              <Tab key={value} title={key} />
            ))}
          </Tabs>
        </div>
      )}
      <Accordion
        variant="shadow"
        className="flex flex-col gap-2 justify-center w-full"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <AccordionItem
          key="filters"
          aria-label="Anchor"
          indicator={<BsPenFill />}
          startContent={
            <div className="flex gap-2 items-center">
              {activeFilters.length ? (
                activeFilters
                  .map(([key, values]) =>
                    values.map((value: string) => (
                      <SmartChip
                        key={key}
                        value={value}
                        onClickFilter={() => {
                          removeFilters(key, value);
                          setSelectedKeys(new Set());
                        }}
                      />
                    ))
                  )
                  .flat()
              ) : (
                <p className="text-gray-400 italic">Add filters...</p>
              )}
            </div>
          }
        >
          <div className="flex gap-2 flex-wrap justify-between mb-2">
            {FiltersArray.filter((f) => f.label).map((filter) => (
              <Select
                isMultiline
                key={filter.key}
                label={filter.label}
                selectionMode="multiple"
                labelPlacement="inside"
                classNames={{
                  base: "w-24 flex-grow ",
                  trigger: "py-2",
                  selectorIcon: "absolute top-3 right-3",
                  label: "font-bold text-md min-h-unit-8",
                }}
                selectedKeys={filters.get(filter.key)}
                onSelectionChange={(values) =>
                  setFilters(filter.key, ...values)
                }
                renderValue={(items) => (
                  <div className="flex flex-wrap gap-1">
                    {items.map((item) => (
                      <SmartChip key={filter} value={item.key} />
                    ))}
                  </div>
                )}
              >
                {filter.items.map((filterValue) => (
                  <SelectItem
                    key={filterValue}
                    value={filterValue}
                    textValue={filterValue}
                  >
                    {filterValue}
                  </SelectItem>
                ))}
              </Select>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
