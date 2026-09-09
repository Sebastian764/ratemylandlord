import type { CityDefinition } from "../types";
import { makeDemoData } from "../demoData";
import Home from "./Home";

const city: CityDefinition = {
  slug: "ann-arbor",
  name: "Ann Arbor",
  state: "MI",
  campuses: "University of Michigan",
  brand: "Arbor Renters",
  description:
    "Read tenant experiences and explore landlords around Ann Arbor. Built for the people who call it home.",
  accent: "#a16207",
  background: "#102a43",
  Home,
  ...makeDemoData("ann-arbor", "Ann Arbor", 2),
};
export default city;
