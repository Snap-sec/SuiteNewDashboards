import { useState } from 'react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateVmCustomReportConfigMutation } from "@/services/vm/assessmentsApi";
import { File } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useCharacterLimit } from '@/hooks/use-character-limit';
import { ja } from '@faker-js/faker';



function CustomReport({ data, loading }) {

    const [params] = useSearchParams();

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

    // character limit for title
    const { text: title, handleTextChange: handleTitle, remaining: titleLimitRemaining } = useCharacterLimit(75);
    const { text: executiveSummary, handleTextChange: handleExecutiveSummary, remaining: executiveSummaryLimitRemaining } = useCharacterLimit(2600);
    const { text: scope, handleTextChange: handleScope, remaining: scopeLimitRemaining } = useCharacterLimit(1500);
    const { text: methodology, handleTextChange: handleMethodology, remaining: methodologyLimitRemaining } = useCharacterLimit(2000);
    const { text: conclusion, handleTextChange: handleConclusion, remaining: conclusionLimitRemaining } = useCharacterLimit(2000);
    const { text: actionPlan, handleTextChange: handleActionPlan, remaining: actionPlanRemaining } = useCharacterLimit(1000);
    const { text: author, handleTextChange: handleAuthor, remaining: authorLimitRemaining } = useCharacterLimit(100);
    const { text: reviewer, handleTextChange: handleReviewer, remaining: reviewerLimitRemaining } = useCharacterLimit(100);

    useEffect(() => {
        if (data && data?.customReport) {
            handleTitle(data?.customReport?.title || "");
            handleExecutiveSummary(data?.customReport?.executiveSummary || "");
            handleScope(data?.customReport?.scope || "");
            handleMethodology(data?.customReport?.methodology || "");
            handleConclusion(data?.customReport?.conclusion || "");
            handleActionPlan(data?.customReport?.actionPlan || "");
            handleAuthor(data?.customReport?.author || "");
            handleReviewer(data?.customReport?.reviewer || "");
            // setPayload({
            //     title: data?.customReport?.title,
            //     executiveSummary: data?.customReport?.executiveSummary,
            //     scope: Array.isArray(data?.customReport?.scope) ? data?.customReport?.scope?.join("\n") : data?.customReport?.scope,
            //     methodology: data?.customReport?.methodology,
            //     conclusion: data?.customReport?.conclusion,
            //     actionPlan: data?.customReport?.actionPlan,
            // });
        }
    }, [data]);



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

        if (name == "title") {
            handleTitle(value);
        }
        else if (name == "executiveSummary") {
            handleExecutiveSummary(value);
        }
        else if (name == "scope") {
            handleScope(value);
        }
        else if (name == "methodology") {
            handleMethodology(value)
        }
        else if (name == "conclusion") {
            handleConclusion(value);
        }
        else if (name == "actionPlan") {
            handleActionPlan(value);
        }
        else if (name == "author") {
            handleAuthor(value);
        }
        else if (name == "reviewer") {
            handleReviewer(value);
        }
    }

    const [createCustomConfig] = useCreateVmCustomReportConfigMutation();


    const handleCreateCustomConfig = () => {
        toast.promise(createCustomConfig({ assessmentId: params.get("assessmentId"), payload }).unwrap(), {
            loading: "Creating custom report configuration",
            success: "Configuration saved",
            error: "Failed to save the configuration"
        });
    }


    if (loading) {
        return (
            <div className="flex flex-col gap-3">
                <Skeleton className="w-full h-[100px]" />
                <Skeleton className="w-full h-[100px]" />
                <Skeleton className="w-full h-[100px]" />
                <Skeleton className="w-full h-[100px]" />
                <Skeleton className="w-full h-[100px]" />
            </div>
        )
    }


    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Report Title ({titleLimitRemaining} remaining)</p>
                <InputWrapper>
                    <File />
                    <Input name="title" value={payload.title} type="text" placeholder="Enter Report Title" onChange={(e) => handleInput(e)} />
                </InputWrapper>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Author ({authorLimitRemaining} remaining)</p>
                <InputWrapper>
                    <File />
                    <Input name="author" value={payload.author} type="text" placeholder="Enter Author Name" onChange={(e) => handleInput(e)} />
                </InputWrapper>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Reviewer ({reviewerLimitRemaining} remaining)</p>
                <InputWrapper>
                    <File />
                    <Input name="reviewer" value={payload.reviewer} type="text" placeholder="Enter Reviewer Name" onChange={(e) => handleInput(e)} />
                </InputWrapper>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Executive Summary ({executiveSummaryLimitRemaining} remaining)</p>
                <Textarea name="executiveSummary" value={payload.executiveSummary} rows={5} placeholder="Enter Executive Summary" onChange={handleInput} />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Custom Scope ({scopeLimitRemaining} remaining)</p>
                <Textarea name="scope" value={payload.scope} rows={5} placeholder="List Scope Items" onChange={handleInput} />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Methodology ({methodologyLimitRemaining} remaining)</p>
                <Textarea name="methodology" value={payload.methodology} rows={5} placeholder="Enter your Methodology" onChange={handleInput} />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Conclusion ({conclusionLimitRemaining} remaining)</p>
                <Textarea name="conclusion" value={payload.conclusion} rows={5} placeholder="Enter your conclusion" onChange={handleInput} />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-[13px]">Action Plan ({actionPlanRemaining} remaining)</p>
                <Textarea name="actionPlan" value={payload.actionPlan} rows={5} placeholder="Enter your Action Plan" onChange={handleInput} />
            </div>


            <div className="w-full flex items-center justify-end">
                <Button onClick={() => handleCreateCustomConfig()}><File /> Save</Button>
            </div>
        </div>
    )
}


export default CustomReport;