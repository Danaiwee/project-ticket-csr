import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "./ui/form";
import { Input } from "./ui/input";

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  type?: string;
}

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: CustomInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1.5">
          <FormLabel className="font-semibold">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="text-[14px] placeholder:text-[14px] rounded-lg border border-gray-300 text-gray-700 font-semibold placeholder:text-gray-500 placeholder:font-medium h-12"
                type={type}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-[12px] text-red-500 mt-2" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
