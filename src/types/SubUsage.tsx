import moment from "moment";

export default class SubUsage {
  idSubUsage: string = "";
  idDay: string = "";
  public getDay() {
    if (this.idDay) return moment(this.idDay, "YYYYMMDD");
    else return null;
  }
  periodDuration: number = 0;
  preco_opc: number = 0;
  preco_unitario_opc_tempo: number = 0;
  preco_unitario_opc_energia: number = 0;
  preco_unitario_opc_ativacao: number = 0;
  preco_opc_tempo: number = 0;
  preco_opc_energia: number = 0;
  preco_opc_ativacao: number = 0;
  energia_total_periodo: number = 0;
}
