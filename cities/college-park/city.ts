import type { CityDefinition } from "../types";
import { makeDemoData } from "../demoData";
import Home from "./Home";

const city: CityDefinition = {
  slug: "college-park",
  name: "College Park",
  state: "MD",
  campuses: "University of Maryland",
  brand: "College Park Living",
  description:
    "Read tenant experiences and explore landlords around College Park. Built for the people who call it home.",
  accent: "#b91c1c",
  background: "#451a1a",
  Home,
  ...makeDemoData("college-park", "College Park", 3),
};
export default city;
