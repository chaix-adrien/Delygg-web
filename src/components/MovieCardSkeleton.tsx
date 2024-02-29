import { Card, CardHeader, CardBody, Divider, Chip } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";

const generateArraySize = (len: number) => Array.from(Array(len).keys());

export default function MovieCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex justify-between w-full">
          <Skeleton className="rounded w-1/3" />
          <div className="flex justify-between gap-2">
            {generateArraySize(3).map((k) => (
              <Skeleton className="rounded" key={k}>
                <Chip>720p</Chip>
              </Skeleton>
            ))}
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="w-full flex justify-start flex-wrap gap-2">
          {generateArraySize(3).map((k) => (
            <Skeleton className="rounded" key={k}>
              <Chip>720p</Chip>
            </Skeleton>
          ))}
          <div className="self-end flex gap-4 ml-auto">
            <Skeleton className="rounded">
              <p className="self-end italic text-sm">3 mois</p>
            </Skeleton>
            <Skeleton className="rounded">
              <p className="self-end font-bold  ">20 go</p>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
