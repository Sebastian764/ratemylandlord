import type { CityDefinition } from "../types";
import { makeDemoData } from "../demoData";
import Home from "./Home";

const city: CityDefinition = {
  slug: "austin",
  name: "Austin",
  state: "TX",
  campuses: "University of Texas at Austin",
  brand: "ATX Rent Check",
  description:
    "Read tenant experiences and explore landlords around Austin. Built for the people who call it home.",
  accent: "#c2410c",
  background: "#432818",
  Home,
  ...makeDemoData("austin", "Austin", 5),
};
export default city;
