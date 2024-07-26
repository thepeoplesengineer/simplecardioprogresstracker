let myChart; // Add this at the top of your script to keep track of the chart instance

document.addEventListener("DOMContentLoaded", function () {
    setupModals();
    setupGoalForm();
    setupTrackForm();
    setupProgressButton();
    setupNextLinkButton();
});

function setupModals() {
    var savedModal = document.getElementById("savedModal");
    var chartModal = document.getElementById("chartModal");
    var calendarModal = document.getElementById("calendarModal");
    var spans = document.querySelectorAll(".close");

    spans.forEach(span => {
        span.onclick = function () {
            savedModal.style.display = "none";
            chartModal.style.display = "none";
            calendarModal.style.display = "none";
        }
    });

    window.onclick = function (event) {
        if (event.target === savedModal) {
            savedModal.style.display = "none";
        } else if (event.target === chartModal) {
            chartModal.style.display = "none";
        } else if (event.target === calendarModal) {
            calendarModal.style.display = "none";
        }
    }
}

function entrySaved() {
    var savedModal = document.getElementById("savedModal");
    savedModal.style.display = "block";
}

function setupGoalForm() {
    const goalForm = document.querySelector('#goalForm');
    goalForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentWeight = document.querySelector('#currentWeight').value;
        const frequency = document.querySelector('#frequency').value;
        const weightLoss = document.querySelector('#weightLoss').value;

        const goals = {
            currentWeight: parseFloat(currentWeight),
            frequency: parseInt(frequency),
            weightLoss: parseFloat(weightLoss)
        };

        localStorage.setItem('fitnessGoals', JSON.stringify(goals));
        
        entrySaved();
        const fitnessGoals = JSON.parse(localStorage.getItem('fitnessGoals'));
        if (fitnessGoals) {
            const stepOne = document.querySelector('#stepOne');
            stepOne.style.display = 'none';
        }
    });
}

function setupTrackForm() {
    const trackForm = document.querySelector('#trackForm');
    trackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const exerciseType = document.querySelector('#exerciseType').value;
        const duration = document.querySelector('#duration').value;

        const newSession = {
            exerciseType: exerciseType,
            duration: parseInt(duration),
            date: new Date().toISOString()
        };
        let entries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];
        entries.push(newSession);
        localStorage.setItem('exerciseEntries', JSON.stringify(entries));
        
        entrySaved();
    });
}

function setupProgressButton() {
    const btnProgress = document.querySelector('#btnProgress');
    const chartModal = document.querySelector('#chartModal');
    btnProgress.addEventListener('click', function (e) {
        e.preventDefault();
        chartModal.style.display = 'block';
        renderChart();
    });
}

function setupNextLinkButton() {
    const nextLinkBtn = document.querySelector('#viewCalendar');
    nextLinkBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const calendarModal = document.querySelector('#calendarModal');
        calendarModal.style.display = 'block';
        renderCalendar();
    });
}

function renderChart() {
    const ctx = document.getElementById('viewChart').getContext('2d');
    const exerciseData = JSON.parse(localStorage.getItem("exerciseEntries")) || [];
    const chart = {
        labels: [],
        data: []
    };
    exerciseData.forEach(function (exercise) {
        const labelPosition = chart.labels.indexOf(exercise.exerciseType);
        if (labelPosition >= 0) {
            chart.data[labelPosition] += exercise.duration;
        } else {
            chart.labels.push(exercise.exerciseType);
            chart.data.push(exercise.duration);
        }
    });

    // Destroy existing chart instance if it exists
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart instance
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chart.labels,
            datasets: [{
                label: 'Minutes',
                data: chart.data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(155, 25, 86)',
                    'rgb(95, 15, 76)'
                ],
                hoverOffset: 4
            }]
        }
    });
}

function renderCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: loadCalendarEvents()
    });
    calendar.render();
}

function loadCalendarEvents() {
    const exerciseData = JSON.parse(localStorage.getItem("exerciseEntries")) || [];
    return exerciseData.map(function (exercise) {
        return {
            title: `${exercise.exerciseType} - ${exercise.duration} min`,
            start: exercise.date
        };
    });
}
