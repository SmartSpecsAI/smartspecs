import { createModule } from "@evyweb/ioctopus";
import {
  GetAllProjectsUseCase,
  GetAllRequirementsByProjectUseCase,
  CreateNewRequirementUseCase,
  UploadFileUseCase,
} from "@/smartspecs/domain/";
import { DI_SYMBOLS } from "@/di/types";

export function createDomainModule() {
  const domainModule = createModule();

  domainModule
    .bind(DI_SYMBOLS.IGetAllProjectsUseCase)
    .toHigherOrderFunction(GetAllProjectsUseCase, [
      DI_SYMBOLS.IProjectsRepository,
    ]);

  domainModule
    .bind(DI_SYMBOLS.IGetAllRequirementsByProjectUseCase)
    .toHigherOrderFunction(GetAllRequirementsByProjectUseCase, [
      DI_SYMBOLS.IRequirementRepository,
    ]);

  domainModule
    .bind(DI_SYMBOLS.ICreateNewRequirementUseCase)
    .toHigherOrderFunction(CreateNewRequirementUseCase, [
      DI_SYMBOLS.IRequirementRepository,
    ]);

  domainModule
    .bind(DI_SYMBOLS.IUploadFileUseCase)
    .toHigherOrderFunction(UploadFileUseCase, [DI_SYMBOLS.IFilesRepository]);

  return domainModule;
}
