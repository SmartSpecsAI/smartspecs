import { createModule } from "@evyweb/ioctopus";
import { FirebaseDatasource, OpenAIDatasource } from "@/smartspecs/datasource";
import { DI_SYMBOLS } from "@/di/types";

export function createDatasourceModule() {
  const datasourceModule = createModule();

  datasourceModule
    .bind(DI_SYMBOLS.IFirebaseDatasource)
    .toClass(FirebaseDatasource);

  datasourceModule.bind(DI_SYMBOLS.IOpenAIDatasource).toClass(OpenAIDatasource);

  return datasourceModule;
}
