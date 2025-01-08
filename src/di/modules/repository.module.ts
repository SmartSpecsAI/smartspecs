import { createModule } from "@evyweb/ioctopus";
import {
  ProjectsRepository,
  RequirementRepository,
  FilesRepository,
} from "@/smartspecs/infrastructure/";
import { DI_SYMBOLS } from "@/di/types";

export function createRepositoryModule() {
  const repositoryModule = createModule();

  repositoryModule
    .bind(DI_SYMBOLS.IProjectsRepository)
    .toClass(ProjectsRepository);

  repositoryModule
    .bind(DI_SYMBOLS.IRequirementRepository)
    .toClass(RequirementRepository);

  repositoryModule.bind(DI_SYMBOLS.IFilesRepository).toClass(FilesRepository);

  return repositoryModule;
}
