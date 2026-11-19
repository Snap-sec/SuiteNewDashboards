import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutGrid, Key, Terminal, Globe, Plug } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import {
  useGetAutomationAdapterListQuery,
  useInstallAutomationAdapterMutation,
} from "@/services/automation/adaptersApi";
import { Button } from "@/components/ui/button";
import { Input, InputWrapper } from "@/components/ui/input";
import { Modal } from "@/components/custom/modal";
import Select from "@/components/custom/select";
import { useStore } from "../../store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const aiProviderSchema = z.object({
  name: z.string().min(1, "Integration Name is required"),
  apiKey: z.string().min(1, "Key is required"),
  endpoint: z.string().optional(),
  model: z.string().optional(),
});

const AI_PROVIDERS = {
  claude: { title: "Anthropic Claude" },
  openai: { title: "OpenAI" },
  gemini: { title: "Google Gemini" },
  deepseek: { title: "DeepSeek" },
  snapiq: { title: "SnapIQ" },
  openrouter: { title: "OpenRouter" },
};

function AiProviders() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(null);

  const { data: supportedData } = useGetAutomationAdapterListQuery();
  const [installAdapter] = useInstallAutomationAdapterMutation();

  const adaptersList =
    supportedData?.data?.data?.adapters ||
    supportedData?.data?.adapters ||
    [];

  const matchedAdapter =
    showInstallModal?.adapter ||
    adaptersList.find((a) => a.type === currentProvider);

  const availableModels = matchedAdapter?.models || [];

  const form = useForm({
    resolver: zodResolver(aiProviderSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      apiKey: "",
      endpoint: "",
      model: "",
    },
  });

  useEffect(() => {
    let { type, adapter } = showInstallModal;
    if (type && AI_PROVIDERS[type]) {
      setCurrentProvider(type);
      setIsInstallOpen(true);
      const matched = adapter || adaptersList.find((a) => a.type === type);
      const defaultModel = matched?.models?.[0]?.value || "";
      form.reset({
        name: "",
        apiKey: "",
        endpoint: "",
        model: defaultModel,
      });
    } else {
      setIsInstallOpen(false);
      setCurrentProvider(null);
    }
  }, [showInstallModal, form, adaptersList]);

  useEffect(() => {
    if (isInstallOpen && availableModels.length > 0 && !form.getValues("model")) {
      form.setValue("model", availableModels[0]?.value);
    }
  }, [isInstallOpen, availableModels, form]);

  const handleInstallClose = () => {
    setIsInstallOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    if (currentProvider === "snapiq" && !data.endpoint?.trim()) {
      form.setError("endpoint", { message: "Endpoint URL is required for SnapIQ" });
      return;
    }

    const payloadData = {
      name: data.name,
      apiKey: data.apiKey,
    };

    if (data.model) {
      payloadData.model = data.model;
    }

    if (currentProvider === "snapiq") {
      payloadData.masterKey = data.apiKey;
      payloadData.endpoint = data.endpoint.trim();
    }

    const finalPayload = {
      adapterType: currentProvider,
      data: payloadData
    };

    const providerTitle = AI_PROVIDERS[currentProvider]?.title;

    toast.promise(installAdapter(finalPayload).unwrap(), {
      loading: `Installing ${providerTitle}...`,
      success: () => {
        handleInstallClose();
        return `${providerTitle} has been installed`;
      },
      error: `Failed to install ${providerTitle}`,
    });
  };

  if (!currentProvider) return null;

  const providerTitle = AI_PROVIDERS[currentProvider]?.title;
  const isSnapIQ = currentProvider === "snapiq";

  return (
    <Modal
      open={isInstallOpen}
      setOpen={handleInstallClose}
      title={`Integrate ${providerTitle}`}
      description={isSnapIQ ? "Connect your self-hosted LiteLLM inference gateway." : `Connect and configure ${providerTitle} models.`}
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleInstall)}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <Plug /> Integrate
        </Button>
      }
    >
      <Form {...form}>
        <form style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="fakeUsernameToBypassAutofill" autoComplete="username" />
          <input type="password" name="fakePasswordToBypassAutofill" autoComplete="current-password" />
        </form>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Integration Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.name ? "border-destructive" : ""
                    }
                  >
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <LayoutGrid />
                    </Button>
                    <Input
                      placeholder={isSnapIQ ? "e.g. SnapIQ Deployment" : "Enter integration name"}
                      autoComplete="off"
                      data-1p-ignore="true"
                      data-lpignore="true"
                      {...field}
                    />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {availableModels.length > 0 && (
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      options={availableModels}
                      placeholder="Select model"
                      onChange={(option) =>
                        field.onChange(option?.value || option || "")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isSnapIQ && (
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Inference Endpoint URL <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <InputWrapper
                      className={
                        form.formState.errors.endpoint ? "border-destructive" : ""
                      }
                    >
                      <Button
                        size="sm"
                        variant="dim"
                        mode="icon"
                        className="size-5 -ms-0.5"
                        type="button"
                      >
                        <Globe />
                      </Button>
                      <Input
                        placeholder="http://litellm-gateway:4000 or https://inference.internal/v1"
                        autoComplete="off"
                        data-1p-ignore="true"
                        data-lpignore="true"
                        {...field}
                      />
                    </InputWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isSnapIQ ? "Master Key" : "API Key"} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.apiKey ? "border-destructive" : ""
                    }
                  >
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <Key />
                    </Button>
                    <Input
                      type="password"
                      placeholder={isSnapIQ ? "Enter LiteLLM Master Key (sk-...)" : "Enter API key"}
                      autoComplete="new-password"
                      data-1p-ignore="true"
                      data-lpignore="true"
                      {...field}
                    />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
}

export default AiProviders;
