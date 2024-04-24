import moment from "moment";
import SubUsage from "./SubUsage";

export class Usage {
  idUsage: string = "";
  idServiceProvider: string = "";
  idExternalNumber: string = "";
  idInternalNumber: string = "";
  idNetworkOperator: string = "";
  idChargingStation: string = "";
  idEVSE: string = "";
  startTimestamp: string = "";
  getStartDate() {
    if (this.startTimestamp)
      return moment(this.startTimestamp, "YYYYMMDDhhmmss");
    else return null;
  }
  stopTimestamp: string = "";
  getEndDate() {
    if (this.stopTimestamp) return moment(this.stopTimestamp, "YYYYMMDDhhmmss");
    else return null;
  }
  totalDuration: number = 0;
  energia_total_transacao: number = 0;
  SubUsage: SubUsage[] = [];
}

export function getSubUsages(usage: Usage) {
  if (usage.SubUsage.length <= 0) return [] as SubUsage[];
  var subUsages: SubUsage[] = [] as SubUsage[];

  if (Array.isArray(usage.SubUsage))
    subUsages = usage.SubUsage.concat(subUsages);
  else if (usage.SubUsage) subUsages.push(usage.SubUsage);
  return subUsages;
}
