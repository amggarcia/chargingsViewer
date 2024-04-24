import { useState } from "react";
import FileLoader from "./FileLoader";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import UsageRow from "./UsageRow";
import Paper from "@mui/material/Paper";
import AveragesViewer from "./AveragesViewer";
import Dialog from "@mui/material/Dialog";

function FileViewer() {
  const [data, setData] = useState([] as any[]);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <AveragesViewer usages={data}></AveragesViewer>
      </Dialog>
      <FileLoader setData={setData} openAverages={setModalOpen}></FileLoader>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Finish</TableCell>
              <TableCell>kW h</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((usage) => (
              <UsageRow key={usage.idUsage} usage={usage} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default FileViewer;
