let myChart; // Allows for multiple charts on same day submissions
document.addEventListener("DOMContentLoaded", function () {
    setupGoalForm();
    setupTrackForm();
    setupModals();
    setupProgressButton();
});

function setupGoalForm() {
    const goalForm = document.querySelector('#goalForm');
    if (goalForm) {
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
            
        });
    }
}

function setupTrackForm() {
    const trackForm = document.querySelector('#trackForm');
    if (trackForm) {
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
}

function setupModals() {
    var savedModal = document.getElementById("savedModal");
    var chartModal = document.getElementById("chartModal");
    var spans = document.querySelectorAll(".close");

    spans.forEach(span => {
        span.onclick = function () {
            if (savedModal) savedModal.style.display = "none";
            if (chartModal) chartModal.style.display = "none";

        }
    });

    window.onclick = function (event) {
        if (event.target === savedModal) {
            savedModal.style.display = "none";
        } else if (event.target === chartModal) {
            chartModal.style.display = "none";
        }
    }
}

function entrySaved() {
    var savedModal = document.getElementById("savedModal");
    if (savedModal) savedModal.style.display = "block";
}

function setupProgressButton() {
    const btnProgress = document.querySelector('#btnProgress');
    const chartModal = document.querySelector('#chartModal');
    if (btnProgress && chartModal) {
        btnProgress.addEventListener('click', function (e) {
            e.preventDefault();
            showGoalAndChartModal();
        });
    }
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

function calculateCaloriesBurned() {
    const fitnessGoals = JSON.parse(localStorage.getItem('fitnessGoals'));
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];

    const MET_VALUES = {
        running: 9.8,
        cycling: 7.5,
        swimming: 8.0,
        walking: 3.8,
        walkingfast: 4.8
    };

    const currentWeight = fitnessGoals.currentWeight;
    let totalCaloriesBurned = 0;

    exerciseEntries.forEach(entry => {
        const duration = entry.duration;
        const exerciseType = entry.exerciseType;
        const MET = MET_VALUES[exerciseType];

        if (MET) {
            const caloriesBurned = currentWeight * duration * 0.0175 * MET;
            totalCaloriesBurned += caloriesBurned;
        }
    });

    const mostRecentEntry = exerciseEntries[exerciseEntries.length - 1];
    const mostRecentDuration = mostRecentEntry.duration;
    const mostRecentExerciseType = mostRecentEntry.exerciseType;
    const mostRecentMET = MET_VALUES[mostRecentExerciseType];
    const mostRecentCaloriesBurned = (currentWeight * mostRecentDuration * 0.0175 * mostRecentMET).toFixed(2);

    // Calculate weight loss in lbs
    const totalWeightLoss = (totalCaloriesBurned / 3500).toFixed(2);

    console.log(`Calories burned in most recent entry: ${mostRecentCaloriesBurned}`);
    console.log(`Total calories burned: ${totalCaloriesBurned.toFixed(2)}`);
    console.log(`Total weight loss: ${totalWeightLoss} lbs`);

    return {
        mostRecentCaloriesBurned,
        totalCaloriesBurned: totalCaloriesBurned.toFixed(2),
        totalWeightLoss
    };
}

function getMostRecentEntryDate() {
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];
    exerciseEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    const mostRecentEntryDate = new Date(exerciseEntries[0].date);
    return mostRecentEntryDate;
}

function countEntriesInWeek(mostRecentDate) {
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries')) || [];

    const startOfWeek = new Date(mostRecentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const entriesInWeek = exerciseEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });

    //console.log(`You have worked out ${entriesInWeek.length} times this week`);
    return entriesInWeek.length;
}

function showGoalAndChartModal() {
    var chartModal = document.getElementById("chartModal");
    var goalInfo = document.getElementById("goalInfo");

    const fitnessGoals = JSON.parse(localStorage.getItem('fitnessGoals'));
    const results = calculateCaloriesBurned();

    const weightLossGoal = fitnessGoals.weightLoss;
    const frequency = fitnessGoals.frequency;
    const mostRecentCaloriesBurned = results.mostRecentCaloriesBurned;
    const totalCaloriesBurned = results.totalCaloriesBurned;
    const totalWeightLoss = results.totalWeightLoss;
    const mostRecentDate = getMostRecentEntryDate();
    const entriesThisWeek = countEntriesInWeek(mostRecentDate);

    goalInfo.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-md">
            <h1 class="text-3xl font-extrabold mb-4 text-gray-800">Goals:</h1>
            <p class="text-lg text-gray-700 mb-2">You set a goal to lose <strong class="font-bold">${weightLossGoal}</strong> lbs this month.</p>
            <p class="text-lg text-gray-700 mb-4">You wanted to workout <strong class="font-bold">${frequency}</strong> times a week.</p>
            <h1 class="text-3xl font-extrabold mt-6 mb-4 text-gray-800">Your Progress:</h1>
            <p class="text-lg text-gray-700 mb-2">Your most recent workout you burned <strong class="font-bold">${mostRecentCaloriesBurned}</strong> calories.</p>
            <p class="text-lg text-gray-700 mb-2">You burned <strong class="font-bold">${totalCaloriesBurned}</strong> calories in total using this tracker application.</p>
            <p class="text-lg text-gray-700">This has resulted in a weight loss of <strong class="font-bold">${totalWeightLoss}</strong> lbs.</p>
            <p class="text-lg text-gray-700">You have worked out a total of <strong class="font-bold">${entriesThisWeek}</strong> times this week!</p>
        </div>
    `;

    chartModal.style.display = "block";
    renderChart();
}
