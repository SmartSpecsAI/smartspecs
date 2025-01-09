import {
  IProjectsRepository,
  IRequirementRepository,
  IGetAllProjectsUseCase,
  IGetAllRequirementsByProjectUseCase,
  ICreateNewRequirementUseCase,
  IFirebaseDatasource,
  IFilesRepository,
  IUploadFileUseCase,
  ITranscriptAudioUseCase,
} from "@/smartspecs/lib/index";

export const DI_SYMBOLS = {
  // Repositories
  IProjectsRepository: Symbol.for("IProjectsRepository"),
  IRequirementRepository: Symbol.for("IRequirementRepository"),
  IFilesRepository: Symbol.for("IFilesRepository"),

  // Datasources
  IFirebaseDatasource: Symbol.for("IFirebaseDatasource"),

  // Use Cases
  IGetAllProjectsUseCase: Symbol.for("IGetAllProjectsUseCase"),
  IGetAllRequirementsByProjectUseCase: Symbol.for(
    "IGetAllRequirementsByProjectUseCase"
  ),
  ICreateNewRequirementUseCase: Symbol.for("ICreateNewRequirementUseCase"),
  IUploadFileUseCase: Symbol.for("IUploadFileUseCase"),
  ITranscriptAudioUseCase: Symbol.for("ITranscriptAudioUseCase"),
} as const;

export interface DI_RETURN_TYPES {
  // Repositories
  IProjectsRepository: IProjectsRepository;
  IRequirementRepository: IRequirementRepository;
  IFilesRepository: IFilesRepository;

  // Datasources
  IFirebaseDatasource: IFirebaseDatasource; // TODO: Add interface

  // Use Cases
  IGetAllProjectsUseCase: IGetAllProjectsUseCase;
  IGetAllRequirementsByProjectUseCase: IGetAllRequirementsByProjectUseCase;
  ICreateNewRequirementUseCase: ICreateNewRequirementUseCase;
  IUploadFileUseCase: IUploadFileUseCase;
  ITranscriptAudioUseCase: ITranscriptAudioUseCase;
}
