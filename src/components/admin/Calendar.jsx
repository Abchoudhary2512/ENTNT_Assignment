import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getIncidents, getPatients } from '../../utils/dataService'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon
} from '@mui/icons-material'

const Calendar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [patients, setPatients] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState('month') // for the view mode, 'month' or 'week'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allIncidents = getIncidents()
    const allPatients = getPatients()
    setIncidents(allIncidents)
    setPatients(allPatients)
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId)
    return patient ? patient.name : 'Unknown Patient'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'scheduled': return 'primary'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getAppointmentsForDate = (date) => {
    if (!date) return []
    
    const dateStr = date.toISOString().split('T')[0]
    return incidents.filter(incident => {
      const incidentDate = new Date(incident.appointmentDateTime).toISOString().split('T')[0]
      return incidentDate === dateStr
    })
  }

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date)
      setDialogOpen(true)
    }
  }

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            Calendar View
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {monthName}
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<ChevronLeftIcon />}
              onClick={handlePreviousMonth}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={handleToday}
              startIcon={<TodayIcon />}
            >
              Today
            </Button>
            <Button
              variant="outlined"
              endIcon={<ChevronRightIcon />}
              onClick={handleNextMonth}
            >
              Next
            </Button>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Grid container>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Grid item xs={12/7} key={day}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #e0e0e0',
                      bgcolor: 'grey.50'
                    }}
                  >
                    {day}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Grid container>
              {days.map((day, index) => {
                const appointments = getAppointmentsForDate(day)
                const isToday = day && day.toDateString() === new Date().toDateString()
                const isCurrentMonth = day && day.getMonth() === currentDate.getMonth()
                
                return (
                  <Grid item xs={12/7} key={index}>
                    <Box
                      sx={{
                        minHeight: 120,
                        p: 1,
                        border: '1px solid #e0e0e0',
                        cursor: day ? 'pointer' : 'default',
                        bgcolor: isToday ? 'primary.light' : 'white',
                        '&:hover': day ? { bgcolor: 'grey.50' } : {},
                        opacity: isCurrentMonth ? 1 : 0.5
                      }}
                      onClick={() => handleDateClick(day)}
                    >
                      {day && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isToday ? 'bold' : 'normal',
                              color: isToday ? 'white' : 'text.primary'
                            }}
                          >
                            {day.getDate()}
                          </Typography>
                          
                          <Box sx={{ mt: 1 }}>
                            {appointments.slice(0, 2).map((appointment) => (
                              <Chip
                                key={appointment.id}
                                label={`${formatTime(appointment.appointmentDateTime)} - ${appointment.title.substring(0, 15)}${appointment.title.length > 15 ? '...' : ''}`}
                                size="small"
                                color={getStatusColor(appointment.status)}
                                sx={{ 
                                  mb: 0.5, 
                                  fontSize: '0.7rem',
                                  maxWidth: '100%',
                                  '& .MuiChip-label': {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }
                                }}
                              />
                            ))}
                            {appointments.length > 2 && (
                              <Typography variant="caption" color="textSecondary">
                                +{appointments.length - 2} more
                              </Typography>
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Appointments for {selectedDate && formatDate(selectedDate)}
        </DialogTitle>
        <DialogContent>
          {selectedDate && (
            <List>
              {getAppointmentsForDate(selectedDate).map((appointment, index) => (
                <Box key={appointment.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6">
                            {appointment.title}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Patient:</strong> {getPatientName(appointment.patientId)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Time:</strong> {formatTime(appointment.appointmentDateTime)}
                          </Typography>
                          {appointment.description && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Description:</strong> {appointment.description}
                            </Typography>
                          )}
                          {appointment.comments && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Comments:</strong> {appointment.comments}
                            </Typography>
                          )}
                          {appointment.status === 'completed' && (
                            <Box mt={1}>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Cost:</strong> ${appointment.cost}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                <strong>Treatment:</strong> {appointment.treatment}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < getAppointmentsForDate(selectedDate).length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
          
          {selectedDate && getAppointmentsForDate(selectedDate).length === 0 && (
            <Box textAlign="center" py={4}>
              <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="textSecondary">
                No appointments scheduled for this date.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Calendar 