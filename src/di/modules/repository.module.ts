import { createModule } from "@evyweb/ioctopus";
import { ProjectsRepository } from "@/smartspecs/infrastructure/";
import { DI_SYMBOLS } from "@/di/types";

export function createRepositoryModule() {
  const repositoryModule = createModule();

  repositoryModule
    .bind(DI_SYMBOLS.IProjectsRepository)
    .toClass(ProjectsRepository);

  return repositoryModule;
}
