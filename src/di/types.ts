import {
  IProjectsRepository,
  IRequirementRepository,
  IGetAllProjectsUseCase,
  IGetAllRequirementsByProjectUseCase,
  IFirebaseDatasource,
} from "@/smartspecs/index";

export const DI_SYMBOLS = {
  // Repositories
  IProjectsRepository: Symbol.for("IProjectsRepository"),
  IRequirementRepository: Symbol.for("IRequirementRepository"),

  // Datasources
  IFirebaseDatasource: Symbol.for("IFirebaseDatasource"),

  // Use Cases
  IGetAllProjectsUseCase: Symbol.for("IGetAllProjectsUseCase"),
  IGetAllRequirementsByProjectUseCase: Symbol.for(
    "IGetAllRequirementsByProjectUseCase"
  ),
} as const;

export interface DI_RETURN_TYPES {
  // Repositories
  IProjectsRepository: IProjectsRepository;
  IRequirementRepository: IRequirementRepository;

  // Datasources
  IFirebaseDatasource: IFirebaseDatasource; // TODO: Add interface

  // Use Cases
  IGetAllProjectsUseCase: IGetAllProjectsUseCase;
  IGetAllRequirementsByProjectUseCase: IGetAllRequirementsByProjectUseCase;
}
