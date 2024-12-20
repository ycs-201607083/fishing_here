import React, { useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button.jsx";
import { Text } from "@chakra-ui/react";

export function QuesDeleteButton({ onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      placement={"center"}
      role="alertdialog"
    >
      <DialogTrigger asChild>
        <Button
          colorPalette={"red"}
          variant={"ghost"}
          fontWeight={"bold"}
          size="xs"
        >
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>댓글을 삭제하시겠습니까?</Text>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette={"blue"}>
              <Text fontSize={"18px"}>취소</Text>
            </Button>
          </DialogActionTrigger>
          <Button colorPalette={"red"} variant={"outline"} onClick={onClick}>
            <Text fontSize={"18px"}>삭제</Text>
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
