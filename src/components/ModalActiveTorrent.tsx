import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { FaListUl } from "react-icons/fa6";
export default function ModalActiveTorrent(props: {
  activeTorrentsList: string[];
}) {
  const { activeTorrentsList } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky bottom-0 left-11 w-full flex justify-end">
      {activeTorrentsList.length > 0 && (
        <Button
          isIconOnly
          onClick={() => setIsOpen(true)}
          color="default"
          className="absolute -right-11 bottom-4 drop-shadow-md opacity-50 hover:opacity-100"
        >
          <FaListUl />
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        backdrop="opaque"
        placement="top-center"
        size="2xl"
        onClose={() => setIsOpen(false)}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Active torrents
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full m-4 flex-col justify-start mb-4">
                  {activeTorrentsList.map((name) => (
                    <p className="list-item" key={name}>
                      {name.replace(/\./g, " ")}
                    </p>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
