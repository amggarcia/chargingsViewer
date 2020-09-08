import React, { useState } from 'react';
import FileLoader from './FileLoader'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import UsageRow from './UsageRow'
import Paper from '@material-ui/core/Paper';
import AveragesViewer from './AveragesViewer';
import Dialog from '@material-ui/core/Dialog';

interface test {
    cenas: string
}


function FileViewer() {
    const [data, setData] = useState([] as any[]);
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div>

            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <AveragesViewer usages={data}></AveragesViewer>
            </Dialog>
            <FileLoader setData={setData} openAverages={setModalOpen}></FileLoader>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell >Provider</TableCell>
                            <TableCell >Station</TableCell>
                            <TableCell >Start</TableCell>
                            <TableCell >Finish</TableCell>
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

