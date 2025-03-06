import { useState, useEffect } from 'react';
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TaskEditDialog from './TaskEditDialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getCategoryColor = (category) => {
  switch (category) {
    case 'measurement':
      return '#2196f3'; // blue
    case 'simulation':
      return '#4caf50'; // green
    case 'analysis':
      return '#ff9800'; // orange
    case 'software':
      return '#9c27b0'; // purple
    case 'hardware':
      return '#f44336'; // red
    default:
      return '#9e9e9e'; // grey
  }
};

// Sortable task item component
const SortableTaskItem = ({ task, index, expandedTaskId, handleToggleDetails, handleEditClick, onToggleComplete, onDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} key={task.id}>
      {index > 0 && <Divider component="li" />}
      <ListItem
        alignItems="flex-start"
        sx={{
          bgcolor: task.completed ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
          transition: 'background-color 0.3s',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
        {...attributes}
        {...listeners}
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
  );
};

const TaskList = ({ tasks, loading, onToggleComplete, onUpdateTask, onDeleteTask }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [localTasks, setLocalTasks] = useState([]);

  // Initialize localTasks when tasks prop changes
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeId = parseInt(active.id);
      const overId = parseInt(over.id);
      
      // Find the tasks by their IDs
      const activeTask = tasks.find(task => task.id === activeId);
      const overTask = tasks.find(task => task.id === overId);
      
      if (activeTask && overTask) {
        // Create a new array of tasks sorted by priority
        const sortedTasks = [...tasks].sort((a, b) => (a.priority || 0) - (b.priority || 0));
        
        // Find the indices in the sorted array
        const oldIndex = sortedTasks.findIndex(task => task.id === activeId);
        const newIndex = sortedTasks.findIndex(task => task.id === overId);
        
        // Rearrange the array
        const newTasks = arrayMove(sortedTasks, oldIndex, newIndex);
        
        // Update priorities for all affected tasks
        newTasks.forEach((task, index) => {
          if (task.priority !== index) {
            onUpdateTask(task.id, { ...task, priority: index });
          }
        });
        
        // Update local state
        setLocalTasks(newTasks);
      }
    }
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

  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <>
      <Paper elevation={1}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTasks.map(task => task.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <List sx={{ width: '100%' }}>
              {sortedTasks.map((task, index) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  expandedTaskId={expandedTaskId}
                  handleToggleDetails={handleToggleDetails}
                  handleEditClick={handleEditClick}
                  onToggleComplete={onToggleComplete}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
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