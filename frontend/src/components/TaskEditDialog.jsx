import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';

const CATEGORIES = ['measurement', 'simulation', 'analysis', 'software', 'hardware'];

const TaskEditDialog = ({ task, open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with task data when dialog opens
  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setCategory(task.category || '');
      setDetails(task.details || '');
      setCompleted(task.completed || false);
      setErrors({});
    }
  }, [task]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Task name is required';
    if (!category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const updatedTask = {
        name: name.trim(),
        category,
        details: details.trim() || null,
        completed
      };
      
      onSave(task.id, updatedTask);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          >
            <InputLabel id="edit-category-label">Category</InputLabel>
            <Select
              labelId="edit-category-label"
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
          </FormControl>
          
          <TextField
            fullWidth
            label="Details (Optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            multiline
            rows={3}
            variant="outlined"
            size="small"
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={completed} 
                onChange={(e) => setCompleted(e.target.checked)} 
              />
            }
            label="Mark as completed"
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog; 