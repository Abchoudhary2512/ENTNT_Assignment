import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getPatients, addPatient, updatePatient, deletePatient } from '../../utils/dataService'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
  InputAdornment,
  Alert,
  Snackbar,
  Grid
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'

const PatientManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    healthInfo: '',
    address: '',
    emergencyContact: ''
  })

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.includes(searchTerm)
    )
    setFilteredPatients(filtered)
  }, [patients, searchTerm])

  const loadPatients = () => {
    const allPatients = getPatients()
    setPatients(allPatients)
  }

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData(patient)
    } else {
      setEditingPatient(null)
      setFormData({
        name: '',
        dob: '',
        contact: '',
        email: '',
        healthInfo: '',
        address: '',
        emergencyContact: ''
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPatient(null)
    setFormData({
      name: '',
      dob: '',
      contact: '',
      email: '',
      healthInfo: '',
      address: '',
      emergencyContact: ''
    })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.contact || !formData.email) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      })
      return
    }

    try {
      if (editingPatient) {
        updatePatient(editingPatient.id, formData)
        setSnackbar({
          open: true,
          message: 'Patient updated successfully',
          severity: 'success'
        })
      } else {
        addPatient(formData)
        setSnackbar({
          open: true,
          message: 'Patient added successfully',
          severity: 'success'
        })
      }
      loadPatients()
      handleCloseDialog()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving patient',
        severity: 'error'
      })
    }
  }

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all related appointments.')) {
      try {
        deletePatient(patientId)
        loadPatients()
        setSnackbar({
          open: true,
          message: 'Patient deleted successfully',
          severity: 'success'
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error deleting patient',
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
            Patient Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Patients ({patients.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Patient
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name, email, or contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Health Info</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {patient.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>
                    {patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {patient.healthInfo ? (
                      <Chip
                        label={patient.healthInfo.length > 20 ? patient.healthInfo.substring(0, 20) + '...' : patient.healthInfo}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      <Chip label="No allergies" size="small" color="default" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(patient)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(patient.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredPatients.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="textSecondary">
              {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
            </Typography>
          </Box>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number *"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Health Information"
                  value={formData.healthInfo}
                  onChange={(e) => handleInputChange('healthInfo', e.target.value)}
                  margin="normal"
                  placeholder="e.g., Allergies, medical conditions"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPatient ? 'Update' : 'Add'} Patient
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

export default PatientManagement 