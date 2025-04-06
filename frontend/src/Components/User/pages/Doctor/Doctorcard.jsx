import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import { Chip, Box } from '@mui/material';

export default function DoctorCard({item}) {
    const {expertise, name, image, _id, desc} = item;
    
  return (
    <Card sx={{ 
      maxWidth: 300,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }
     }}>
      <CardMedia
        sx={{ 
          backgroundSize: "cover",
          backgroundPosition: "center" 
        }}
        height="200"
        image={image}
        title={name}
        component='img'
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {desc || `Specialized healthcare professional with expertise in ${expertise?.join(', ') || 'multiple medical fields'}.`}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {expertise && expertise.map((exp, index) => (
            <Chip 
              key={index} 
              label={exp} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ margin: '2px' }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={Link} 
          to={`/form/${_id}`}
          variant="contained"
          color="primary"
          fullWidth
        >
          Book Appointment
        </Button>
      </CardActions>
    </Card>
  );
}