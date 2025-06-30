
const initializeData = () => {
  if (!localStorage.getItem('dentalPatients')) {
    const defaultPatients = [
      {
        id: "p1",
        name: "John Doe",
        dob: "1990-05-10",
        contact: "1234567890",
        email: "john@entnt.in",
        healthInfo: "No allergies",
        address: "123 Main St, City",
        emergencyContact: "9876543210"
      },
      {
        id: "p2",
        name: "Jane Smith",
        dob: "1985-08-15",
        contact: "2345678901",
        email: "jane@email.com",
        healthInfo: "Allergic to penicillin",
        address: "456 Oak Ave, Town",
        emergencyContact: "8765432109"
      }
    ]
    localStorage.setItem('dentalPatients', JSON.stringify(defaultPatients))
  }

  if (!localStorage.getItem('dentalIncidents')) {
    const defaultIncidents = [
      {
        id: "i1",
        patientId: "p1",
        title: "Regular Checkup",
        description: "Annual dental examination and cleaning",
        comments: "Patient has good oral hygiene",
        appointmentDateTime: "2024-01-15T10:00:00",
        status: "completed",
        cost: 150,
        treatment: "Cleaning and examination",
        nextDate: "2024-07-15",
        files: [
          {
            id: "f1",
            name: "invoice.pdf",
            type: "application/pdf",
            data: "base64_encoded_data_here"
          }
        ]
      },
      {
        id: "i2",
        patientId: "p2",
        title: "Cavity Filling",
        description: "Filling cavity in upper right molar",
        comments: "Patient experienced sensitivity",
        appointmentDateTime: "2024-01-20T14:00:00",
        status: "completed",
        cost: 300,
        treatment: "Composite filling",
        nextDate: "2024-04-20",
        files: []
      },
      {
        id: "i3",
        patientId: "p1",
        title: "Root Canal Consultation",
        description: "Consultation for potential root canal treatment",
        comments: "Patient reports severe pain",
        appointmentDateTime: "2024-02-01T09:00:00",
        status: "scheduled",
        cost: 0,
        treatment: "",
        nextDate: "",
        files: []
      }
    ]
    localStorage.setItem('dentalIncidents', JSON.stringify(defaultIncidents))
  }
}

// Patient Operations
export const getPatients = () => {
  initializeData()
  return JSON.parse(localStorage.getItem('dentalPatients') || '[]')
}

export const addPatient = (patient) => {
  const patients = getPatients()
  const newPatient = {
    ...patient,
    id: `p${Date.now()}`
  }
  patients.push(newPatient)
  localStorage.setItem('dentalPatients', JSON.stringify(patients))
  return newPatient
}

export const updatePatient = (id, updates) => {
  const patients = getPatients()
  const index = patients.findIndex(p => p.id === id)
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updates }
    localStorage.setItem('dentalPatients', JSON.stringify(patients))
    return patients[index]
  }
  return null
}

export const deletePatient = (id) => {
  const patients = getPatients()
  const filteredPatients = patients.filter(p => p.id !== id)
  localStorage.setItem('dentalPatients', JSON.stringify(filteredPatients))
  
  // Also delete related incidents
  const incidents = getIncidents()
  const filteredIncidents = incidents.filter(i => i.patientId !== id)
  localStorage.setItem('dentalIncidents', JSON.stringify(filteredIncidents))
}

export const getPatientById = (id) => {
  const patients = getPatients()
  return patients.find(p => p.id === id)
}

// Incident/Appointment Operations
export const getIncidents = () => {
  initializeData()
  return JSON.parse(localStorage.getItem('dentalIncidents') || '[]')
}

export const getIncidentsByPatient = (patientId) => {
  const incidents = getIncidents()
  return incidents.filter(i => i.patientId === patientId)
}

export const addIncident = (incident) => {
  const incidents = getIncidents()
  const newIncident = {
    ...incident,
    id: `i${Date.now()}`,
    files: incident.files || []
  }
  incidents.push(newIncident)
  localStorage.setItem('dentalIncidents', JSON.stringify(incidents))
  return newIncident
}

export const updateIncident = (id, updates) => {
  const incidents = getIncidents()
  const index = incidents.findIndex(i => i.id === id)
  if (index !== -1) {
    incidents[index] = { ...incidents[index], ...updates }
    localStorage.setItem('dentalIncidents', JSON.stringify(incidents))
    return incidents[index]
  }
  return null
}

export const deleteIncident = (id) => {
  const incidents = getIncidents()
  const filteredIncidents = incidents.filter(i => i.id !== id)
  localStorage.setItem('dentalIncidents', JSON.stringify(filteredIncidents))
}

export const getIncidentById = (id) => {
  const incidents = getIncidents()
  return incidents.find(i => i.id === id)
}

// File Operations
export const addFileToIncident = (incidentId, file) => {
  const incidents = getIncidents()
  const index = incidents.findIndex(i => i.id === incidentId)
  if (index !== -1) {
    if (!incidents[index].files) {
      incidents[index].files = []
    }
    const newFile = {
      id: `f${Date.now()}`,
      name: file.name,
      type: file.type,
      data: file.data
    }
    incidents[index].files.push(newFile)
    localStorage.setItem('dentalIncidents', JSON.stringify(incidents))
    return newFile
  }
  return null
}

export const deleteFileFromIncident = (incidentId, fileId) => {
  const incidents = getIncidents()
  const index = incidents.findIndex(i => i.id === incidentId)
  if (index !== -1 && incidents[index].files) {
    incidents[index].files = incidents[index].files.filter(f => f.id !== fileId)
    localStorage.setItem('dentalIncidents', JSON.stringify(incidents))
  }
}

// Dashboard Statistics
export const getDashboardStats = () => {
  const patients = getPatients()
  const incidents = getIncidents()
  
  const today = new Date()
  const next10Days = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)
  
  const upcomingAppointments = incidents.filter(i => {
    const appointmentDate = new Date(i.appointmentDateTime)
    return appointmentDate >= today && appointmentDate <= next10Days && i.status === 'scheduled'
  }).sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))

  const completedTreatments = incidents.filter(i => i.status === 'completed').length
  const pendingTreatments = incidents.filter(i => i.status === 'scheduled').length
  
  const totalRevenue = incidents
    .filter(i => i.status === 'completed')
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  const topPatients = patients.map(patient => {
    const patientIncidents = incidents.filter(i => i.patientId === patient.id)
    const totalSpent = patientIncidents
      .filter(i => i.status === 'completed')
      .reduce((sum, i) => sum + (i.cost || 0), 0)
    return {
      ...patient,
      totalSpent,
      visitCount: patientIncidents.length
    }
  }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)

  return {
    totalPatients: patients.length,
    upcomingAppointments: upcomingAppointments.slice(0, 10),
    completedTreatments,
    pendingTreatments,
    totalRevenue,
    topPatients
  }
} 