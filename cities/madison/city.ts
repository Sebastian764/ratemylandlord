import type { CityDefinition } from "../types";
import { makeDemoData } from "../demoData";
import Home from "./Home";

const city: CityDefinition = {
  slug: "madison",
  name: "Madison",
  state: "WI",
  campuses: "University of Wisconsin–Madison",
  brand: "Madison Neighbors",
  description:
    "Read tenant experiences and explore landlords around Madison. Built for the people who call it home.",
  accent: "#047857",
  background: "#123b32",
  Home,
  ...makeDemoData("madison", "Madison", 4),
};
export default city;
