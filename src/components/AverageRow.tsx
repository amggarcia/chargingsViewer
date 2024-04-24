import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Average } from "./AveragesViewer";
import SubUsage from "../types/SubUsage";

interface AverageRowProps {
  average: Average;
  averageType: string;
}

function AverageRow(props: AverageRowProps) {
  const { average } = props;
  const [open, setOpen] = React.useState(false);
  const subUsages = getSubUsages();

  function getSubUsages() {
    if (Array.isArray(average.SubUsages)) return average.SubUsages;
    else if (average.SubUsages) return [average.SubUsages];
    else return [];
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
        <TableCell>{average.Count}</TableCell>
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
