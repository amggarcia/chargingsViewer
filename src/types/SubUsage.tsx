import moment from 'moment'

export default class SubUsage {
    idSubUsage: string
    idDay: string
    public getDay() {
        if (this.idDay)
            return moment(this.idDay, 'YYYYMMDD');
        else
            return null;
    }
    periodDuration: number
    preco_opc: number
    preco_unitario_opc_tempo: number
    preco_unitario_opc_energia: number
    preco_unitario_opc_ativacao: number
    preco_opc_tempo: number
    preco_opc_energia: number
    preco_opc_ativacao: number
    energia_total_periodo: number
}