import {
  IProjectsRepository,
  IRequirementRepository,
  IGetAllProjectsUseCase,
  IGetAllRequirementsByProjectUseCase,
  ICreateNewRequirementUseCase,
  IFirebaseDatasource,
  IFilesRepository,
  IUploadFileUseCase,
  IOpenAIDatasource,
} from "@/smartspecs/index";

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
  ICreateNewRequirementUseCase: Symbol.for("ICreateNewRequirementUseCase"),
  IUploadFileUseCase: Symbol.for("IUploadFileUseCase"),
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
}
