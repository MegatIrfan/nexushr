import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "NexusHR",
  version: packageJson.version,
  copyright: `© ${currentYear}, NexusHR Inc. All rights reserved.`,
  meta: {
    title: "NexusHR: Enterprise Human Capital & Workforce Management",
    description:
      "Modern enterprise workforce management, attendance tracking, leave approvals, and employee self-service platform.",
  },
};
