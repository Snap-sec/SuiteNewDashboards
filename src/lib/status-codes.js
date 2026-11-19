export const HTTP_STATUS_CODES = {
    // 1xx — Informational
    100: { name: "Continue", variant: "info" },
    101: { name: "Switching Protocols", variant: "info" },
    102: { name: "Processing", variant: "info" },
    103: { name: "Early Hints", variant: "info" },

    // 2xx — Success
    200: { name: "OK", variant: "success" },
    201: { name: "Created", variant: "success" },
    202: { name: "Accepted", variant: "success" },
    203: { name: "Non-Authoritative Information", variant: "success" },
    204: { name: "No Content", variant: "success" },
    205: { name: "Reset Content", variant: "success" },
    206: { name: "Partial Content", variant: "success" },
    207: { name: "Multi-Status", variant: "success" },
    208: { name: "Already Reported", variant: "success" },
    226: { name: "IM Used", variant: "success" },

    // 3xx — Redirect
    300: { name: "Multiple Choices", variant: "warning" },
    301: { name: "Moved Permanently", variant: "warning" },
    302: { name: "Found", variant: "warning" },
    303: { name: "See Other", variant: "warning" },
    304: { name: "Not Modified", variant: "warning" },
    305: { name: "Use Proxy", variant: "warning" },
    307: { name: "Temporary Redirect", variant: "warning" },
    308: { name: "Permanent Redirect", variant: "warning" },

    // 4xx — Client Error
    400: { name: "Bad Request", variant: "destructive" },
    401: { name: "Unauthorized", variant: "destructive" },
    402: { name: "Payment Required", variant: "destructive" },
    403: { name: "Forbidden", variant: "destructive" },
    404: { name: "Not Found", variant: "destructive" },
    405: { name: "Method Not Allowed", variant: "destructive" },
    406: { name: "Not Acceptable", variant: "destructive" },
    407: { name: "Proxy Authentication Required", variant: "destructive" },
    408: { name: "Request Timeout", variant: "destructive" },
    409: { name: "Conflict", variant: "destructive" },
    410: { name: "Gone", variant: "destructive" },
    411: { name: "Length Required", variant: "destructive" },
    412: { name: "Precondition Failed", variant: "destructive" },
    413: { name: "Payload Too Large", variant: "destructive" },
    414: { name: "URI Too Long", variant: "destructive" },
    415: { name: "Unsupported Media Type", variant: "destructive" },
    416: { name: "Range Not Satisfiable", variant: "destructive" },
    417: { name: "Expectation Failed", variant: "destructive" },
    418: { name: "I'm a teapot", variant: "destructive" },
    421: { name: "Misdirected Request", variant: "destructive" },
    422: { name: "Unprocessable Entity", variant: "destructive" },
    423: { name: "Locked", variant: "destructive" },
    424: { name: "Failed Dependency", variant: "destructive" },
    425: { name: "Too Early", variant: "destructive" },
    426: { name: "Upgrade Required", variant: "destructive" },
    428: { name: "Precondition Required", variant: "destructive" },
    429: { name: "Too Many Requests", variant: "destructive" },
    431: { name: "Request Header Fields Too Large", variant: "destructive" },
    451: { name: "Unavailable For Legal Reasons", variant: "destructive" },

    // 5xx — Server Error
    500: { name: "Internal Server Error", variant: "destructive" },
    501: { name: "Not Implemented", variant: "destructive" },
    502: { name: "Bad Gateway", variant: "destructive" },
    503: { name: "Service Unavailable", variant: "destructive" },
    504: { name: "Gateway Timeout", variant: "destructive" },
    505: { name: "HTTP Version Not Supported", variant: "destructive" },
    506: { name: "Variant Also Negotiates", variant: "destructive" },
    507: { name: "Insufficient Storage", variant: "destructive" },
    508: { name: "Loop Detected", variant: "destructive" },
    510: { name: "Not Extended", variant: "destructive" },
    511: { name: "Network Authentication Required", variant: "destructive" },
};

export const getStatusInfo = (code) => {
    return HTTP_STATUS_CODES[Number(code)] || { name: "", variant: "default" };
};
