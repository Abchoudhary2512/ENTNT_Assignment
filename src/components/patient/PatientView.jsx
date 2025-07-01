import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getIncidentsByPatient, getPatientById } from '../../utils/dataService'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'

const PatientView = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    if (user?.patientId) {
      loadPatientData()
    }
  }, [user])

  const loadPatientData = () => {
    const patientData = getPatientById(user.patientId)
    const patientIncidents = getIncidentsByPatient(user.patientId)
    
    if (!patientData) {
      // If patient data is not found, set a default patient object to prevent infinite loading
      setPatient({
        id: user.patientId,
        name: user.name || 'Unknown Patient',
        contact: 'N/A',
        email: user.email || 'N/A',
        healthInfo: 'N/A',
        address: 'N/A',
        emergencyContact: 'N/A'
      })
    } else {
      setPatient(patientData)
    }
    
    setIncidents(patientIncidents || [])
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'scheduled': return 'primary'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
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

  const upcomingAppointments = incidents.filter(i => i.status === 'scheduled')
  const completedAppointments = incidents.filter(i => i.status === 'completed')
  const totalSpent = completedAppointments.reduce((sum, i) => sum + (i.cost || 0), 0)

  // Helper to download base64 file
  const handleDownloadFile = (file) => {
    // Convert base64 to Blob
    const byteCharacters = atob(file.data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: file.type })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!patient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

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
            My Dental Records
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Welcome, {patient.name}!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Patient ID: {patient.id}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Contact:</strong> {patient.contact}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Email:</strong> {patient.email}
                </Typography>
              </Grid>
              {patient.dob && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Date of Birth:</strong> {formatDate(patient.dob)}
                  </Typography>
                </Grid>
              )}
              {patient.healthInfo && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Health Info:</strong> {patient.healthInfo}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <EventIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">{upcomingAppointments.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Upcoming Appointments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">{completedAppointments.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Completed Treatments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">${totalSpent}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Spent
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {upcomingAppointments.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              <List>
                {upcomingAppointments.map((appointment, index) => (
                  <Box key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
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
                              {formatDate(appointment.appointmentDateTime)} at {formatTime(appointment.appointmentDateTime)}
                            </Typography>
                            {appointment.description && (
                              <Typography variant="body2" color="textSecondary">
                                {appointment.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingAppointments.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treatment History
            </Typography>
            
            {completedAppointments.length > 0 ? (
              completedAppointments.map((appointment) => (
                <Accordion key={appointment.id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {appointment.title}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                        {formatDate(appointment.appointmentDateTime)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Description:</strong> {appointment.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Cost:</strong> ${appointment.cost}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Treatment:</strong> {appointment.treatment}
                        </Typography>
                      </Grid>
                      {appointment.comments && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Comments:</strong> {appointment.comments}
                          </Typography>
                        </Grid>
                      )}
                      {appointment.nextDate && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Next Appointment:</strong> {formatDate(appointment.nextDate)}
                          </Typography>
                        </Grid>
                      )}
                      
                      {/* Files */}
                      {appointment.files && appointment.files.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Attached Files:</strong>
                          </Typography>
                          <List dense>
                            {appointment.files.map((file) => (
                              <ListItem key={file.id} secondaryAction={
                                <IconButton edge="end" aria-label="download" onClick={() => handleDownloadFile(file)}>
                                  <DownloadIcon />
                                </IconButton>
                              }>
                                <AttachFileIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <ListItemText
                                  primary={file.name}
                                  secondary={file.type}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">
                  No completed treatments found.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default PatientView 