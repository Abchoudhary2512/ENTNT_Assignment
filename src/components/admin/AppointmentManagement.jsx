import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  getIncidents, 
  addIncident, 
  updateIncident, 
  deleteIncident, 
  getPatients,
  addFileToIncident,
  deleteFileFromIncident
} from '../../utils/dataService'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteFileIcon
} from '@mui/icons-material'

const AppointmentManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [patients, setPatients] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIncident, setEditingIncident] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDateTime: '',
    status: 'scheduled',
    cost: 0,
    treatment: '',
    nextDate: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allIncidents = getIncidents()
    const allPatients = getPatients()
    setIncidents(allIncidents)
    setPatients(allPatients)
  }

  const handleOpenDialog = (incident = null) => {
    if (incident) {
      setEditingIncident(incident)
      setFormData(incident)
    } else {
      setEditingIncident(null)
      setFormData({
        patientId: '',
        title: '',
        description: '',
        comments: '',
        appointmentDateTime: '',
        status: 'scheduled',
        cost: 0,
        treatment: '',
        nextDate: ''
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingIncident(null)
    setFormData({
      patientId: '',
      title: '',
      description: '',
      comments: '',
      appointmentDateTime: '',
      status: 'scheduled',
      cost: 0,
      treatment: '',
      nextDate: ''
    })
  }

  const handleSubmit = () => {
    if (!formData.patientId || !formData.title || !formData.appointmentDateTime) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      })
      return
    }

    try {
      if (editingIncident) {
        updateIncident(editingIncident.id, formData)
        setSnackbar({
          open: true,
          message: 'Appointment updated successfully',
          severity: 'success'
        })
      } else {
        addIncident(formData)
        setSnackbar({
          open: true,
          message: 'Appointment added successfully',
          severity: 'success'
        })
      }
      loadData()
      handleCloseDialog()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving appointment',
        severity: 'error'
      })
    }
  }

  const handleDelete = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        deleteIncident(incidentId)
        loadData()
        setSnackbar({
          open: true,
          message: 'Appointment deleted successfully',
          severity: 'success'
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error deleting appointment',
          severity: 'error'
        })
      }
    }
  }

  const handleFileUpload = async (incidentId, event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          type: file.type,
          data: e.target.result
        }
        addFileToIncident(incidentId, fileData)
        loadData()
        setSnackbar({
          open: true,
          message: 'File uploaded successfully',
          severity: 'success'
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error uploading file',
        severity: 'error'
      })
    }
  }

  const handleFileDelete = (incidentId, fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        deleteFileFromIncident(incidentId, fileId)
        loadData()
        setSnackbar({
          open: true,
          message: 'File deleted successfully',
          severity: 'success'
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error deleting file',
          severity: 'error'
        })
      }
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
            Appointment Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Appointments ({incidents.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Appointment
          </Button>
        </Box>

        
        <Grid container spacing={3}>
          {incidents.map((incident) => (
            <Grid item xs={12} key={incident.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {incident.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Patient: {getPatientName(incident.patientId)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(incident.appointmentDateTime).toLocaleDateString()} at{' '}
                        {new Date(incident.appointmentDateTime).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Chip
                        label={incident.status}
                        color={getStatusColor(incident.status)}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(incident)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(incident.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" paragraph>
                    {incident.description}
                  </Typography>

                  {incident.comments && (
                    <Typography variant="body2" color="textSecondary" paragraph>
                      <strong>Comments:</strong> {incident.comments}
                    </Typography>
                  )}

                  {incident.status === 'completed' && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Treatment Details:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Cost:</strong> ${incident.cost}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Treatment:</strong> {incident.treatment}
                          </Typography>
                        </Grid>
                        {incident.nextDate && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Next Appointment:</strong> {new Date(incident.nextDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  )}

                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">
                        Files ({incident.files?.length || 0})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <input
                          accept="*/*"
                          style={{ display: 'none' }}
                          id={`file-upload-${incident.id}`}
                          type="file"
                          onChange={(e) => handleFileUpload(incident.id, e)}
                        />
                        <label htmlFor={`file-upload-${incident.id}`}>
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<AttachFileIcon />}
                            size="small"
                          >
                            Upload File
                          </Button>
                        </label>
                      </Box>

                      {incident.files && incident.files.length > 0 && (
                        <List dense>
                          {incident.files.map((file) => (
                            <ListItem key={file.id}>
                              <ListItemText
                                primary={file.name}
                                secondary={file.type}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleFileDelete(incident.id, file.id)}
                                  color="error"
                                >
                                  <DeleteFileIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {incidents.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="textSecondary">
              No appointments found.
            </Typography>
          </Box>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingIncident ? 'Edit Appointment' : 'Add New Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Patient *</InputLabel>
                  <Select
                    value={formData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    label="Patient *"
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Date & Time *"
                  type="datetime-local"
                  value={formData.appointmentDateTime}
                  onChange={(e) => handleInputChange('appointmentDateTime', e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.status === 'completed' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cost ($)"
                      type="number"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Treatment"
                      value={formData.treatment}
                      onChange={(e) => handleInputChange('treatment', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Next Appointment Date"
                      type="date"
                      value={formData.nextDate}
                      onChange={(e) => handleInputChange('nextDate', e.target.value)}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingIncident ? 'Update' : 'Add'} Appointment
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AppointmentManagement 