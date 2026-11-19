import { BugPlay } from "lucide-react";
import { FileScan } from "lucide-react";
import { Cloud } from "lucide-react";
import { Blocks } from "lucide-react";
import { ShieldAlert } from "lucide-react";
import { Grid2X2Plus } from "lucide-react";
import { Cable } from "lucide-react";
import { Wifi } from "lucide-react";
import { TabletSmartphone } from "lucide-react";
import { Code } from "lucide-react";
import { Drama } from "lucide-react";
import { Cog } from "lucide-react";
import { Server } from "lucide-react";
import { Container } from "lucide-react";
import { CodeXml } from "lucide-react";
import { LaptopMinimalCheck } from "lucide-react";
import { Binary } from "lucide-react";



const CATEGORIES = [
    "SAST (Static Application Security Testing)",
    "DAST (Dynamic Application Security Testing)",
    "Penetration Testing",
    "SCA (Software Composition Analysis)",
    "IAST (Interactive Application Security Testing)",
    "Secret Scanning",
    "Cloud Security Posture Management (CSPM) Scans",
    "Container Security Scanning",
    "Infrastructure Vulnerability Scanning",
    "API Security Testing",
    "Red Team Exercises",
    "Configuration Audits (CIS Benchmarking)",
    "Attack Surface Management (ASM) Findings",
    "Zero-Day & Threat Intelligence Reporting",
    "Third-Party & Supply Chain Security Assessments",
    "Code Review for Security Issues",
    "Wi-Fi Security Audits",
    "Mobile Application Security Testing",
];



const CATEGORY_TO_ICON = {
    "SAST (Static Application Security Testing)": <Binary />,
    "DAST (Dynamic Application Security Testing)": <BugPlay />,
    "Penetration Testing": <LaptopMinimalCheck />,
    "SCA (Software Composition Analysis)": <FileScan />,
    "IAST (Interactive Application Security Testing)": <CodeXml />,
    "Secret Scanning": <Lock />,
    "Cloud Security Posture Management (CSPM) Scans": <Cloud />,
    "Container Security Scanning": <Container />,
    "Infrastructure Vulnerability Scanning": <Blocks />,
    "API Security Testing": <Server />,
    "Red Team Exercises": <ShieldAlert />,
    "Configuration Audits (CIS Benchmarking)": <Cog />,
    "Attack Surface Management (ASM) Findings": <Grid2X2Plus />,
    "Zero-Day & Threat Intelligence Reporting": <Drama />,
    "Third-Party & Supply Chain Security Assessments": <Cable />,
    "Code Review for Security Issues": <Code />,
    "Wi-Fi Security Audits": <Wifi />,
    "Mobile Application Security Testing": <TabletSmartphone />,
}


export { CATEGORIES, CATEGORY_TO_ICON };