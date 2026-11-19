import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/custom/file-upload';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const TechnicalApiDocs = () => {
  const { control } = useFormContext();

  return (
    <Card className="pb-2.5">
      <CardHeader id="technical_api_docs">
        <CardTitle>Technical API Docs</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full items-center gap-1 max-w-56">
              API Docs / Swagger URL <span className="text-destructive"> *</span>
            </Label>
            <FormField
              control={control}
              name="apiDocsOrSwaggerUrl"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/swagger"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=' mt-10'>
            <Label className="flex w-full items-center gap-1 max-w-56 mb-2">
              Upload Files <span className="text-destructive"> *</span>
            </Label>
            <FileUpload
              maxFiles={1}
              maxFileSize={1 * 1024} // 1MB
              variant="compact" // can be "default", "premium", "compact"
              onFilesChange={(files) => console.log(files)} // files -> list of File objects
              acceptedTypes=".csv"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { TechnicalApiDocs };
