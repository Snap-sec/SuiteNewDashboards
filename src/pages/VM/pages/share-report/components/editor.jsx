import Editor from "@/components/custom/Editor";

import appConfig from "@/config/appConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useEffect,useState } from 'react';



function ReportEditor({ ReportDetail, isLoading}) {
    const [showContent, setShowContent] = useState(false);


    const postProcess = (markdown) => {
    // The regex to find legacy image references, capturing the 16-character ID.
    const legacyImageRegex = /\{([a-zA-Z0-9]{16}?)\}/g;

    // The replacer function is called for each match.
    // 'fullMatch' is the entire string that was matched (e.g., "{aBcDeFgHiJkLmNoP}").
    // 'capturedGroup' is the part of the string matched by the parentheses (e.g., "aBcDeFgHiJkLmNoP").
    const replacer = (fullMatch, capturedGroup) => {
        // Here, 'capturedGroup' is our uid.
        const uid = capturedGroup;
        // We'll use a generic name for the alt text, as it's not available in the matched string.
        const name = "image"; 

        return `![${name}](${appConfig.BASE_URL}/csm/uploads/${uid})`;
    };

    // Use the replace() method with the regex and the replacer function.
    const updatedMarkdown = markdown.replace(legacyImageRegex, replacer);

    return updatedMarkdown;
    }



    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isLoading]);



    // process the markdown to remoee the empty fieds
    const processMarkdownContent = (content) => {
        if (!content) return '';
        
        const sections = content.split('##');
        const title = sections[0].trim();
        
        const processedSections = sections.slice(1).map(section => {
        const [sectionTitle, ...content] = section.split('\n');
        const sectionContent = content.join('\n').trim();
        
        // For Description section, only return the content without the header
        if (sectionTitle.trim() === 'Description') {
            return sectionContent;
        }
        
        return sectionContent ? `## ${sectionTitle}\n${sectionContent}` : '';
        }).filter(Boolean); // Remove empty sections
        
        return [title, ...processedSections].join('\n\n').trim();
    };


  // Default markdown content
  const markdownContent = `# ${ReportDetail?.title || ''}

${ReportDetail?.description ? `#### Description\n${ReportDetail?.description}\n` : ''}

${ReportDetail?.stepsToReproduce ? `#### Steps to Reproduce\n${ReportDetail?.stepsToReproduce}\n` : ''}

${Array.isArray(ReportDetail?.references) && ReportDetail?.references.length > 0 ? `## References\n${ReportDetail?.references.join('\n')}\n` : ''}

${ReportDetail?.impact ? `#### Impact\n${ReportDetail?.impact}\n` : ''}

${ReportDetail?.solution ? `#### Solution\n${ReportDetail?.solution}\n` : ''}
`.trim();

  let contentToDisplay = processMarkdownContent(ReportDetail?.fullMarkdownReport) || markdownContent;

  contentToDisplay = postProcess(contentToDisplay);

   if (isLoading || !showContent) {
        return (
            <div className="flex flex-col gap-6 w-full px-[90px] py-[70px]">
              <Skeleton className="h-[50px]"/>

              <Skeleton className="h-[20px]"/>


              <Skeleton className="h-[200px]"/>

              <Skeleton className="h-[40px]"/>

              <Skeleton className="h-[20px]"/>
              <Skeleton className="h-[20px]"/>

              <Skeleton className="h-[150px]"/>

              <Skeleton className="h-[40px]"/>

              <Skeleton className="h-[20px]"/>
            
            </div>
        );
    }


  return (
    <div>
      <Editor
        defaultValue={contentToDisplay}
        readOnly={true}
      />
    </div>
  );
}

export default ReportEditor;
