import { createModule } from "@evyweb/ioctopus";
import { GetAllProjectsUseCase } from "@/smartspecs/domain/";
import { DI_SYMBOLS } from "@/di/types";

export function createDomainModule() {
  const domainModule = createModule();

  domainModule
    .bind(DI_SYMBOLS.IGetAllProjectsUseCase)
    .toHigherOrderFunction(GetAllProjectsUseCase, [
      DI_SYMBOLS.IProjectsRepository,
    ]);

  return domainModule;
}
