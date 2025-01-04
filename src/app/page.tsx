import Image from "next/image";
import { Home as AppHome } from "@/smartspecs/presentation";
import { ProjectsProvider } from "@/lib/presentation/contexts/ProjectsContext";

export default function Home() {
  return (
    <ProjectsProvider>
      <AppHome />
    </ProjectsProvider>
  );
}
