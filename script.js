// Report data storage
let currentReport = null;

// Form elements
const reportForm = document.getElementById('reportForm');
const clearFormBtn = document.getElementById('clearForm');
const reportSection = document.getElementById('reportSection');
const reportContent = document.getElementById('reportContent');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');
const newReportBtn = document.getElementById('newReportBtn');

// Initialize date input with today's date
document.getElementById('examDate').valueAsDate = new Date();

// Form submission handler
reportForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(reportForm);
    currentReport = {
        patientName: formData.get('patientName'),
        patientId: formData.get('patientId'),
        examDate: formData.get('examDate'),
        examType: formData.get('examType'),
        examTypeLabel: getExamTypeLabel(formData.get('examType')),
        dose: formData.get('dose'),
        bodyPart: formData.get('bodyPart'),
        doctor: formData.get('doctor'),
        notes: formData.get('notes'),
        generatedDate: new Date().toLocaleString('ru-RU')
    };
    
    // Generate and display report
    generateReport(currentReport);
    
    // Hide form, show report
    document.querySelector('.form-section').style.display = 'none';
    reportSection.style.display = 'block';
    
    // Scroll to report
    reportSection.scrollIntoView({ behavior: 'smooth' });
});

// Clear form handler
clearFormBtn.addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите очистить форму?')) {
        reportForm.reset();
        document.getElementById('examDate').valueAsDate = new Date();
    }
});

// Download PDF handler
downloadBtn.addEventListener('click', function() {
    // In a real application, this would generate a PDF
    // For now, we'll create a simple HTML version
    const reportHTML = generateReportHTML(currentReport);
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DOZ3_Report_${currentReport.patientId}_${new Date().getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Print handler
printBtn.addEventListener('click', function() {
    window.print();
});

// New report handler
newReportBtn.addEventListener('click', function() {
    reportForm.reset();
    document.getElementById('examDate').valueAsDate = new Date();
    document.querySelector('.form-section').style.display = 'block';
    reportSection.style.display = 'none';
    currentReport = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Helper function to get exam type label
function getExamTypeLabel(examType) {
    const labels = {
        'fluorography': 'Флюорография',
        'radiography': 'Рентгенография',
        'ct': 'Компьютерная томография',
        'mammography': 'Маммография'
    };
    return labels[examType] || examType;
}

// Generate report HTML
function generateReport(data) {
    const html = `
        <h3>Отчет ДОЗ-3 - Регистрация дозы облучения</h3>
        
        <div class="report-field">
            <strong>Номер отчета:</strong> DOZ3-${data.patientId}-${Date.now()}
        </div>
        
        <div class="report-field">
            <strong>Дата генерации:</strong> ${data.generatedDate}
        </div>
        
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e2e8f0;">
        
        <h4 style="color: #2563eb; margin: 20px 0 15px 0;">Данные пациента</h4>
        
        <div class="report-field">
            <strong>ФИО пациента:</strong> ${escapeHtml(data.patientName)}
        </div>
        
        <div class="report-field">
            <strong>Номер пациента:</strong> ${escapeHtml(data.patientId)}
        </div>
        
        <h4 style="color: #2563eb; margin: 20px 0 15px 0;">Данные обследования</h4>
        
        <div class="report-field">
            <strong>Дата обследования:</strong> ${formatDate(data.examDate)}
        </div>
        
        <div class="report-field">
            <strong>Тип обследования:</strong> ${escapeHtml(data.examTypeLabel)}
        </div>
        
        <div class="report-field">
            <strong>Область обследования:</strong> ${escapeHtml(data.bodyPart)}
        </div>
        
        <div class="report-field">
            <strong>Доза облучения:</strong> <span style="color: #ef4444; font-weight: bold;">${escapeHtml(data.dose)} мЗв</span>
        </div>
        
        <h4 style="color: #2563eb; margin: 20px 0 15px 0;">Медицинский персонал</h4>
        
        <div class="report-field">
            <strong>Врач:</strong> ${escapeHtml(data.doctor)}
        </div>
        
        ${data.notes ? `
        <h4 style="color: #2563eb; margin: 20px 0 15px 0;">Примечания</h4>
        <div class="report-field">
            ${escapeHtml(data.notes)}
        </div>
        ` : ''}
        
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e2e8f0;">
        
        <p style="color: #64748b; font-size: 0.9rem; margin-top: 20px;">
            Этот отчет сгенерирован автоматически системой X-Ray DOZ3 Report Generator.
        </p>
    `;
    
    reportContent.innerHTML = html;
}

// Generate standalone HTML for download
function generateReportHTML(data) {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Отчет ДОЗ-3 - ${escapeHtml(data.patientName)}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h3 { color: #2563eb; }
        .report-field {
            margin: 15px 0;
            padding: 10px;
            background-color: #f8fafc;
            border-left: 4px solid #2563eb;
        }
        .report-field strong {
            display: inline-block;
            min-width: 200px;
        }
    </style>
</head>
<body>
    ${reportContent.innerHTML}
</body>
</html>
    `.trim();
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Save reports to localStorage
function saveReportToHistory(report) {
    let history = JSON.parse(localStorage.getItem('doz3Reports') || '[]');
    history.unshift({
        ...report,
        id: Date.now()
    });
    // Keep only last 50 reports
    history = history.slice(0, 50);
    localStorage.setItem('doz3Reports', JSON.stringify(history));
}

// Initialize
console.log('X-Ray DOZ3 Report Generator initialized');
