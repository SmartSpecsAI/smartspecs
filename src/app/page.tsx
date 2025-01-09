import { Home as AppHome, MultiProvider } from "@/smartspecs/lib/presentation";

export default function Home() {
  return (
    <MultiProvider>
      <AppHome />
    </MultiProvider>
  );
}
