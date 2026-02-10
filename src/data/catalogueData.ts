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
      { id: "m1", name: "Zabbix Alerts", description: "Automated alert triage and resolution", category: "monitoring" },
      { id: "m2", name: "Pingdom Alerts", description: "Uptime monitoring and incident response", category: "monitoring" },
      { id: "m3", name: "Splunk Alerts", description: "Log analysis and anomaly detection", category: "monitoring" },
    ],
  },
  {
    id: "security",
    label: "Security",
    scenarios: [
      { id: "s1", name: "Authentication", description: "Identity verification workflows", category: "security" },
      { id: "s2", name: "Certificate", description: "SSL/TLS certificate management", category: "security" },
      { id: "s3", name: "Credential", description: "Secret rotation and vault management", category: "security" },
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

export interface PlaybookSection {
  title: string;
  items: string[];
}

export const defaultPlaybook: PlaybookSection[] = [
  { title: "Tools", items: ["Scripts", "Jenkins", "Applications"] },
  { title: "Memory", items: ["Local Storage"] },
  { title: "Model", items: ["GPT-5"] },
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
}

export const runningExecutions: Execution[] = [
  { id: "e1", name: "Alerts", category: "monitoring", status: "running", startTime: "14:32:00" },
  { id: "e2", name: "Certificate", category: "security", status: "waiting", expectedTime: "~5 min" },
  { id: "e3", name: "Capacity", category: "build", status: "waiting", expectedTime: "~12 min" },
];

export const archivedExecutions: Execution[] = [
  { id: "a1", name: "Alerts", category: "monitoring", status: "completed", startTime: "10:00:00", endTime: "10:15:32" },
  { id: "a2", name: "Certificate", category: "security", status: "failed", startTime: "09:30:00", endTime: "09:45:12" },
  { id: "a3", name: "Capacity", category: "build", status: "completed", startTime: "08:00:00", endTime: "08:22:45" },
];

export const categoryLabel: Record<CategoryType, string> = {
  monitoring: "M",
  security: "S",
  build: "B",
};
