import { createModule } from "@evyweb/ioctopus";
import { FirebaseDatasource } from "@/smartspecs/lib/datasource";
import { DI_SYMBOLS } from "@/smartspecs/di/types";

export function createDatasourceModule() {
  const datasourceModule = createModule();

  datasourceModule
    .bind(DI_SYMBOLS.IFirebaseDatasource)
    .toClass(FirebaseDatasource);

  return datasourceModule;
}
