import React from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Modal } from '@/components/custom/modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Section = ({ title, children }) => (
  <div className="mb-6 last:mb-0">
    <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">{title}</h4>
    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
      {children}
    </div>
  </div>
);

const RequestComparisonModal = ({ data = {}, isOpen, onClose }) => {
  const { copy, copied } = useCopyToClipboard();

  const originalRequest = data?.rawRequest;
  const transformedRequest = data;
  const appliedTransformations = data?.appliedTransformations || [];

  const parseHttpVersion = (rawHttp) => {
    if (!rawHttp) return 'HTTP/1.1';
    const match = rawHttp.match(/HTTP\/[\d.]+/);
    return match ? match[0] : 'HTTP/1.1';
  };

  const getPath = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + (urlObj.search || '');
    } catch {
      return url;
    }
  };

  const getHost = (url) => {
    if (!url) return 'N/A';
    try {
      return new URL(url).host;
    } catch {
      return 'N/A';
    }
  };

  const renderHeaders = (headers) => {
    if (!headers || Object.keys(headers).length === 0) {
      return <div className="text-muted-foreground italic text-sm">No headers</div>;
    }

    return (
      <div className="space-y-2">
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="font-mono text-sm break-all flex gap-3">
            <span className="text-primary font-semibold shrink-0 min-w-[120px]">{key}:</span>
            <span className="text-foreground break-words">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBody = (body) => {
    if (!body) {
      return <div className="text-muted-foreground italic text-sm">No body</div>;
    }

    const content = (() => {
      if (typeof body === 'string') {
        try {
          return JSON.stringify(JSON.parse(body), null, 2);
        } catch {
          return body;
        }
      }
      return JSON.stringify(body, null, 2);
    })();

    return (
      <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-words max-h-[400px] overflow-auto custom-scrollbar">
        {content}
      </pre>
    );
  };

  if (!data) return null;

  return (
    <Modal
      open={isOpen}
      setOpen={onClose}
      title="Request Comparison"
      description={appliedTransformations.length > 0 ? `Applied ${appliedTransformations.length} transformation(s)` : "Detailed request and response information"}
      className="max-w-5xl w-[95vw]"
    >
      <div className="flex flex-col h-[75vh]">
        <Tabs defaultValue="original" className="flex flex-col flex-1 overflow-hidden">
          <div className="px-1 border-b">
            <TabsList variant="line" size="md" className="w-full justify-start gap-6 border-none">
              <TabsTrigger value="original" className="text-sm">Original Request</TabsTrigger>
              <TabsTrigger value="transformed" className="text-sm">Transformed Request</TabsTrigger>
              <TabsTrigger value="response" className="text-sm">Response</TabsTrigger>
              {data.rule?.raw_yaml && <TabsTrigger value="rule" className="text-sm">YAML Rule</TabsTrigger>}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 mt-4">
            <div className="pr-4 pb-6">
              {/* Original Request Tab */}
              <TabsContent value="original" className="mt-0 focus-visible:ring-0">
                <div className="space-y-4">
                  <Section title="Request Line">
                    <div className="font-mono text-sm space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="info" appearance="outline" className="font-bold px-3 py-1">
                          {originalRequest.method}
                        </Badge>
                        <span className="text-foreground font-medium break-all">{getPath(originalRequest.url)}</span>
                        <span className="text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded text-[11px]">{parseHttpVersion(originalRequest.rawHttp)}</span>
                      </div>
                      <div className="text-muted-foreground text-xs pt-3 border-t border-border/50 flex items-center gap-2">
                        <span className="font-bold uppercase text-[10px] tracking-widest text-primary/80">Host:</span>
                        <span className="font-medium break-all">{getHost(originalRequest.url)}</span>
                      </div>
                    </div>
                  </Section>

                  {originalRequest.params && Object.keys(originalRequest.params).length > 0 && (
                    <Section title="Parameters">
                      {renderHeaders(originalRequest.params)}
                    </Section>
                  )}

                  <Section title="Headers">
                    {renderHeaders(originalRequest.headers)}
                  </Section>

                  <Section title="Body">
                    {renderBody(originalRequest.body)}
                  </Section>
                </div>
              </TabsContent>

              {/* Transformed Request Tab */}
              <TabsContent value="transformed" className="mt-0 focus-visible:ring-0">
                <div className="space-y-4">
                  <Section title="Request Line">
                    <div className="font-mono text-sm space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="warning" appearance="outline" className="font-bold px-3 py-1">
                          {transformedRequest?.method}
                        </Badge>
                        <span className="text-foreground font-medium break-all">{getPath(transformedRequest?.url)}</span>
                        <span className="text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded text-[11px]">HTTP/1.1</span>
                      </div>
                      <div className="text-muted-foreground text-xs pt-3 border-t border-border/50 flex items-center gap-2">
                        <span className="font-bold uppercase text-[10px] tracking-widest text-primary/80">Host:</span>
                        <span className="font-medium break-all">{getHost(transformedRequest?.url)}</span>
                      </div>
                    </div>
                  </Section>

                  {transformedRequest?.params && Object.keys(transformedRequest?.params).length > 0 && (
                    <Section title="Parameters">
                      {renderHeaders(transformedRequest?.params)}
                    </Section>
                  )}

                  <Section title="Headers">
                    {renderHeaders(transformedRequest?.headers)}
                  </Section>

                  <Section title="Body">
                    {renderBody(transformedRequest?.body)}
                  </Section>

                  {appliedTransformations.length > 0 && (
                    <Section title="Applied Transformations">
                      <div className="space-y-2">
                        {appliedTransformations.map((transform, idx) => (
                          <div key={idx} className="text-[11px] bg-orange-50/50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                            <code className="text-orange-700 dark:text-orange-300 break-all leading-relaxed font-mono">
                              {typeof transform === 'object' ? JSON.stringify(transform, null, 2) : String(transform)}
                            </code>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}
                </div>
              </TabsContent>

              {/* Response Tab */}
              <TabsContent value="response" className="mt-0 focus-visible:ring-0">
                <div className="space-y-4">
                  {data.response ? (
                    <>
                      <Section title="Status">
                        <div className="font-mono text-sm flex items-center gap-4 flex-wrap">
                          <Badge
                            variant={
                              data.response.status >= 200 && data.response.status < 300 ? 'success' :
                                data.response.status >= 400 ? 'destructive' :
                                  'warning'
                            }
                            appearance="outline"
                            className="px-3 py-1 font-bold text-sm"
                          >
                            {data.response.status} {data.response.statusText}
                          </Badge>
                          {data.response.time && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              {data.response.time}ms
                            </div>
                          )}
                          {data.response.size && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                              {(data.response.size / 1024).toFixed(2)} KB
                            </div>
                          )}
                        </div>
                      </Section>

                      <Section title="Headers">
                        {renderHeaders(data.response.headers)}
                      </Section>

                      <Section title="Body">
                        {renderBody(data.response.body)}
                      </Section>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 border border-dashed border-border rounded-2xl bg-muted/10">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <FileCode className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">No response data available</p>
                      <p className="text-muted-foreground text-xs mt-1">Request might not have been replayed yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* YAML Rule Tab */}
              {data.rule?.raw_yaml && (
                <TabsContent value="rule" className="mt-0 focus-visible:ring-0">
                  <div className="relative group">
                    <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-2 bg-background/90 backdrop-blur-sm border shadow-sm"
                        onClick={() => copy(data.rule.raw_yaml)}
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{copied ? 'Copied' : 'Copy YAML'}</span>
                      </Button>
                    </div>
                    <pre className="font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap break-words min-h-[400px] p-6 rounded-2xl border border-border/50 bg-muted/20 selection:bg-orange-500/20">
                      {data.rule.raw_yaml}
                    </pre>
                  </div>
                </TabsContent>
              )}
            </div>
          </ScrollArea>
        </Tabs>

        <div className="pt-6 mt-2 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rule:</span>
              <span className="font-semibold text-foreground">{data.rule?.rule_name || 'N/A'}</span>
            </div>

            {data.vulnerabilityDetected ? (
              <Badge variant="destructive" appearance="outline" className="px-3 py-1.5 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                Vulnerability Detected
              </Badge>
            ) : (
              <Badge variant="success" appearance="outline" className="px-3 py-1.5">
                No Vulnerability
              </Badge>
            )}
          </div>
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto px-10 h-10 font-bold uppercase tracking-wider text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestComparisonModal;