import { CategoryDialog } from "@/components/categoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/declare";
import { axiosInstance, reqConfig } from "@/utils/axiosConfig";
import { useCurrUser } from "@/utils/customHook";
import { arrayInReverse } from "@/utils/helpers";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import loader from "@/api/preApiLoader.ts";
import { toast } from "sonner";
import axios, { HttpStatusCode } from "axios";
import log from "loglevel";
import { buttonVariants } from "@/utils/constants";
import { Separator } from "@/components/ui/separator";

const colName: string[] = ["STT", "MÃ DANH MỤC", "TÊN DANH MỤC", "SỐ SẢN PHẨM"];

const CategoryManagement = () => {
  const { currUser } = useCurrUser();
  const categoriesData = useRouteLoaderData("category_management") as
    | Category[]
    | undefined;
  const [existingCategories, setExistingCategories] = useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [searchingInput, setSearchingInput] = useState("");

  const handleAddCategory = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await axiosInstance.post(
        "/categories",
        {
          name: processedName,
        },
        {
          headers: {
            "User-id": currUser?.userID,
          },
          ...reqConfig,
        }
      );

      const categories = await loader.getCategories();
      setExistingCategories(categories);
      toast.success("Thêm thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thêm thất bại: danh mục này đã tồn tại!");
        } else {
          toast.error("Thêm thất bại!");
        }
        log.error(`Response data: ${error.response?.data}`);
        log.error(`Response status: ${error.response?.status})`);
      } else {
        log.error("Unexpected error:", error);
      }
    }
  };

  const handleUpdateCategory = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await axiosInstance.patch(
        `/categories/${selectedCategory?.categoryID}`,
        {
          name: processedName,
        },
        {
          headers: {
            "User-id": currUser?.userID,
          },
          ...reqConfig,
        }
      );

      const categories = await loader.getCategories();
      setExistingCategories(categories);
      setSelectedCategory(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: danh mục này đã tồn tại!");
        } else {
          toast.error("Thay đổi thất bại!");
        }
        log.error(`Response data: ${error.response?.data}`);
        log.error(`Response status: ${error.response?.status})`);
      } else {
        log.error("Unexpected error:", error);
      }
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axiosInstance.delete(
        `/categories/${selectedCategory?.categoryID}`,
        {
          headers: {
            "User-id": currUser?.userID,
          },
          ...reqConfig,
        }
      );
      const categorys = await loader.getCategories();
      setExistingCategories(categorys);
      setSelectedCategory(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      toast.error("Thay đổi thất bại!");
      if (axios.isAxiosError(error)) {
        log.error(`Response data: ${error.response?.data}`);
        log.error(`Response status: ${error.response?.status})`);
      } else {
        log.error("Unexpected error:", error);
      }
    }
  };

  return (
    <section>
      <div className="relative h-[3rem] mt-8 mb-4">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
          onChange={(e) => setSearchingInput(e.target.value)}
        />
      </div>

      {/** Table */}
      <div className="flex gap-4">
        <Card className="rounded-2xl shadow-lg flex-1">
          <CardContent className="flex flex-col p-4">
            {existingCategories && existingCategories.length !== 0 ? (
              <ScrollArea className="relative h-[58vh]">
                <Table>
                  <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
                    <tr>
                      {colName.map((item, key) => {
                        return (
                          <TableHead
                            key={key}
                            className=" text-center text-black font-extrabold text-[1rem]"
                          >
                            {item}
                          </TableHead>
                        );
                      })}
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {arrayInReverse(existingCategories)
                      .filter((cate) =>
                        cate.categoryName
                          .toLowerCase()
                          .includes(searchingInput.toLowerCase())
                      )
                      .map((cate, index) => (
                        <TableRow
                          key={index}
                          className={
                            selectedCategory &&
                            (cate.categoryID === selectedCategory.categoryID
                              ? "bg-theme-softer"
                              : "")
                          }
                          onClick={() => setSelectedCategory(cate)}
                        >
                          <TableCell className="text-center text-base">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {cate.categoryID}
                          </TableCell>
                          <TableCell className="text-center  text-base">
                            {cate.categoryName}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {cate.products}
                          </TableCell>
                        </TableRow>
                      ))}
                    <tr>
                      <td>
                        <Separator />
                      </td>
                    </tr>
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center">
                <img width={500} src="/empty-box.svg" alt="emptyCart" />
                <span className="text-xl font-medium text-slate-500 mb-10">
                  Bạn chưa có danh mục nào!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 contain-content">
            <CategoryDialog
              formTitle="Thêm danh mục mới"
              handleDialogAcceptEvent={handleAddCategory}
            >
              <Button className="" variant="positive">
                <Plus />
              </Button>
            </CategoryDialog>
            {selectedCategory ? (
              <>
                <CategoryDialog
                  formTitle="Sửa thông tin danh mục"
                  category={selectedCategory}
                  handleDialogAcceptEvent={handleUpdateCategory}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </CategoryDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="negative">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ trực tiếp xóa danh mục và không thể
                        hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDeleteCategory()}
                        className={buttonVariants({
                          variant: "negative",
                        })}
                      >
                        Xóa
                      </AlertDialogAction>
                      <AlertDialogCancel className="mt-0">
                        Hủy
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <SquarePen className="mx-4 !mt-6" />
                <Trash2 className="mx-4 !mt-6" />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CategoryManagement;
