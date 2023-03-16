
import { Typography, Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { OverviewProcesos } from 'src/sections/overview/overview-procesos';
import { OverviewListaProcesos } from 'src/sections/overview/overview-lista-procesos';
import { OverviewCpu } from 'src/sections/overview/overview-cpu';
import { OverviewRam } from 'src/sections/overview/overview-ram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning, faMoon, faHand, faSkull, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from "react";


export default function Home() {
  const [cpu, setCPU] = useState([50,50])
  const [ram, setRAM] = useState([50,50])
  const [procesos, setProcesos] = useState([0,0,0,0,0])
  const [listp, setListp] = useState([]) 

  useEffect(() => {
    const interval = setInterval(() => {

      fetch('http://127.0.0.1:5000/monitor', {
          method: 'GET',
          headers: {
              'Content-Type':'application/json'
          }
          })
          .then(resp => resp.json())
          .then(data => {
            setCPU([ Math.round(data.data[0].CPU_FREE ),Math.round(100 - data.data[0].CPU_FREE )]) 
            setRAM([ Math.round(data.data[0].RAM_FREE ),Math.round(100 - data.data[0].RAM_FREE )]) 
            setProcesos([data.data[0].RUNNING, data.data[0].SUSPENDED, data.data[0].STOPPED, data.data[0].ZOMBIE, data.data[0].TOTAL])                   
          }).catch(console.error); 

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getList = () => {
    fetch('http://127.0.0.1:5000/processes', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(resp => resp.json())
    .then(data => {  
      setListp(data.data)
      console.log(data.data)         
    }).catch(console.error); 
  }

  useEffect(() => {
    getList()
  },[]);

  return (
    <div>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Grid
            xs={12}
            sm={12}
            lg={12}
          >
           <Typography variant="h3" component="h3">
            Monitor
          </Typography>
          </Grid>

        <Grid
          container
          spacing={3}
        > 
          <Grid
            xs={12}
            md={6}
            lg={6}
          >
            <OverviewCpu
              chartSeries={cpu}
              labels={['Libre', 'Utilizado']}
              sx={{ height: '100%' }}
            />
          </Grid>

          <Grid
            xs={12}
            md={6}
            lg={6}
          >
            <OverviewRam
              chartSeries={ram}
              labels={['Libre', 'Utilizado']}
              sx={{ height: '100%' }}
            />
          </Grid>

          <Grid
            xs={12}
            sm={12}
            lg={12}
          >
           <Typography variant="h4" component="h3">
            Procesos
          </Typography>
          </Grid>

          <Grid
            xs={12}
            sm={12}
            lg={3}
          >
            <OverviewProcesos
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={procesos[0]}
              title="En Ejecución"
              logo={<FontAwesomeIcon icon={faPersonRunning} size = '2x' />}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={2}
          >
            <OverviewProcesos
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={procesos[1]}
              title="Suspendidos"
              logo={<FontAwesomeIcon icon={faMoon} size = '2x' />}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={2}
          >
            <OverviewProcesos
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={procesos[2]}
              title="Detenidos"
              logo={<FontAwesomeIcon icon={faHand} size = '2x' />}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={2}
          >
            <OverviewProcesos
              difference={12}
              positive
              sx={{ height: '100%' }}
              value={procesos[3]}
              title="Zombies"
              logo={<FontAwesomeIcon icon={faSkull} size = '2x' />}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={3}
          >
            <OverviewProcesos
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value={procesos[4]}
              title="Total"
              logo={<FontAwesomeIcon icon={faEarthAmericas} size = '2x' />}
            />
          </Grid>


          <Grid
            xs={12}
            sm={12}
            lg={3}
          >
           <Button variant="outlined" onClick={getList}>Refresh</Button>
          </Grid>
          

          <Grid
            xs={12}
            md={6}
            lg={12}
          >
            <OverviewListaProcesos
              orders={listp}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </div>
  )
}