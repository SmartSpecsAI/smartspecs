import FirefliesUsers from "../lib/presentation/components/components/Flireflies/FirefliesUsers";
import FirefliesTranscripts from "../lib/presentation/components/components/Flireflies/FirefliesTranscripts";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-3">
      <h1 className="text-2xl font-bold mb-4">Fireflies</h1>
      <FirefliesUsers />
      <FirefliesTranscripts />
    </div>
  );
}