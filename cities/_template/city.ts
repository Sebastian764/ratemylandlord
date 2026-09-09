import type { CityDefinition } from "../types";
import { makeDemoData } from "../demoData";
import Home from "./Home";

const city: CityDefinition = {
  slug: "your-town",
  name: "Your Town",
  state: "ST",
  campuses: "Your campus",
  brand: "Your Town Renters",
  description:
    "Read tenant experiences and explore landlords around Your Town. Built for the people who call it home.",
  accent: "#4338ca",
  background: "#1e293b",
  Home,
  ...makeDemoData("your-town", "Your Town", 6),
};
export default city;
