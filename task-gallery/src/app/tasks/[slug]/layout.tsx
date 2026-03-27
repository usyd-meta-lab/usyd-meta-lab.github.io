import { TASKS } from "@/lib/task-config";

export function generateStaticParams() {
  return TASKS.map((task) => ({
    slug: task.slug,
  }));
}

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
