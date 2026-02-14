
import { getThemes } from "@/lib/data-access/themes";
import HomeClient from "@/components/home/HomeClient";

// Revalidate every minute to keep themes fresh but serve static HTML for speed.
export const revalidate = 60;

export default async function Home() {
  const themes = await getThemes();
  return <HomeClient themes={themes} />;
}
