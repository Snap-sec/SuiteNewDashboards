import { useState } from 'react';
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';

import useStore from "../store";


function ConclusionModal({ handleUpdate }) {
    const showConclusionModal = useStore(state => state.showConclusionModal);
    const conclusionOf = useStore(state => state.conclusionOf);
    const conclusion = useStore(state => state.conclusion);
    const setConclusion = useStore(state => state.setConclusion);
    const setShowConclusionModal = useStore(state => state.setShowConclusionModal);

    const rejectionReasons = [
        {
            id: 'false-positive',
            label: 'False Positive',
            description: 'The identified threat is a false positive and does not represent a real security risk.',
        },
        {
            id: 'risk-accepted',
            label: 'Risk Accepted',
            description: 'The organization has evaluated and accepted this risk based on business requirements.',
        },
        {
            id: 'duplicate',
            label: 'Duplicate Finding',
            description: 'This threat has already been reported and is being tracked under another ticket.',
        },
        {
            id: 'compensating-controls',
            label: 'Compensating Controls in Place',
            description: 'Adequate compensating security controls are already implemented to mitigate this threat.',
        },
        {
            id: 'not-applicable',
            label: 'Not Applicable',
            description: 'This threat does not apply to our current environment or configuration.',
        },
        {
            id: 'low-impact',
            label: 'Low Business Impact',
            description: 'The potential impact of this threat is negligible to business operations.',
        },
        {
            id: 'remediation-planned',
            label: 'Remediation Already Planned',
            description: 'Remediation for this threat is already scheduled and will be addressed in upcoming maintenance.',
        },
        {
            id: 'third-party',
            label: 'Third-Party Dependency',
            description: 'This threat is dependent on third-party systems outside of our direct control.',
        },
        {
            id: 'outdated-finding',
            label: 'Outdated Finding',
            description: 'This threat is based on outdated information and is no longer relevant to the current system state.',
        },
        {
            id: 'testing-environment',
            label: 'Testing/Development Environment Only',
            description: 'This threat only affects non-production environments and poses no risk to live systems.',
        }
    ];

    const fixReasons = [
        {
            id: 'software-update',
            label: 'Software Update Applied',
            description: 'Updated the affected software/application to the latest version that addresses this vulnerability.',
        },
        {
            id: 'security-patch',
            label: 'Security Patch Installed',
            description: 'Applied security patches provided by the vendor to resolve this vulnerability.',
        },
        {
            id: 'configuration-change',
            label: 'Configuration Hardening',
            description: 'Modified system/application configuration to eliminate the security weakness.',
        },
        {
            id: 'access-control',
            label: 'Access Control Implementation',
            description: 'Implemented proper access controls and authentication mechanisms to mitigate the threat.',
        },
        {
            id: 'firewall-rules',
            label: 'Network Security Controls',
            description: 'Added firewall rules, network segmentation, or other network-level security controls.',
        },
        {
            id: 'encryption-applied',
            label: 'Encryption Implemented',
            description: 'Applied encryption to data in transit and/or at rest to protect against unauthorized access.',
        },
        {
            id: 'input-validation',
            label: 'Input Validation Added',
            description: 'Implemented proper input validation and sanitization to prevent injection attacks.',
        },
        {
            id: 'monitoring-enabled',
            label: 'Security Monitoring Deployed',
            description: 'Deployed monitoring and alerting systems to detect and respond to potential exploitation.',
        },
        {
            id: 'code-fix',
            label: 'Application Code Fixed',
            description: 'Modified application source code to eliminate the underlying security vulnerability.',
        },
        {
            id: 'service-disabled',
            label: 'Unnecessary Service Disabled',
            description: 'Disabled or removed unnecessary services, features, or components that posed security risks.',
        },
        {
            id: 'certificate-update',
            label: 'Certificate Management',
            description: 'Updated, renewed, or properly configured SSL/TLS certificates and cryptographic settings.',
        },
        {
            id: 'user-training',
            label: 'Security Awareness Training',
            description: 'Conducted security awareness training for users to prevent social engineering attacks.',
        }
    ];

    const handleReasonClick = (reason) => {
        setConclusion(reason.description);
    };

    function getTitle() {
        switch(conclusionOf) {
            case "risk_accepted": return "Risk Acceptance Reason";
            case "rejected": return "Rejection Reason";
            case "fixed": return "About Fix";
            default: return "Conclusion"
        }
    }

    function getDescription() {
        switch(conclusionOf) {
            case "risk_accepted": return "Why is this threat not resolvable?";
            case "rejected": return "Why is this threat being rejected?";
            case "fixed": return "What fix have you deployed for this threat?";
            default: return "Conclusion"
        }
    }

    // Get relevant reasons based on conclusion type
    function getRelevantReasons() {
        switch(conclusionOf) {
            case "fixed":
                return fixReasons;
            case "rejected":
            case "risk_accepted":
                return rejectionReasons;
            default:
                return [];
        }
    }

    function getReasonsTitle() {
        switch(conclusionOf) {
            case "fixed":
                return "Common Fix Types (Click to use):";
            case "rejected":
            case "risk_accepted":
                return "Predefined Reasons (Click to use):";
            default:
                return "Predefined Options (Click to use):";
        }
    }

    const relevantReasons = getRelevantReasons();



    return (
        <Modal
            open={showConclusionModal}
            setOpen={setShowConclusionModal}
            title={getTitle()}
            description={getDescription()}
            className="w-[650px] max-h-[80vh] overflow-y-auto"
            footer={
                <Button onClick={handleUpdate}>Update</Button>
            }>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        {getTitle()}
                    </label>
                    <Textarea 
                        placeholder={"Enter " + getTitle()} 
                        value={conclusion} 
                        onChange={(e) => setConclusion(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                {relevantReasons.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm font-medium">
                            {getReasonsTitle()}
                        </p>
                        
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {relevantReasons.map((reason) => (
                                <div 
                                    key={reason.id} 
                                    className="p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                                    onClick={() => handleReasonClick(reason)}
                                >
                                    <div className="flex flex-col space-y-1">
                                        <h4 className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                            {reason.label}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {reason.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default ConclusionModal;
