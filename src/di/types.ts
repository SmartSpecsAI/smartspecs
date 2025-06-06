import {
  IProjectsRepository,
  IRequirementRepository,
  IGetAllProjectsUseCase,
  IGetAllRequirementsByProjectUseCase,
  IGetRequirementByIdUseCase,
  IGenerateRequirementItemsFromConversation,
  ICreateNewRequirementUseCase,
  IFirebaseDatasource,
  IFilesRepository,
  IUploadFileUseCase,
  ITranscriptAudioUseCase,
  IGetFileUrlUseCase,
  IOpenAIDatasource,
  IUpdateRequirementUseCase,
  IApproveRequirementUseCase,
  IRejectRequirementUseCase,
} from "@/smartspecs/lib/index";

export const DI_SYMBOLS = {
  // Repositories
  IProjectsRepository: Symbol.for("IProjectsRepository"),
  IRequirementRepository: Symbol.for("IRequirementRepository"),
  IFilesRepository: Symbol.for("IFilesRepository"),

  // Datasources
  IFirebaseDatasource: Symbol.for("IFirebaseDatasource"),
  IOpenAIDatasource: Symbol.for("IOpenAIDatasource"),

  // Use Cases
  IGetAllProjectsUseCase: Symbol.for("IGetAllProjectsUseCase"),
  IGetAllRequirementsByProjectUseCase: Symbol.for(
    "IGetAllRequirementsByProjectUseCase"
  ),
  IGenerateRequirementItemsFromConversation: Symbol.for(
    "IGenerateRequirementItemsFromConversation"
  ),
  ICreateNewRequirementUseCase: Symbol.for("ICreateNewRequirementUseCase"),
  IUploadFileUseCase: Symbol.for("IUploadFileUseCase"),
  ITranscriptAudioUseCase: Symbol.for("ITranscriptAudioUseCase"),
  IGetFileUrlUseCase: Symbol.for("IGetFileUrlUseCase"),
  IGetRequirementByIdUseCase: Symbol.for("IGetRequirementByIdUseCase"),
  IUpdateRequirementUseCase: Symbol.for("IUpdateRequirementUseCase"),
  IApproveRequirementUseCase: Symbol.for("IApproveRequirementUseCase"),
  IRejectRequirementUseCase: Symbol.for("IRejectRequirementUseCase"),
} as const;

export interface DI_RETURN_TYPES {
  // Repositories
  IProjectsRepository: IProjectsRepository;
  IRequirementRepository: IRequirementRepository;
  IFilesRepository: IFilesRepository;

  // Datasources
  IFirebaseDatasource: IFirebaseDatasource;
  IOpenAIDatasource: IOpenAIDatasource;

  // Use Cases
  IGetAllProjectsUseCase: IGetAllProjectsUseCase;
  IGetAllRequirementsByProjectUseCase: IGetAllRequirementsByProjectUseCase;
  ICreateNewRequirementUseCase: ICreateNewRequirementUseCase;
  IUploadFileUseCase: IUploadFileUseCase;
  ITranscriptAudioUseCase: ITranscriptAudioUseCase;
  IGetFileUrlUseCase: IGetFileUrlUseCase;
  IGenerateRequirementItemsFromConversation: IGenerateRequirementItemsFromConversation;
  IGetRequirementByIdUseCase: IGetRequirementByIdUseCase;
  IUpdateRequirementUseCase: IUpdateRequirementUseCase;
  IApproveRequirementUseCase: IApproveRequirementUseCase;
  IRejectRequirementUseCase: IRejectRequirementUseCase;
}
