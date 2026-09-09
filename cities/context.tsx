import { createContext, useContext } from "react";
import type { CityDefinition } from "./types";

export const CityContext = createContext<CityDefinition | undefined>(undefined);
export const useCity = () => useContext(CityContext);
