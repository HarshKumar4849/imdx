import home from "@/content/home.json";
import { HomeHero } from "@/components/sections/HomeHero";

export default function HomePage() {
  return <HomeHero content={home} />;
}
