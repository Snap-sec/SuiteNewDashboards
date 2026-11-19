import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

function Request({ data }) {
  function convertToRawHttpRequest(requestData = {}) {
    const {
      method = '',
      url = '',
      headers = [],
      body = null,
      params = {},
    } = requestData;

    // Guard: if no url or method, return empty or error string
    if (!url || !method) return '';

    // Extract host and path from URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      return '';
    }
    const host = urlObj.host;
    const path = urlObj.pathname;

    const query = Object.entries(params || {})
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    // Start building the raw request
    let rawRequest = `${method.toUpperCase()} ${path + '?' + query}\nHost: ${host}`;

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

  return (
    <div className="w-full">
      <ScrollArea className="pr-2">
        <CardContent className="p-0 h-[60vh] lg:h-[70vh] kt-scrollable-y-auto">
          <div className="space-y-0">
            <pre className="overflow-auto text-xs sm:text-sm">
              <code className="whitespace-pre-wrap break-all block">
                {convertToRawHttpRequest(data?.transformedRequestSnapshot) ||
                  'N/A'}
              </code>
            </pre>
          </div>
        </CardContent>
      </ScrollArea>
    </div>
  );
}

export default Request;
