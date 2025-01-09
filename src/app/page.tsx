import { Home as AppHome } from "@/smartspecs/presentation";
import { MultiProvider } from "@/lib/presentation/contexts";

export default function Home() {
  return (
    <MultiProvider>
      <AppHome />
    </MultiProvider>
  );
}
