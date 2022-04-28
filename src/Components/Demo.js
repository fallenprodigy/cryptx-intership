import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";

import { visuallyHidden } from "@mui/utils";

function createData(name) {
  return {
    name,
  };
}

const rows = [
  createData("#"),
  createData("Coin"),
  createData(""),
  createData("Price"),
  createData("1h"),
  createData("24h"),
  createData("7d"),
  createData("24h Volume	"),
  createData("Mkt Cap"),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {rows.map((row) => (
          <TableCell
            key={row.id}
            // align={headCell.numeric ? "right" : "left"}
            // padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={orderBy === row.id ? order : "asc"}
              onClick={createSortHandler(row.id)}
            >
              {row.name}
              {orderBy === row.name ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ coins }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={coins.length}
            />
            <TableBody>
              {stableSort(coins, getComparator(order, orderBy)).map(
                (coin, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={coin.id}>
                      <TableCell>{coin.market_cap_rank}</TableCell>
                      <TableCell
                        component="th"
                        // id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {coin.name}
                      </TableCell>
                      <TableCell align="left">
                        {coin.symbol.toUpperCase()}
                      </TableCell>
                      <TableCell align="left">
                        ${coin.current_price.toLocaleString()}
                      </TableCell>
                      <TableCell align="left">
                        {coin.price_change_percentage_1h_in_currency.toFixed(
                          2
                        ) < 0 ? (
                          <p className="red">
                            {coin.price_change_percentage_1h_in_currency.toFixed(
                              2
                            )}
                            %
                          </p>
                        ) : (
                          <p className="green">
                            {coin.price_change_percentage_1h_in_currency.toFixed(
                              2
                            )}
                            %
                          </p>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {coin.price_change_percentage_24h_in_currency.toFixed(
                          2
                        ) < 0 ? (
                          <p className="red">
                            {coin.price_change_percentage_24h_in_currency.toFixed(
                              2
                            )}
                            %
                          </p>
                        ) : (
                          <p className="green">
                            {coin.price_change_percentage_24h_in_currency.toFixed(
                              2
                            )}
                            %
                          </p>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {coin.price_change_percentage_7d_in_currency.toFixed(
                          2
                        ) < 0 ? (
                          <p className="red">
                            {coin.price_change_percentage_7d_in_currency.toFixed(
                              2
                            )}
                            %
                          </p>
                        ) : (
                          <p className="green">
                            {coin.price_change_percentage_7d_in_currency.toFixed(
                              2
                            )}
                            %
                          </p>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        ${coin.total_volume.toLocaleString()}
                      </TableCell>
                      <TableCell align="left">
                        ${coin.market_cap.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
