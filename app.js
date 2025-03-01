// DOM Elements
const viewReportsBtn = document.getElementById('viewReportsBtn');
const newReportBtn = document.getElementById('newReportBtn');
const reportFormSection = document.getElementById('reportFormSection');
const reportsSection = document.getElementById('reportsSection');
const incidentForm = document.getElementById('incidentForm');
const reportsContainer = document.getElementById('reportsContainer');
const emptyState = document.getElementById('emptyState');
const createFirstReportBtn = document.getElementById('createFirstReportBtn');
const pageTitle = document.getElementById('pageTitle');
const toastContainer = document.getElementById('toastContainer');

// Initialize the app
function init() {
  // Set up event listeners
  viewReportsBtn.addEventListener('click', showReportsSection);
  newReportBtn.addEventListener('click', showReportFormSection);
  createFirstReportBtn.addEventListener('click', showReportFormSection);
  incidentForm.addEventListener('submit', handleFormSubmit);
  
  // Check if there are any reports in localStorage
  checkForReports();
}

// Switch to the reports section
function showReportsSection() {
  reportFormSection.classList.add('hidden');
  reportsSection.classList.remove('hidden');
  pageTitle.textContent = 'My Reports';
  
  // Toggle active state for navigation buttons
  viewReportsBtn.classList.add('active');
  newReportBtn.classList.remove('active');
  
  // Display reports
  displayReports();
}

// Switch to the report form section
function showReportFormSection() {
  reportsSection.classList.add('hidden');
  reportFormSection.classList.remove('hidden');
  pageTitle.textContent = 'Report an Incident';
  
  // Toggle active state for navigation buttons
  newReportBtn.classList.add('active');
  viewReportsBtn.classList.remove('active');
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const incidentType = document.getElementById('incidentType').value;
  const incidentDate = document.getElementById('incidentDate').value;
  const incidentLocation = document.getElementById('incidentLocation').value;
  const incidentDescription = document.getElementById('incidentDescription').value;
  const witnesses = document.getElementById('witnesses').value;
  const policeReport = document.getElementById('policeReport').checked;
  
  // Validate form
  if (!incidentType || !incidentDate || !incidentLocation || !incidentDescription) {
    showToast('Please fill out all required fields.', 'error');
    return;
  }
  
  // Create report object
  const report = {
    id: Date.now().toString(),
    type: incidentType,
    date: incidentDate,
    location: incidentLocation,
    description: incidentDescription,
    witnesses: witnesses,
    policeReport: policeReport,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  saveReport(report);
  
  // Show success message
  showToast('Your report has been submitted successfully.', 'success');
  
  // Reset form
  incidentForm.reset();
  
  // Show reports section
  showReportsSection();
}

// Save report to localStorage
function saveReport(report) {
  // Get existing reports or initialize empty array
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  
  // Add new report
  reports.push(report);
  
  // Save to localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Display reports from localStorage
function displayReports() {
  // Clear reports container
  reportsContainer.innerHTML = '';
  
  // Get reports from localStorage
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  
  // Check if there are any reports
  if (reports.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  // Hide empty state
  emptyState.classList.add('hidden');
  
  // Sort reports by date (newest first)
  reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Create report cards
  reports.forEach(report => {
    const reportCard = createReportCard(report);
    reportsContainer.appendChild(reportCard);
  });
}

// Create a report card element
function createReportCard(report) {
  const reportCard = document.createElement('div');
  reportCard.className = 'report-card';
  
  // Format dates for display
  const formattedCreatedDate = new Date(report.createdAt).toLocaleDateString();
  const formattedIncidentDate = new Date(report.date).toLocaleDateString();
  
  // Set status class
  const statusClass = status-${report.status};
  
  // Create report card content
  reportCard.innerHTML = `
    <div class="report-header">
      <div class="report-title">${capitalizeFirstLetter(report.type)}</div>
      <div class="report-date">Reported: ${formattedCreatedDate}</div>
    </div>
    <div class="report-status ${statusClass}">
      ${getStatusText(report.status)}
    </div>
    <div class="report-content">
      <div class="report-location">${report.location}</div>
      <div class="report-date">Incident date: ${formattedIncidentDate}</div>
      <p class="report-description">${truncateText(report.description, 150)}</p>
      ${report.witnesses ? <div class="report-witnesses">Witnesses: ${report.witnesses}</div> : ''}
      ${report.policeReport ? '<div class="police-report-tag">Police report filed</div>' : ''}
    </div>
  `;
  
  return reportCard;
}

// Check if there are any reports in localStorage
function checkForReports() {
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  if (reports.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = toast ${type};
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 5000);
}

// Helper Functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function getStatusText(status) {
  switch (status) {
    case 'pending':
      return 'Pending Review';
    case 'reviewing':
      return 'Under Review';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Pending Review';
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
