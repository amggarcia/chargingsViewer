import React, { useState } from 'react';
import { Button } from '@material-ui/core'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Usage from '../types/Usage';
import SubUsage from '../types/SubUsage';
import * as _ from 'lodash';
import { roundAccurately } from '../helpers/roundingHelper'

interface AveragesViewerProps {
    usages: Usage[]
}
enum AverageType {
    Provider = "Provider",
    Station = "Station"
}

interface Average {
    AverageTypeIdentifier: string,
    Duration: number,
    Price: number,
    Energy: number
}

function AveragesViewer(props: AveragesViewerProps) {
    const [averageType, setAverageType] = useState(AverageType.Provider);
    const [averages, setAverages] = useState(calcAverages(_.groupBy(props.usages, x => x.idServiceProvider)));

    function getSubUsages(usage: Usage) {
        if (usage.SubUsage.length <= 0)
            return [] as SubUsage[]
        var subUsages: SubUsage[] = [] as SubUsage[];

        if (Array.isArray(usage.SubUsage))
            subUsages = usage.SubUsage.concat(subUsages)
        else if (usage.SubUsage)
            subUsages.push(usage.SubUsage)
        return subUsages;
    }

    function changeType(type: AverageType) {
        setAverageType(type);
        var newAverages = [] as Average[];
        if (props.usages.length > 0) {
            switch (type) {
                case AverageType.Station:
                    newAverages = calcAverages(_.groupBy(props.usages, x => x.idChargingStation));
                    setAverages(newAverages);
                    break;
                case AverageType.Provider:
                    newAverages = calcAverages(_.groupBy(props.usages, x => x.idServiceProvider));
                    setAverages(newAverages);
                    break;
                default:
                    break;
            }
        }
    }
    function calcAverages(grouped: _.Dictionary<Usage[]>): Average[] {
        console.log(grouped);
        var calcedAverages = [] as Average[];
        Object.keys(grouped).forEach(x => {
            var newAverage = {} as Average;
            newAverage.AverageTypeIdentifier = x;
            newAverage.Duration = 0;
            newAverage.Price = 0;
            newAverage.Energy = 0;
            grouped[x].forEach(usage => {
                const subUsages = getSubUsages(usage);
                newAverage.Duration += _.sumBy(subUsages, x => x.periodDuration * 1);
                newAverage.Price += _.sumBy(subUsages, x => x.preco_opc * 1);
                newAverage.Energy += _.sumBy(subUsages, x => x.energia_total_periodo * 1);
            })
            newAverage.Duration = roundAccurately(newAverage.Duration, 3);
            newAverage.Price = roundAccurately(newAverage.Price, 2);
            newAverage.Energy = roundAccurately(newAverage.Energy, 3);
            calcedAverages.push(newAverage);
        })
        return calcedAverages;
    }

    return (
        <div>
            <Button variant="contained" onClick={() => changeType(AverageType.Provider)} style={{ margin: "10px" }} > By Provider</Button>
            <Button variant="contained" onClick={() => changeType(AverageType.Station)} style={{ margin: "10px" }} > By Station</Button>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{averageType}</TableCell>
                            <TableCell>kW h</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            averages.map((average: Average) => (
                                <TableRow>
                                    <TableCell>{average.AverageTypeIdentifier}</TableCell>
                                    <TableCell>{average.Energy}</TableCell>
                                    <TableCell>{average.Duration}</TableCell>
                                    <TableCell>{average.Price}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
}

export default AveragesViewer;

