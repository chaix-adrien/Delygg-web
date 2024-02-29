import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

export default function ModalLoading(props: { isOpen: boolean }) {
  return (
    <Modal
      isOpen={props.isOpen}
      backdrop="blur"
      hideCloseButton
      isDismissable={false}
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Adding torrent...
            </ModalHeader>
            <ModalBody>
              <div className="flex w-full justify-center mb-4">
                <CircularProgress size="lg" aria-label="Loading..." />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
