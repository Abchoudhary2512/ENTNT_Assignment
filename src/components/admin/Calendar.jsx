import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getIncidents, getPatients, addIncident, updateIncident, deleteIncident } from '../../utils/dataService';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const Calendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventInfo, setNewEventInfo] = useState(null);

  const loadData = useCallback(() => {
    const allIncidents = getIncidents();
    const allPatients = getPatients();
    setPatients(allPatients);

    const formattedEvents = allIncidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      start: new Date(incident.appointmentDateTime),
      end: new Date(new Date(incident.appointmentDateTime).getTime() + incident.duration * 60000),
      extendedProps: {
        patientId: incident.patientId,
        status: incident.status,
        notes: incident.notes,
        duration: incident.duration,
      },
      backgroundColor: getStatusColor(incident.status),
      borderColor: getStatusColor(incident.status),
    }));
    setEvents(formattedEvents);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50'; // green
      case 'scheduled':
        return '#2196f3'; // blue
      case 'cancelled':
        return '#f44336'; // red
      default:
        return '#757575'; // grey
    }
  };

  const handleDateSelect = (selectInfo) => {
    setNewEventInfo({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const { extendedProps } = clickInfo.event;
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      ...extendedProps,
    });
    setNewEventInfo(null);
    setDialogOpen(true);
  };

  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    const updatedIncident = {
      id: event.id,
      title: event.title,
      appointmentDateTime: event.start.toISOString(),
      duration: (event.end.getTime() - event.start.getTime()) / 60000,
      patientId: event.extendedProps.patientId,
      status: event.extendedProps.status,
      notes: event.extendedProps.notes,
    };
    updateIncident(updatedIncident);
    loadData();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
    setNewEventInfo(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (selectedEvent) {
      // Update existing event
      const updatedIncident = {
        id: selectedEvent.id,
        title: formData.get('title'),
        appointmentDateTime: new Date(formData.get('start')).toISOString(),
        duration: parseInt(formData.get('duration'), 10),
        patientId: formData.get('patientId'),
        status: formData.get('status'),
        notes: formData.get('notes'),
      };
      updateIncident(updatedIncident);
    } else if (newEventInfo) {
      // Create new event
      const newIncident = {
        id: `INC-${Date.now()}`,
        title: formData.get('title'),
        appointmentDateTime: new Date(newEventInfo.start).toISOString(),
        duration: parseInt(formData.get('duration'), 10),
        patientId: formData.get('patientId'),
        status: 'scheduled',
        notes: formData.get('notes'),
      };
      addIncident(newIncident);
    }
    
    loadData();
    handleDialogClose();
  };

  const handleDelete = () => {
    if(selectedEvent) {
      deleteIncident(selectedEvent.id);
      loadData();
      handleDialogClose();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             Calendar
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          editable={true}
          eventDrop={handleEventDrop}
          height="100%"
        />
      </Container>
      
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedEvent ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedEvent?.title || ''}
              required
            />
            <TextField
              margin="dense"
              name="patientId"
              label="Patient"
              select
              fullWidth
              variant="outlined"
              defaultValue={selectedEvent?.patientId || ''}
              required
            >
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
            {selectedEvent && (
               <TextField
                margin="dense"
                name="start"
                label="Appointment Time"
                type="datetime-local"
                fullWidth
                variant="outlined"
                defaultValue={selectedEvent ? new Date(selectedEvent.start).toISOString().slice(0,16) : ''}
                InputLabelProps={{ shrink: true }}
              />
            )}
            <TextField
              margin="dense"
              name="duration"
              label="Duration (minutes)"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={selectedEvent?.duration || 30}
              required
            />

            {selectedEvent && (
              <TextField
                margin="dense"
                name="status"
                label="Status"
                select
                fullWidth
                variant="outlined"
                defaultValue={selectedEvent?.status || 'scheduled'}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            )}
            <TextField
              margin="dense"
              name="notes"
              label="Notes"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              defaultValue={selectedEvent?.notes || ''}
            />
          </DialogContent>
          <DialogActions>
            {selectedEvent && <Button onClick={handleDelete} color="error">Delete</Button>}
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Calendar;