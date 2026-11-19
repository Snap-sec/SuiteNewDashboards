
import Editor from "@/components/custom/Editor";
import { useStore } from "../../store";
import { Modal } from '@/components/custom/modal';
import { useState, useEffect } from "react";


const manualVulnerabilitySubmissionDocs = `### 📌 Endpoint: \`POST /assessments/{id}/vuln\`
---
### 📝 Description:
This endpoint allows you to manually report a new vulnerability against a specific assessment. It supports adding affected assets, CVSS score, CWE ID, and metadata. When submitted with the \`manual: true\` flag, this triggers manual submission-specific notifications and workflows (e.g., notifying admins via email).

Use this route when vulnerabilities are identified outside automated scans—such as through bug bounty programs, security audits, or external submissions.

### ⚙️ Manual Usage (via Postman, curl, etc.)
**Request Example:**
\`\`\`http
POST /assessments/60c72b2f5f1b2c6d88f0a7e2/vuln
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "Reflected XSS in search endpoint",
  "cwe": "CWE-79",
  "cvssScore": 6.1,
  "manual": true,
  "reportOriginEmail": "researcher@example.com",
  "affectedAssets": {
    "0": {
      "assetName": "app.snapsec.co",
      "vulnerableLocation": "/search?q=<script>alert(1)</script>"
    },
    "1": {
      "assetName": "api.snapsec.co",
      "vulnerableLocation": "/v1/query"
    }
  }
}
\`\`\`

---
### 🧾 Key Fields Explained:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`title\` | string | ✅ | The name or summary of the vulnerability. |
| \`cwe\` | string | ❌ | CWE identifier (e.g., "CWE-79" for XSS). |
| \`cvssScore\`| float | ❌ | Severity score based on CVSS (0–10). |
| \`manual\` | boolean | ❌ | Set to \`true\` for manual submission (triggers different notification). |
| \`reportOriginEmail\` | string | ❌ | Email of the submitter (to send acknowledgment). |
| \`affectedAssets\` | object | ✅ | Keyed object of affected assets. Each must include \`assetName\` and \`vulnerableLocation\`. |

---
### ✅ Success Response:

\`\`\`json
{
  "status": "1",
  "message": "Vuln add Success.",
  "data": {
    "_id": "60c9...e123",
    "title": "Reflected XSS in search endpoint"
  }
}
\`\`\`

### ⚠️ Validation Failures:

* If the \`title\` is missing, a 400 response with validation errors will be returned.
* If the assessment is locked (e.g., for “VDP Reports”), submission will be rejected.

### 🔔 What Happens Internally on Manual Submission:

* A vulnerability is stored and linked to the assessment.
* A notification is generated and sent to all collaborators with the role \`Admin\`.
* If \`reportOriginEmail\` is provided, an acknowledgment email is sent.
* The vulnerability is automatically assigned (if a related asset owner exists).
`;


function Manual() {

    const [isOpen, setIsOpen] = useState(false);
    const { showInstallModal, setShowInstallModal } = useStore();

    useEffect(() => {
        let { type, slug } = showInstallModal;

        if (type == "adapter" && slug == "manual") setIsOpen(true);
        else setIsOpen(false);

    }, [showInstallModal]);


    return (
        <Modal
            open={isOpen}
            setOpen={setIsOpen}
            title="Guide for Manual Imports"
            description="Import Vulnerabilities into VM"
            className="w-3/4"
        >
            <div className="h-[80vh] overflow-y-scroll">
                <Editor
                    className="w-full"
                    readOnly={true}
                    defaultValue={manualVulnerabilitySubmissionDocs}
                />
            </div>
        </Modal>
    )
}

export default Manual