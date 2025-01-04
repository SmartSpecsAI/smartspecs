import {
  IProjectsRepository,
  IGetAllProjectsUseCase,
  IFirebaseDatasource,
} from "@/smartspecs/index";

export const DI_SYMBOLS = {
  // Repositories
  IProjectsRepository: Symbol.for("IProjectsRepository"),

  // Datasources
  IFirebaseDatasource: Symbol.for("IFirebaseDatasource"),

  // Use Cases
  IGetAllProjectsUseCase: Symbol.for("IGetAllProjectsUseCase"),
} as const;

export interface DI_RETURN_TYPES {
  // Repositories
  IProjectsRepository: IProjectsRepository;

  // Datasources
  IFirebaseDatasource: IFirebaseDatasource; // TODO: Add interface

  // Use Cases
  IGetAllProjectsUseCase: IGetAllProjectsUseCase;
}
