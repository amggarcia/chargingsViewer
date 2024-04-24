import { Usage, getSubUsages } from "./Usage";
import { roundAccurately } from "../helpers/roundingHelper";
import * as _ from "lodash";

export enum AverageTypes {
  Provider = "Provider",
  Station = "Station",
}

export interface Average {
  AverageTypeIdentifier: string;
  Duration: number;
  Price: number;
  Energy: number;
  GroupedUsages: Usage[];
}

export function calcAverages(grouped: _.Dictionary<Usage[]>): Average[] {
  var calcedAverages = [] as Average[];
  Object.keys(grouped).forEach((x) => {
    var newAverage = {} as Average;
    newAverage.AverageTypeIdentifier = x;
    newAverage.Duration = 0;
    newAverage.Price = 0;
    newAverage.Energy = 0;
    grouped[x].forEach((usage) => {
      const subUsages = getSubUsages(usage);
      newAverage.Duration += _.sumBy(subUsages, (x) => x.periodDuration * 1);
      newAverage.Price += _.sumBy(subUsages, (x) => x.preco_opc * 1);
      newAverage.Energy += _.sumBy(
        subUsages,
        (x) => x.energia_total_periodo * 1
      );
    });
    newAverage.Duration = roundAccurately(newAverage.Duration, 3);
    newAverage.Price = roundAccurately(newAverage.Price, 2);
    newAverage.Energy = roundAccurately(newAverage.Energy, 3);
    newAverage.GroupedUsages = grouped[x];
    calcedAverages.push(newAverage);
  });
  return calcedAverages;
}
