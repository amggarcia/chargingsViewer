import moment from 'moment'
import SubUsage from './SubUsage'

export default class Usage {
    idUsage: string
    idServiceProvider: string
    idExternalNumber: string
    idInternalNumber: string
    idNetworkOperator: string
    idChargingStation: string
    idEVSE: string
    startTimestamp: string
    getStartDate() {
        if (this.startTimestamp)
            return moment(this.startTimestamp, 'YYYYMMDDhhmmss');
        else
            return null;
    }
    stopTimestamp: string
    getEndDate() {
        if (this.stopTimestamp)
            return moment(this.stopTimestamp, 'YYYYMMDDhhmmss');
        else
            return null;
    }
    totalDuration: number
    energia_total_transacao: number
    SubUsage: SubUsage[]
}