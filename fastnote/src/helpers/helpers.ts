import { buttonDefs } from "../constants/constants";

export const getDefByIndex = (i: number) => buttonDefs.find(def => def.index === i);

export const getDefByName = (name: string) => buttonDefs.find(def => def.name === name);