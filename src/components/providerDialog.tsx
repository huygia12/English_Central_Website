import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { HTMLAttributes, useState } from "react";
import { Provider } from "@/declare";
import { buttonVariants } from "@/utils/helpers";

interface ProviderDialogProps extends HTMLAttributes<HTMLFormElement> {
  provider?: Provider;
  formTitle: string;
  selectedCategoryLastValue?: string;
  // acceptHandler: (name: string) => void;
}

const ProviderDialog: React.FC<ProviderDialogProps> = ({
  className,
  ...props
}) => {
  const [newName, setNewName] = useState(props.provider?.name || "");
  const [isDisable, setIsDisable] = useState(true);

  // const editEvent = () => {
  //   props.acceptHandler && props.acceptHandler(newName);
  // };

  const handleInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevContent = props.selectedCategoryLastValue;
    console.log(prevContent, newName + "new");
    setNewName(e.target.value);
    if (prevContent && prevContent !== e.target.value) {
      console.log("yes");
      setIsDisable(false);
      return;
    }
    setIsDisable(true);
  };

  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.formTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 items-center gap-10">
            <Label htmlFor="name" className="col-span-2 text-right text-lg">
              Nhà phân phối
            </Label>
            <Input
              id="name"
              defaultValue={props.provider?.name ?? ""}
              className="col-span-3"
              onChange={(e) => handleInputEvent(e)}
            />
          </div>
          <DialogFooter>
            <DialogClose
              type="submit"
              disabled={isDisable}
              className={buttonVariants({
                variant: isDisable ? "outline" : "positive",
              })}
              // onClick={() => editEvent()}
            >
              Lưu
            </DialogClose>
            <DialogClose className={buttonVariants({ variant: "negative" })}>
              Hủy
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export { ProviderDialog };