
import { Typography, Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { OverviewProcesos } from 'src/sections/overview/overview-procesos';
import { OverviewListaProcesos } from 'src/sections/overview/overview-lista-procesos';
import { OverviewCpu } from 'src/sections/overview/overview-cpu';
import { OverviewRam } from 'src/sections/overview/overview-ram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning, faMoon, faHand, faSkull, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'


const Page = () => (
  <>
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
              chartSeries={[75, 25]}
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
              chartSeries={[63, 37]}
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
              value="$24k"
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
              value="24"
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
              value="$24k"
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
              value="$24k"
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
              value="1.6k"
              title="Total"
              logo={<FontAwesomeIcon icon={faEarthAmericas} size = '2x' />}
            />
          </Grid>

          <Grid
            xs={12}
            md={6}
            lg={12}
          >
            <OverviewListaProcesos
              orders={[
                {
                  id: 'f69f88012978187a6c12897f',
                  ref: 'DEV1049',
                  amount: 30.5,
                  name: 'Ekaterina Tankova',
                  createdAt: 1555016400000,
                  status: 'pending'
                },
                {
                  id: '9eaa1c7dd4433f413c308ce2',
                  ref: 'DEV1048',
                  amount: 25.1,
                  name: 'Cao Yu',
                  createdAt: 1555016400000,
                  status: 'delivered'
                },
                {
                  id: '01a5230c811bd04996ce7c13',
                  ref: 'DEV1047',
                  amount: 10.99,
                  name: 'Alexa Richardson',
                  createdAt: 1554930000000,
                  status: 'refunded'
                },
                {
                  id: '1f4e1bd0a87cea23cdb83d18',
                  ref: 'DEV1046',
                  amount: 96.43,
                  name: 'Anje Keizer',
                  createdAt: 1554757200000,
                  status: 'pending'
                },
                {
                  id: '9f974f239d29ede969367103',
                  ref: 'DEV1045',
                  amount: 32.54,
                  name: 'Clarke Gillebert',
                  createdAt: 1554670800000,
                  status: 'delivered'
                },
                {
                  id: 'ffc83c1560ec2f66a1c05596',
                  ref: 'DEV1044',
                  amount: 16.76,
                  name: 'Adam Denisov',
                  createdAt: 1554670800000,
                  status: 'delivered'
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default Page;
