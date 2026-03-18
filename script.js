// Sample Titanic dataset (simplified)
let data = [
    {Survived: 1, Pclass: 1, Sex: "female", Age: 29},
    {Survived: 0, Pclass: 3, Sex: "male", Age: 22},
    {Survived: 1, Pclass: 2, Sex: "female", Age: 24},
    {Survived: 0, Pclass: 3, Sex: "male", Age: null},
    {Survived: 1, Pclass: 1, Sex: "female", Age: 35},
    {Survived: 0, Pclass: 2, Sex: "male", Age: 28},
    {Survived: 1, Pclass: 3, Sex: "female", Age: 19},
    {Survived: 0, Pclass: 3, Sex: "male", Age: 40}
];

let survivalChartInstance;
let genderChartInstance;
let classChartInstance;

// Data Cleaning
function cleanData(dataset) {
    return dataset.map(row => {
        return {
            ...row,
            Age: row.Age === null ? 30 : row.Age // fill missing age with 30
        };
    });
}

// EDA Calculations
function analyzeData(dataset) {
    let survived = dataset.filter(d => d.Survived === 1).length;
    let notSurvived = dataset.length - survived;

    let male = dataset.filter(d => d.Sex === "male");
    let female = dataset.filter(d => d.Sex === "female");

    let maleSurvived = male.filter(d => d.Survived === 1).length;
    let femaleSurvived = female.filter(d => d.Survived === 1).length;

    let classCounts = [0, 0, 0];
    dataset.forEach(d => classCounts[d.Pclass - 1]++);

    const survivalRate = ((survived / dataset.length) * 100).toFixed(1);

    return {
        survived,
        notSurvived,
        maleSurvived,
        femaleSurvived,
        classCounts,
        survivalRate
    };
}

// Charts
function drawCharts(stats) {

    if (survivalChartInstance) survivalChartInstance.destroy();
    if (genderChartInstance) genderChartInstance.destroy();
    if (classChartInstance) classChartInstance.destroy();

    survivalChartInstance = new Chart(document.getElementById("survivalChart"), {
        type: 'pie',
        data: {
            labels: ["Survived", "Not Survived"],
            datasets: [{
                data: [stats.survived, stats.notSurvived],
                backgroundColor: ["#0f9d58", "#d93025"],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });

    genderChartInstance = new Chart(document.getElementById("genderChart"), {
        type: 'bar',
        data: {
            labels: ["Male", "Female"],
            datasets: [{
                label: "Survivors",
                data: [stats.maleSurvived, stats.femaleSurvived],
                backgroundColor: ["#5b8def", "#a855f7"],
                borderRadius: 8
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });

    classChartInstance = new Chart(document.getElementById("classChart"), {
        type: 'bar',
        data: {
            labels: ["1st Class", "2nd Class", "3rd Class"],
            datasets: [{
                label: "Passengers",
                data: stats.classCounts,
                backgroundColor: ["#2563eb", "#16a34a", "#ea580c"],
                borderRadius: 8
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Main Function
function loadData() {
    let cleanedData = cleanData(data);
    let stats = analyzeData(cleanedData);

    document.getElementById("summary").innerHTML = `
        <article class="summary-card">
            <h3>Total Passengers</h3>
            <p>${cleanedData.length}</p>
            <div class="meta">Sample size analyzed</div>
        </article>
        <article class="summary-card">
            <h3>Survival Rate</h3>
            <p>${stats.survivalRate}%</p>
            <div class="meta">Passengers who survived</div>
        </article>
        <article class="summary-card">
            <h3>Non-Survivors</h3>
            <p>${stats.notSurvived}</p>
            <div class="meta">Total passengers not survived</div>
        </article>
    `;

    drawCharts(stats);
}