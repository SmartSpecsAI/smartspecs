import { createModule } from "@evyweb/ioctopus";
import {
  GetAllProjectsUseCase,
  GetAllRequirementsByProjectUseCase,
  GenerateRequirementItemsFromConversation,
  CreateNewRequirementUseCase,
  UploadFileUseCase,
  TranscriptAudioUseCase,
  GetFileUrlUseCase,
} from "@/smartspecs/lib/domain/";
import { DI_SYMBOLS } from "@/smartspecs/di/types";

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

  domainModule
    .bind(DI_SYMBOLS.ITranscriptAudioUseCase)
    .toHigherOrderFunction(TranscriptAudioUseCase, [
      DI_SYMBOLS.IFilesRepository,
    ]);

  domainModule
    .bind(DI_SYMBOLS.IGetFileUrlUseCase)
    .toHigherOrderFunction(GetFileUrlUseCase, [DI_SYMBOLS.IFilesRepository]);

  domainModule
    .bind(DI_SYMBOLS.IGenerateRequirementItemsFromConversation)
    .toHigherOrderFunction(GenerateRequirementItemsFromConversation, [
      DI_SYMBOLS.IRequirementRepository,
    ]);

  return domainModule;
}
