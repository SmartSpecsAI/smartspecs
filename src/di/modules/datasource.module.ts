import { createModule } from "@evyweb/ioctopus";
import {
  FirebaseDatasource,
  OpenAIDatasource,
} from "@/smartspecs/lib/datasource";
import { DI_SYMBOLS } from "@/smartspecs/di/types";

export function createDatasourceModule() {
  const datasourceModule = createModule();

  datasourceModule
    .bind(DI_SYMBOLS.IFirebaseDatasource)
    .toClass(FirebaseDatasource);

  datasourceModule.bind(DI_SYMBOLS.IOpenAIDatasource).toClass(OpenAIDatasource);

  return datasourceModule;
}
