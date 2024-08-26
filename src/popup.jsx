import React, {Fragment} from "react";
import {createRoot} from "react-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {TablePagination} from "@mui/material";
import "./popup.css";

function Popup() {
    const [snippets, setSnippets] = React.useState({});

    React.useEffect(() => {
        chrome.storage.sync.get("snippets", (data) => {
            setSnippets(data.snippets || {});
        });
    }, []);

    function saveSnippet(key, value) {
        chrome.storage.sync.get("snippets", (data) => {
            const snippets = data.snippets || {};
            snippets[key] = value;
            chrome.storage.sync.set({snippets}, () => {
                setSnippets(snippets);
            });
        });
    }

    function deleteSnippet(key) {
        chrome.storage.sync.get("snippets", (data) => {
            const snippets = data.snippets || {};
            delete snippets[key];
            chrome.storage.sync.set({snippets}, () => {
                setSnippets(snippets);
            });
        });
    }

    function clearInputs() {
        document.getElementById('newSnippetKey').value = '';
        document.getElementById('newSnippetValue').value = '';
    }

        const [page, setPage] = React.useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(5);

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(snippets).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                <TableCell align="right">{value}</TableCell>
                                <TableCell align="right">
                                    <button
                                        onClick={() => {
                                            deleteSnippet(key);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <input type="text" id="newSnippetKey" placeholder="Key"/>
                <input type="text" id="newSnippetValue" placeholder="Value"/>
                <button
                    onClick={() => {
                        const key = document.getElementById('newSnippetKey').value;
                        const value = document.getElementById('newSnippetValue').value;

                        if (key && value) {
                            saveSnippet(key, value);
                            clearInputs();
                        }
                    }}>Save</button>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={Object.entries(snippets).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        );



}

const root = createRoot(document.getElementById("react-root"));
root.render(<Popup/>);