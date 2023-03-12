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
import * as React from 'react';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const OverviewListaProcesos = (props) => {
  const { orders = [], sx } = props;
  

  return (
    <Card sx={sx}>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
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
              {orders.map((order) => {
                const [open, setOpen] = React.useState(false);

                return (
                  <React.Fragment>
                    <TableRow
                      hover
                      key={order.id}
                    >
                      <TableCell>
                        {order.ref}
                      </TableCell>
                      <TableCell>
                        {order.name}
                      </TableCell>
                      <TableCell>
                        Usuario
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap[order.status]}>
                          {order.status}
                        </SeverityPill>
                      </TableCell>
                      <TableCell>
                        0
                      </TableCell>

                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => setOpen(!open)}
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
                  
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>

                  </React.Fragment>
                  
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
    </Card>
  );
};

OverviewListaProcesos.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
