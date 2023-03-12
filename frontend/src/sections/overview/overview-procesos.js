import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';

export const OverviewProcesos = (props) => {
  const { difference, positive = false, sx, value, title, logo} = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.primary"
              variant="overline"
            >
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            {logo}
            

          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewProcesos.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
