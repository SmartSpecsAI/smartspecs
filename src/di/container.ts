import { createContainer } from "@evyweb/ioctopus";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/di/types";
import {
  createDomainModule,
  createDatasourceModule,
  createRepositoryModule,
} from "@/di/modules";

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol("DomainModule"), createDomainModule());
ApplicationContainer.load(Symbol("DatasourceModule"), createDatasourceModule());
ApplicationContainer.load(Symbol("RepositoryModule"), createRepositoryModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}
