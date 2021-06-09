import React from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Average } from "./AveragesViewer";
import SubUsage from "../types/SubUsage";

interface AverageRowProps {
  average: Average;
  averageType: string;
}

function AverageRow(props: AverageRowProps) {
  const { average, averageType } = props;
  const [open, setOpen] = React.useState(false);
  const subUsages = getSubUsages();

  function getSubUsages() {
    if (Array.isArray(average.SubUsages)) return average.SubUsages;
    else if (average.SubUsages) return [average.SubUsages];
    else return [];
  }

  function getSum(total: number, num: number) {
    return total + num * 1;
  }
  function getPriceOpc(): number {
    if (!subUsages) return 0;
    const pricesOPC: number[] = subUsages.map((item) => {
      return item.preco_opc as number;
    });
    const result: number = pricesOPC.reduce(getSum, 0);
    return result;
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{average.AverageTypeIdentifier}</TableCell>
        <TableCell>{average.Energy}</TableCell>
        <TableCell>{average.Duration}</TableCell>
        <TableCell>{average.Price}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                SubUsage
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>kW h</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subUsages.map((subUsage: SubUsage) => (
                    <TableRow key={subUsage.idSubUsage}>
                      <TableCell>{subUsage.idSubUsage}</TableCell>
                      <TableCell>{subUsage.energia_total_periodo}</TableCell>
                      <TableCell>{subUsage.periodDuration}</TableCell>
                      <TableCell align="right">{subUsage.preco_opc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default AverageRow;
