import type { CityDefinition } from "../types";
import { makeDemoData } from "../demoData";
import Home from "./Home";

const city: CityDefinition = {
  slug: "pittsburgh",
  name: "Pittsburgh",
  state: "PA",
  campuses: "Pitt · Carnegie Mellon",
  brand: "RateYinzLandlord",
  description:
    "Read tenant experiences and explore landlords around Pittsburgh. Built for the people who call it home.",
  accent: "#4338ca",
  background: "#0f172a",
  Home,
  ...makeDemoData("pittsburgh", "Pittsburgh", 1),
};
export default city;
