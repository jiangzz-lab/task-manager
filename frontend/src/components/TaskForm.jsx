import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CATEGORIES = ['measurement', 'simulation', 'analysis', 'software', 'hardware'];

const TaskForm = ({ onAddTask }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Task name is required';
    if (!category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const newTask = {
        name: name.trim(),
        category,
        details: details.trim() || null
      };
      
      onAddTask(newTask);
      
      // Reset form
      setName('');
      setCategory('');
      setDetails('');
      setErrors({});
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" component="h2" gutterBottom>
        Add New Task
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          variant="outlined"
          size="small"
        />
        
        <FormControl 
          fullWidth 
          error={!!errors.category} 
          variant="outlined" 
          size="small"
          sx={{ minWidth: { sm: 200 } }}
        >
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography variant="caption" color="error">
              {errors.category}
            </Typography>
          )}
        </FormControl>
      </Box>
      
      <TextField
        fullWidth
        label="Details (Optional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        multiline
        rows={3}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
      >
        Add Task
      </Button>
    </Box>
  );
};

export default TaskForm; 