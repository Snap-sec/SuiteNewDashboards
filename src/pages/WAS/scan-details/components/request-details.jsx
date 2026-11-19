import { Modal } from '@/components/custom/modal';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import useStore from '../store';
import { CustomTooltip } from '@/components/custom/tooltip';

function RequestInfoModel({ title, data }) {
  const showInfo = useStore((state) => state.showInfo);
  const setShowInfo = useStore((state) => state.setShowInfo);

function convertToRawHttpRequest(requestData) {
    const { method, url, headers, body, params, version } = requestData;

    // Validate URL
    if (!url || typeof url !== 'string') {
        return 'Invalid URL provided';
    }

    let host = '';
    let path = '';

    try {
        // Extract host and path from URL
        const urlObj = new URL(url);
        host = urlObj.host;
        path = urlObj.pathname;
    } catch (error) {
        // If URL is invalid, try to parse it as a path
        path = url;
    }

    // Merge params and version, ensuring version goes last
    const queryEntries = Object.entries(params || {});
    if (version !== undefined) {
        queryEntries.push(['v', version]);
    }
    const query = queryEntries.map(([k, v]) => `${k}=${v}`).join('&');

    // Start building the raw request (add space after version with "GET")
    let rawRequest = `${method.toUpperCase()} ${path}${query ? '?' + query : ''} \nHost: ${host}`;

    // Append headers
    if (headers && Object.keys(headers).length > 0) {
        Object.entries(headers).forEach(([key, value]) => {
            if (key && value) {
                rawRequest += `\n${key}: ${value}`;
            }
        });
    }

    // Append body if present
    if (body) {
        const bodyString =
            typeof body === 'string' ? body : JSON.stringify(body, null, 4);
        rawRequest += `\n\n${bodyString}`;
    }

    return rawRequest;
}

  function formatRawHttpResponse(responseData) {
    const { status, statusText, headers, body } = responseData || {};

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
    // If statusText is missing, use default phrase if possible
    const reasonPhrase = statusText || statusMap[status] || '';

    let rawResponse = `HTTP/1.1 ${status} ${reasonPhrase}`;

    // Add headers
    if (headers && typeof headers === 'object') {
      for (const [key, value] of Object.entries(headers)) {
        rawResponse += `\n${key}: ${value}`;
      }
    }

    // Add body (separated by empty line)
    if (body) {
      rawResponse += `\n\n${typeof body === 'string' ? body : JSON.stringify(body, null, 4)}`;
    }

    return rawResponse;
  }


  return (
    <Modal
        className="w-4/5"
        open={showInfo}
        setOpen={setShowInfo}
        trigger={
          <div>
            <CustomTooltip
              text={`Click to view full request details.`}
            >
              <p className="font-medium text-sm hover:text-primary cursor-pointer">
                  {title.length > 50 ? `${title.substring(0, 50)}...` : title}
              </p>
            </CustomTooltip>
               
          </div>
        }
        title={
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">{title}</div>
            </div>
        }
        >
 
          <div className="grid lg:grid-cols-2 gap-y-5 lg:gap-4 items-stretch">
            <Card className="w-full lg:col-span-1">
              <ScrollArea className="pr-2">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-md font-semibold">
                      Vulnerable http Request
                    </h4>
                  </div>

                  <Separator />

                  <div>
                    <pre className="h-100 max-w-200 kt-scrollable-y-auto text-sm">
                      {convertToRawHttpRequest(data)}
                    </pre>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>

            <Card className="w-full lg:col-span-1">
              <ScrollArea className=" pr-2">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-md font-semibold">Response</h4>
                  </div>

                  <Separator />
                  <div>
                    <pre className="h-100 max-w-200 kt-scrollable-y-auto text-sm">
                      {formatRawHttpResponse(data?.executionResult?.response)}
                    </pre>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
     
    </Modal>
  );
}

export default RequestInfoModel;
