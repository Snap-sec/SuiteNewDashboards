
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Request from './request';
import YamlRule from './yaml-rule';
import BasicInfo from './basic-info';


function HighlightText({ text, highlight }) {
    if (!highlight || !text) return text;
    const exactStrings = [];
    if (highlight.status) exactStrings.push(String(highlight.status));
    if (highlight.body) exactStrings.push(String(highlight.body));
    if (highlight.header) {
        if (typeof highlight.header === 'object') {
            Object.values(highlight.header).forEach((h) => exactStrings.push(String(h)));
        } else if (typeof highlight.header === 'string') {
            exactStrings.push(String(highlight.header));
        }
    }

    if (exactStrings.length === 0) return text;

    const compiledRegexes = [];

    exactStrings.forEach((str) => {
        if (!str) return;
        try {
            // Escape the exact matched string so it's treated as a literal in RegExp
            const escaped = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            compiledRegexes.push(new RegExp(escaped, 'gi'));
        } catch (e) {
            console.warn('[HighlightText] Failed compiling regex:', str, e);
        }
    });

    if (compiledRegexes.length === 0) return text;

    // Find all matches with runaway-loop protection
    let matches = [];
    compiledRegexes.forEach((re) => {
        let match;
        re.lastIndex = 0;
        let iterations = 0;
        const maxIterations = text.length + 100; // emergency break for empty-matches

        while ((match = re.exec(text)) !== null) {
            if (iterations++ > maxIterations) {
                console.warn('[HighlightText] Aborted potential runaway regex execution');
                break;
            }

            const matchedText = match[0];
            if (matchedText.length === 0) {
                if (re.lastIndex === match.index) re.lastIndex++;
                continue;
            }
            matches.push({ start: match.index, end: match.index + matchedText.length });
        }
    });

    if (matches.length === 0) return text;

    // Merge overlapping matches
    matches.sort((a, b) => a.start - b.start);
    const merged = [];
    if (matches.length > 0) {
        let current = matches[0];
        for (let i = 1; i < matches.length; i++) {
            if (matches[i].start <= current.end) {
                current.end = Math.max(current.end, matches[i].end);
            } else {
                merged.push(current);
                current = matches[i];
            }
        }
        merged.push(current);
    }

    // Build JSX
    const result = [];
    let lastIndex = 0;
    merged.forEach((m, i) => {
        result.push(text.substring(lastIndex, m.start));
        result.push(
            <span key={i} className="bg-yellow-500/30 text-inherit rounded-sm px-0.5 border border-yellow-500/20">
                {text.substring(m.start, m.end)}
            </span>
        );
        lastIndex = m.end;
    });
    result.push(text.substring(lastIndex));

    return result;
}

function formatRawHttpResponse(responseData = {}) {
    const {
        status = 200,
        statusText = '',
        headers = {},
        body = '',
    } = responseData;

    // Map common HTTP status codes to default reason phrases
    const statusMap = {
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        204: 'No Content',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
    };
    const reasonPhrase = statusText || statusMap[status] || '';

    let reason = `HTTP/1.1 ${status} ${reasonPhrase}`;
    let rheaders = ''
    let rbody = ''

    // Add headers
    if (headers && typeof headers === 'object') {
        for (const [key, value] of Object.entries(headers)) {
            rheaders += `\n${key}: ${value}`;
        }
    }

    // Add body (separated by empty line)
    if (body) {
        rbody += `\n\n${typeof body === 'string' ? body : JSON.stringify(body, null, 4)}`;
    }

    return { reason, rheaders, rbody };
}


function Response({ data }) {

    return (
        <>

            <Tabs defaultValue="Basicinfo">

                <Card className="h-full border-none shadow-none">
                    <CardContent className="p-0">
                        <div className="px-4 pb-0">
                            <TabsList
                                variant="line"
                                size="sm"
                                className="border-b w-full sticky top-0 z-10 bg-background"
                            >
                                <TabsTrigger value="Basicinfo" className="text-xs sm:text-sm">
                                    Basic Info
                                </TabsTrigger>

                                <TabsTrigger value="Response" className="text-xs sm:text-sm">
                                    Response
                                </TabsTrigger>

                                <TabsTrigger value="Requests" className="text-xs sm:text-sm">
                                    Requests
                                </TabsTrigger>

                                <TabsTrigger value="Yamlrule" className="text-xs sm:text-sm">
                                    Yaml Rule
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* <Separator /> */}

                        <div className='p-4'>
                            <TabsContent value="Basicinfo">
                                <BasicInfo data={data} />
                            </TabsContent>
                            <TabsContent value="Response">
                                <div className="px-1 pb-1">
                                    <pre className="h-[60vh] lg:h-[70vh]  kt-scrollable-auto text-xs sm:text-sm whitespace-pre-wrap break-words">
                                        {(() => {
                                            const raw = formatRawHttpResponse(data?.evidence?.response);
                                            const highlight = data?.highlight || data?.evidence?.highlight;
                                            return (
                                                <>
                                                    <HighlightText text={raw.reason} highlight={highlight} />
                                                    <HighlightText text={raw.rheaders} highlight={highlight} />
                                                    <HighlightText text={raw.rbody} highlight={highlight} />
                                                </>
                                            );
                                        })()}
                                    </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="Requests">
                                <Request data={data} />
                            </TabsContent>

                            <TabsContent value="Yamlrule">
                                <YamlRule data={data} />
                            </TabsContent>
                        </div>
                    </CardContent>
                </Card>
            </Tabs>
        </>

    )
}

export default Response;
