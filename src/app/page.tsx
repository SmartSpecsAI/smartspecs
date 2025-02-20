import FirefliesUsers from "../lib/presentation/components/components/Flireflies/FirefliesUsers";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Fireflies</h1>
      <FirefliesUsers />
    </div>
  );
}