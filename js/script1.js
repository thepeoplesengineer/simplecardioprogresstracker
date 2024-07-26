

//Step 1 - Submit Goals and Store
document.addEventListener("DOMContentLoaded", function () {
    const goalForm = document.querySelector('#goalForm');
    setModal();
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
        
        //alert('Goals saved successfully!'); 
        entrySaved();
        const fitnessGoals = JSON.parse(localStorage.getItem('fitnessGoals'));
        if (fitnessGoals) {
            const stepOne = document.querySelector('#stepOne');
            stepOne.style.display = 'none';
        }
    });
});

//Function for setup
function setModal() {
    var modal = document.getElementById("savedModal");
    var span = document.querySelector(".close");

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}
//Function for modal
function entrySaved() {
    var modal = document.getElementById("savedModal");
    modal.style.display = "block";
}
//Step 2 - Track sessions
document.addEventListener("DOMContentLoaded", function () {
    const trackForm = document.querySelector('#trackForm');
    setModal();
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
});
//Step 3 - See progress
// // document.addEventListener("DOMContentLoaded", function () {
//     document.querySelector('#btnProgress').addEventListener('click', function (e) {
//         e.preventDefault();
//         const chartVisual = document.querySelector('#myChart');
//         chartVisual.style.display = 'none';

//         document.querySelector('#btnProgress').addEventListener('click', function (e) {
//             e.preventDefault();
//             chartVisual.style.display = 'block';
//         });