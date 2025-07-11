import CalendarView from "@/components/CalendarView";
import ViewTabs from "@/components/ViewTabs";

export default function CalendarPage() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <ViewTabs />
      <h1 className="text-2xl font-bold mb-4">月曆視圖</h1>
      <CalendarView />
    </main>
  );
}
