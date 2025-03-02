import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Paper,
  Chip,
  Box,
  CircularProgress,
  Collapse,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TaskEditDialog from './TaskEditDialog';

const getCategoryColor = (category) => {
  switch (category) {
    case 'measurement':
      return '#2196f3'; // blue
    case 'simulation':
      return '#4caf50'; // green
    case 'analysis':
      return '#ff9800'; // orange
    default:
      return '#9e9e9e'; // grey
  }
};

const TaskList = ({ tasks, loading, onToggleComplete, onUpdateTask, onDeleteTask }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const handleToggleDetails = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleEditClose = () => {
    setEditingTask(null);
  };

  const handleEditSave = (id, updatedTask) => {
    onUpdateTask(id, updatedTask);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No tasks yet. Add a task to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={1}>
        <List sx={{ width: '100%' }}>
          {tasks.map((task, index) => (
            <Box key={task.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: task.completed ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  transition: 'background-color 0.3s',
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id, task.completed)}
                    sx={{ 
                      color: getCategoryColor(task.category),
                      '&.Mui-checked': {
                        color: getCategoryColor(task.category),
                      }
                    }}
                  />
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body1"
                        component="span"
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {task.name}
                      </Typography>
                      <Chip
                        label={task.category}
                        size="small"
                        sx={{
                          bgcolor: `${getCategoryColor(task.category)}20`,
                          color: getCategoryColor(task.category),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    task.details && (
                      <IconButton
                        size="small"
                        onClick={() => handleToggleDetails(task.id)}
                        sx={{ ml: -1, mr: 1 }}
                      >
                        {expandedTaskId === task.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    )
                  }
                />
                
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditClick(task)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" onClick={() => onDeleteTask(task.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              {task.details && (
                <Collapse in={expandedTaskId === task.id} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {task.details}
                    </Typography>
                  </Box>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Paper>

      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          open={!!editingTask}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </>
  );
};

export default TaskList; 