import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Editor } from '@/components/custom/Editor/Editor';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const RequestSummary = () => {
  const { control } = useFormContext();

  const editorDefaultText = `   Demo Log (v3.2.0 - July 2025)
    Example Update Details
- ⚒️ Example Re-calibrated the quantum flux capacitor
- 🧿 Example Added dark mode for inter dimensional portals
- 🦎 Example Fixed crash when feeding virtual dragons too quickly
- 🤖 Example Integrated AI assistant that now makes
- 🐞 Example Removed over 1,000 invisible bugs
- 📦 Example Added support for encrypted cat memes in chat`;

  return (
    <Card className="pb-2.5">
      <CardHeader id="change_request_summary">
        <CardTitle>Change Request Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {/* Priority Level Dropdown */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Label className="flex w-full max-w-56">Priority Level <span className="text-destructive px-1"> *</span></Label>
          <div className="grow">
            <FormField
              control={control}
              name="priorityLevel"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-56">Request Title <span className="text-destructive px-1"> *</span></Label>
            <FormField
              control={control}
              name="requestTitle"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input {...field} placeholder="Enter request title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-56">
              Requester Name / Team <span className="text-destructive px-1"> *</span>
            </Label>
            <FormField
              control={control}
              name="requesterNameOrTeam"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input {...field} placeholder="Enter name or team" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-56">
              Contact Email / Phone <span className="text-destructive px-1"> *</span>
            </Label>
            <FormField
              control={control}
              name="contactEmailOrPhone"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input {...field} placeholder="Enter contact email or phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-56">Jira Ticket Id <span className="text-destructive px-1"> *</span></Label>
            <FormField
              control={control}
              name="changeRequestTicketId"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormControl>
                    <Input {...field} placeholder="Enter ticket ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-56">Change Summary <span className="text-destructive px-1"> *</span></Label>
            <FormField
              control={control}
              name="changeSummary"
              render={({ field }) => (
                <FormItem className="grow">
                  <div className="border-2 w-full rounded-lg">
                    <FormControl>
                      <Editor
                        className="w-full h-fit rounded-lg border p-0.5"
                        onChange={field.onChange}
                        readOnly={false}
                        defaultValue={field.value || editorDefaultText}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { RequestSummary };
