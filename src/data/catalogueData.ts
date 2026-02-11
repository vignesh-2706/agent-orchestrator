export type CategoryType = "monitoring" | "security" | "build";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
}

export interface Category {
  id: CategoryType;
  label: string;
  scenarios: Scenario[];
}

export const categories: Category[] = [
  {
    id: "monitoring",
    label: "Monitoring",
    scenarios: [
      { id: "m1", name: "Healing", description: "Automated self-healing workflows for infrastructure issues", category: "monitoring" },
      { id: "m2", name: "Anomaly Detection", description: "AI-driven anomaly detection and alerting", category: "monitoring" },
      { id: "m3", name: "Splunk Alerts", description: "Log analysis and anomaly detection", category: "monitoring" },
    ],
  },
  {
    id: "security",
    label: "Security",
    scenarios: [
      { id: "s1", name: "Automated Regular Tracking", description: "Continuous compliance and security posture tracking", category: "security" },
    ],
  },
  {
    id: "build",
    label: "Build",
    scenarios: [
      { id: "b1", name: "Capacity", description: "Infrastructure scaling automation", category: "build" },
      { id: "b2", name: "Cost", description: "Cloud cost optimization workflows", category: "build" },
      { id: "b3", name: "Extension", description: "Platform extension deployment", category: "build" },
    ],
  },
];

// Agentic flow steps
export interface FlowStep {
  id: string;
  title: string;
  description: string;
  tools: string[];
}

export const agenticFlowSteps: FlowStep[] = [
  {
    id: "step1",
    title: "Input the Trigger",
    description: "Receive and validate the incoming trigger event",
    tools: ["API Gateway", "ServiceNow", "Manual Trigger"],
  },
  {
    id: "step2",
    title: "Identifying the affected host through Cosmos",
    description: "Query Cosmos DB to identify affected infrastructure",
    tools: ["Azure Cosmos DB", "CMDB", "Internal Inventory Service"],
  },
  {
    id: "step3",
    title: "Understand the issue by Splunk",
    description: "Analyze logs and metrics to diagnose the root cause",
    tools: ["Splunk Logs", "Log Analytics", "Metrics Dashboard"],
  },
  {
    id: "step4",
    title: "Remediation using tools",
    description: "Execute remediation actions (e.g., Thread Dump, Restart)",
    tools: ["Thread Dump", "Restart Service", "Clear Cache", "Scale Pod", "Rollback Deployment"],
  },
  {
    id: "step5",
    title: "Summarize the steps",
    description: "Generate incident summary and notify stakeholders",
    tools: ["AI Summary Engine", "Incident Report Generator", "Email Notification Service"],
  },
];

export interface PlaybookSection {
  title: string;
  items: string[];
}

export const defaultPlaybook: PlaybookSection[] = [
  { title: "Input Trigger", items: ["API Gateway", "ServiceNow", "Manual Trigger"] },
  { title: "Identify Host (Cosmos)", items: ["Azure Cosmos DB", "CMDB", "Internal Inventory Service"] },
  { title: "Understand Issue (Splunk)", items: ["Splunk Logs", "Log Analytics", "Metrics Dashboard"] },
  { title: "Remediation", items: ["Thread Dump", "Restart Service", "Clear Cache", "Scale Pod", "Rollback Deployment"] },
  { title: "Summarization", items: ["AI Summary Engine", "Incident Report Generator", "Email Notification Service"] },
];

export type ExecutionStatus = "running" | "waiting" | "completed" | "failed";

export interface Execution {
  id: string;
  name: string;
  category: CategoryType;
  status: ExecutionStatus;
  startTime?: string;
  endTime?: string;
  expectedTime?: string;
  scenarioId?: string;
}

export const runningExecutions: Execution[] = [
  { id: "e1", name: "Healing", category: "monitoring", status: "running", startTime: "14:32:00" },
  { id: "e2", name: "Automated Regular Tracking", category: "security", status: "waiting", expectedTime: "~5 min" },
  { id: "e3", name: "Capacity", category: "build", status: "waiting", expectedTime: "~12 min" },
];

export const archivedExecutions: Execution[] = [
  { id: "a1", name: "Anomaly Detection", category: "monitoring", status: "completed", startTime: "10:00:00", endTime: "10:15:32" },
  { id: "a2", name: "Automated Regular Tracking", category: "security", status: "failed", startTime: "09:30:00", endTime: "09:45:12" },
  { id: "a3", name: "Capacity", category: "build", status: "completed", startTime: "08:00:00", endTime: "08:22:45" },
];

export const categoryLabel: Record<CategoryType, string> = {
  monitoring: "M",
  security: "S",
  build: "B",
};
