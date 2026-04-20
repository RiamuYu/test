import { notFound } from "next/navigation";
import { getScenarioBySlug } from "@/lib/scenarios";
import { StoryClient } from "./StoryClient";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scenario = getScenarioBySlug(slug);
  if (!scenario) notFound();

  return <StoryClient scenario={scenario} />;
}

