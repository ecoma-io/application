import { ExecutorContext, ProjectConfiguration } from "@nx/devkit";

export const getProjectConfiguration = (
  context: ExecutorContext
): ProjectConfiguration =>
  context.projectsConfigurations.projects[context.projectName];
