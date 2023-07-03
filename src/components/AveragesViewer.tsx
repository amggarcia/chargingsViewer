import React, { useState } from "react";
import { Button } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { Usage } from "../types/Usage";
import SubUsage from "../types/SubUsage";
import * as _ from "lodash";
import { roundAccurately } from "../helpers/roundingHelper";
import AverageRow from "./AverageRow";

interface AveragesViewerProps {
  usages: Usage[];
}
enum AverageType {
  Provider = "Provider",
  Station = "Station",
}

export interface Average {
  AverageTypeIdentifier: string;
  Duration: number;
  Price: number;
  Energy: number;
  SubUsages: SubUsage[];
  Count: number;
}

function AveragesViewer(props: AveragesViewerProps) {
  const [averageType, setAverageType] = useState(AverageType.Provider);
  const [averages, setAverages] = useState(
    calcAverages(
      _.groupBy(props.usages, (x) => x.idServiceProvider),
      AverageType.Provider
    )
  );

  function getSubUsages(usage: Usage) {
    if (usage.SubUsage.length <= 0) return [] as SubUsage[];
    var subUsages: SubUsage[] = [] as SubUsage[];

    if (Array.isArray(usage.SubUsage))
      subUsages = usage.SubUsage.concat(subUsages);
    else if (usage.SubUsage) subUsages.push(usage.SubUsage);
    return subUsages;
  }

  function changeType(type: AverageType) {
    setAverageType(type);
    var newAverages = [] as Average[];
    if (props.usages.length > 0) {
      switch (type) {
        case AverageType.Station:
          newAverages = calcAverages(
            _.groupBy(props.usages, (x) => x.idChargingStation),
            type
          );
          setAverages(newAverages);
          break;
        case AverageType.Provider:
          newAverages = calcAverages(
            _.groupBy(props.usages, (x) => x.idServiceProvider),
            type
          );
          setAverages(newAverages);
          break;
        default:
          break;
      }
    }
  }
  function calcAverages(
    grouped: _.Dictionary<Usage[]>,
    type: String
  ): Average[] {
    var calcedAverages = [] as Average[];
    Object.keys(grouped).forEach((x) => {
      var newAverage = {} as Average;
      newAverage.AverageTypeIdentifier = x;
      newAverage.Duration = 0;
      newAverage.Price = 0;
      newAverage.Energy = 0;
      newAverage.Count = 0;
      newAverage.SubUsages = [];
      grouped[x].forEach((usage) => {
        const subUsages = getSubUsages(usage);
        newAverage.Duration += _.sumBy(subUsages, (x) => x.periodDuration * 1);
        newAverage.Price += _.sumBy(subUsages, (x) => x.preco_opc * 1);
        newAverage.Energy += _.sumBy(
          subUsages,
          (x) => x.energia_total_periodo * 1
        );
        newAverage.Count += 1;
      });
      newAverage.Duration = roundAccurately(newAverage.Duration, 3);
      newAverage.Price = roundAccurately(newAverage.Price, 2);
      newAverage.Energy = roundAccurately(newAverage.Energy, 3);
      newAverage.SubUsages = getInnerRows(grouped[x], type);
      calcedAverages.push(newAverage);
    });
    return calcedAverages;
  }

  function calcInnerRows(grouped: _.Dictionary<Usage[]>): SubUsage[] {
    var innerRows = [] as SubUsage[];
    Object.keys(grouped).forEach((x) => {
      var newAverage = {} as SubUsage;
      newAverage.idSubUsage = x;
      newAverage.energia_total_periodo = 0;
      newAverage.periodDuration = 0;
      newAverage.preco_opc = 0;
      grouped[x].forEach((usage) => {
        const subUsages = getSubUsages(usage);
        newAverage.periodDuration += _.sumBy(
          subUsages,
          (x) => x.periodDuration * 1
        );
        newAverage.preco_opc += _.sumBy(subUsages, (x) => x.preco_opc * 1);
        newAverage.energia_total_periodo += _.sumBy(
          subUsages,
          (x) => x.energia_total_periodo * 1
        );
      });
      newAverage.periodDuration = roundAccurately(newAverage.periodDuration, 3);
      newAverage.preco_opc = roundAccurately(newAverage.preco_opc, 2);
      newAverage.energia_total_periodo = roundAccurately(
        newAverage.energia_total_periodo,
        3
      );
      innerRows.push(newAverage);
    });
    return innerRows;
  }
  function getInnerRows(usages: Usage[], type: String): SubUsage[] {
    let subRows = [] as SubUsage[];
    if (usages.length > 0) {
      switch (type) {
        case AverageType.Station:
          subRows = calcInnerRows(
            _.groupBy(usages, (x) => x.idServiceProvider)
          );
          break;
        case AverageType.Provider:
          subRows = calcInnerRows(
            _.groupBy(usages, (x) => x.idChargingStation)
          );
          break;
        default:
          break;
      }
      return subRows;
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => changeType(AverageType.Provider)}
        style={{ margin: "10px" }}
      >
        {" "}
        By Provider
      </Button>
      <Button
        variant="contained"
        onClick={() => changeType(AverageType.Station)}
        style={{ margin: "10px" }}
      >
        {" "}
        By Station
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>{}</TableCell>
              <TableCell>{averageType}</TableCell>
              <TableCell>kW h</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{"Totals"}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>
                {roundAccurately(
                  averages.reduce((p, c) => p + c.Energy, 0),
                  3
                )}
              </TableCell>
              <TableCell>
                {roundAccurately(
                  averages.reduce((p, c) => p + c.Duration, 0),
                  3
                )}
              </TableCell>
              <TableCell>
                {roundAccurately(
                  averages.reduce((p, c) => p + c.Price, 0),
                  2
                )}
              </TableCell>
              <TableCell>
                {roundAccurately(
                  averages.reduce((p, c) => p + c.Count, 0),
                  2
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {averages.map((average: Average) => (
              <AverageRow
                average={average}
                averageType={averageType}
              ></AverageRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AveragesViewer;
