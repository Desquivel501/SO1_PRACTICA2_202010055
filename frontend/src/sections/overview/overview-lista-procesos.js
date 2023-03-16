import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Button,
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning, faMoon, faHand, faSkull, faEarthAmericas, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from "react"; 
import TableContainer from '@mui/material/TableContainer';

function Row(props) {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  // console.log(order)

  const getList = event => {

    let id = event.currentTarget.id
    console.log(id)

    fetch('http://127.0.0.1:5000/processes/' + id , {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(data => {  
        console.log(data.data)
        setData(data.data)      
    }).catch(console.error); 

    setOpen(!open)
  }

  return (
    <React.Fragment>
      <TableRow
        hover
        key={order.PID}
      >
        <TableCell>
          {order.PID}
        </TableCell>
        <TableCell>
          {order.PROCESS_NAME}
        </TableCell>
        <TableCell>
          {order.USERNAME}
        </TableCell>
        <TableCell>
          {order.STATE}
        </TableCell>
        <TableCell>
          {order.RAM}%
        </TableCell>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={getList}
            id={order.PID}
          >
            {open ? <FontAwesomeIcon icon={faChevronUp} size = '2x' /> : <FontAwesomeIcon icon={faChevronDown} size = '2x' />}
          </IconButton>
          
        </TableCell>
        
      </TableRow>

      <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="tr">
              Procesos Hijos
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>PID</TableCell>
                  <TableCell>Proceso</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {data.map((val) => (
                  <TableRow key={val.PID}>
                    <TableCell>{val.PID}</TableCell>
                    <TableCell>{val.PROCESS_NAME}</TableCell>
                    <TableCell>{val.USERNAME}</TableCell>
                    <TableCell>{val.STATE}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>            
    
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>

    </React.Fragment>
  )
}


export const OverviewListaProcesos = (props) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>

        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  PID
                </TableCell>
                <TableCell>
                  Proceso
                </TableCell>
                <TableCell>
                  Usuario
                </TableCell>
                <TableCell>
                  Estado
                </TableCell>
                <TableCell>
                  Ram (%)
                </TableCell>
                <TableCell>
                  Hijos
                </TableCell>
              </TableRow> 
            </TableHead>

            <TableBody>
              {
                // console.log(orders)
                orders.map((order) => (
                    <Row key={order.PID} order={order} />
                ))
              }

            </TableBody>
          </Table>
        </TableContainer>

      <Divider />
    </Card>
  );
};

OverviewListaProcesos.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
