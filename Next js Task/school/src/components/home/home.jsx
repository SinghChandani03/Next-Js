import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my={5}>
        <Box mx={5} mb={5} flexBasis="100%">
          <img 
            src={'/home.png'} 
            alt='school-management-system' 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxWidth: '800px' 
            }} 
          />
        </Box>
        <Box mx={5} flexBasis="100%">
          <Typography variant="p" paragraph>
            A school management system is an information management system for educational institutions to manage student data. It helps teachers get information about students faster, easier and reduces their workload.
          </Typography>
          <Typography variant="p" paragraph>
            School management systems (SMS) are software applications that help schools to streamline their operations and improve efficiency. SMS can be used to track student information, manage attendance, grade assignments, and communicate with parents.
          </Typography>
          <Typography variant="p" paragraph>
            School Management Systems Plays an essential role in the current educational system. School authorities all over the world are engaged in a lot of day-to-day administrative and academic activities to manage and provide a better academic experience to students effectively. However, maintaining and keeping track of school administrative activities is not an easy process in the fast-growing world. It requires hard work and often it is time-consuming.
          </Typography>
          <Typography variant="p" paragraph>
            To better perform the school administrative activities of educational institute and to assure parents the real-time progress and security of their children, educational institutes utilize School Management software nowadays. Such applications often offer many features that help to enhance the performance of schools with minimum efforts. School Management software does it by avoiding the manual paper works and automation of many academic and administrative activities. Now let us take a look at why institutes need to implement it.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
