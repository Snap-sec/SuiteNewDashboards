import { Modal } from "@/components/custom/modal";
import { Button } from '@/components/ui/button';
import { File, Plus, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateVmCustomReportConfigMutation, useGetVmAssessmentDetailsQuery } from "@/services/vm/assessmentsApi";
import { toast } from "sonner";
import { useSearchParams } from 'react-router-dom';
import { useCharacterLimit } from '@/hooks/use-character-limit';
import { CustomTooltip } from "@/components/custom/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

function CreateCustomReportModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [params] = useSearchParams();
    const assessmentId = params.get("assessmentId");

    const { data, isLoading: loading } = useGetVmAssessmentDetailsQuery(assessmentId, {
        skip: !isOpen || !assessmentId
    });

    const [payload, setPayload] = useState({
        title: "",
        executiveSummary: "",
        scope: "",
        methodology: "",
        conclusion: "",
        actionPlan: "",
        author: "",
        reviewer: ""
    });

    // character limit hooks
    const { text: title, handleTextChange: handleTitle, remaining: titleLimitRemaining } = useCharacterLimit(75);
    const { text: executiveSummary, handleTextChange: handleExecutiveSummary, remaining: executiveSummaryLimitRemaining } = useCharacterLimit(2600);
    const { text: scope, handleTextChange: handleScope, remaining: scopeLimitRemaining } = useCharacterLimit(1500);
    const { text: methodology, handleTextChange: handleMethodology, remaining: methodologyLimitRemaining } = useCharacterLimit(2000);
    const { text: conclusion, handleTextChange: handleConclusion, remaining: conclusionLimitRemaining } = useCharacterLimit(2000);
    const { text: actionPlan, handleTextChange: handleActionPlan, remaining: actionPlanRemaining } = useCharacterLimit(1000);
    const { text: author, handleTextChange: handleAuthor, remaining: authorLimitRemaining } = useCharacterLimit(100);
    const { text: reviewer, handleTextChange: handleReviewer, remaining: reviewerLimitRemaining } = useCharacterLimit(100);

    useEffect(() => {
        if (data?.data && data?.data?.customReport && isOpen) {
            const report = data.data.customReport;
            handleTitle(report.title || "");
            handleExecutiveSummary(report.executiveSummary?.replace?.(/<br \/>/g, '\n') || "");
            handleScope(Array.isArray(report.scope) ? report.scope.join("\n") : (report.scope || ""));
            handleMethodology(report.methodology?.replace?.(/<br \/>/g, '\n') || "");
            handleConclusion(report.conclusion?.replace?.(/<br \/>/g, '\n') || "");
            handleActionPlan(report.actionPlan?.replace?.(/<br \/>/g, '\n') || "");
            handleAuthor(report.author || "");
            handleReviewer(report.reviewer || "");
        }
    }, [data, isOpen]);

    useEffect(() => {
        setPayload({
            title: title,
            executiveSummary: executiveSummary?.replace?.(/\\n/g, '<br />'),
            scope: Array.isArray(scope) ? scope?.join?.("\n") : scope,
            methodology: methodology?.replace?.(/\\n/g, '<br />'),
            conclusion: conclusion?.replace?.(/\\n/g, '<br />'),
            actionPlan: actionPlan?.replace?.(/\\n/g, '<br />'),
            author: author,
            reviewer: reviewer
        });
    }, [title, executiveSummary, scope, methodology, conclusion, actionPlan, author, reviewer]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name === "title") handleTitle(value);
        else if (name === "executiveSummary") handleExecutiveSummary(value);
        else if (name === "scope") handleScope(value);
        else if (name === "methodology") handleMethodology(value);
        else if (name === "conclusion") handleConclusion(value);
        else if (name === "actionPlan") handleActionPlan(value);
        else if (name === "author") handleAuthor(value);
        else if (name === "reviewer") handleReviewer(value);
    }

    const [createCustomConfig, { isLoading: isSaving }] = useCreateVmCustomReportConfigMutation();

    const handleCreateCustomConfig = async () => {
        try {
            await createCustomConfig({ assessmentId, payload }).unwrap();
            toast.success("Configuration saved");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to save the configuration");
        }
    }

    return (
        <Modal
            open={isOpen}
            setOpen={setIsOpen}
            title="Configure Custom Report"
            description="Customize the content of your vulnerability report."
            trigger={
                <div>
                    <CustomTooltip text="Configure custom report">
                        <Button variant="outline" size="sm">
                            <Settings2 className="w-4 h-4" />
                        </Button>
                    </CustomTooltip>
                </div>
            }
            footer={
                <div className="mt-2">
                    <Button onClick={handleCreateCustomConfig} disabled={isSaving}>
                        <File className="w-4 h-4 mr-2" /> Save Configuration
                    </Button>
                </div>
            }
            className="w-1/2 max-w-4xl"
        >
            {loading ? (
                <div className="flex flex-col gap-3">
                    <Skeleton className="w-full h-[60px]" />
                    <Skeleton className="w-full h-[60px]" />
                    <Skeleton className="w-full h-[150px]" />
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-[13px] font-medium">Report Title ({titleLimitRemaining} remaining)</p>
                            <InputWrapper>
                                <File className="w-4 h-4 text-muted-foreground" />
                                <Input name="title" value={title} type="text" placeholder="Enter Report Title" onChange={handleInput} />
                            </InputWrapper>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[13px] font-medium">Author ({authorLimitRemaining} remaining)</p>
                            <InputWrapper>
                                <File className="w-4 h-4 text-muted-foreground" />
                                <Input name="author" value={author} type="text" placeholder="Enter Author Name" onChange={handleInput} />
                            </InputWrapper>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium">Reviewer ({reviewerLimitRemaining} remaining)</p>
                        <InputWrapper>
                            <File className="w-4 h-4 text-muted-foreground" />
                            <Input name="reviewer" value={reviewer} type="text" placeholder="Enter Reviewer Name" onChange={handleInput} />
                        </InputWrapper>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium">Executive Summary ({executiveSummaryLimitRemaining} remaining)</p>
                        <Textarea name="executiveSummary" value={executiveSummary} rows={4} placeholder="Enter Executive Summary" onChange={handleInput} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium">Custom Scope ({scopeLimitRemaining} remaining)</p>
                        <Textarea name="scope" value={scope} rows={3} placeholder="List Scope Items" onChange={handleInput} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium">Methodology ({methodologyLimitRemaining} remaining)</p>
                        <Textarea name="methodology" value={methodology} rows={3} placeholder="Enter your Methodology" onChange={handleInput} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium">Conclusion ({conclusionLimitRemaining} remaining)</p>
                        <Textarea name="conclusion" value={conclusion} rows={3} placeholder="Enter your conclusion" onChange={handleInput} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium">Action Plan ({actionPlanRemaining} remaining)</p>
                        <Textarea name="actionPlan" value={actionPlan} rows={3} placeholder="Enter your Action Plan" onChange={handleInput} />
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default CreateCustomReportModal;
