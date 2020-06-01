
const stats = [];

const tableBody = document.querySelector('.table-data');

const casesPerMillion = document.querySelector("#casesPerMillion");
const deathsPerMillion = document.querySelector("#deathsPerMillion");

const deaths = document.querySelector("#deaths");
const totalRecovered = document.querySelector("#totalRecovered");
const totalTests = document.querySelector("#totalTests");
const testsPerMillion = document.querySelector("#testsPerMillion");
const seriousCritical = document.querySelector("#seriousCritical");
const activeCases = document.querySelector("#activeCases");
const cases = document.querySelector("#cases");

const selections = document.querySelector('.selections');

const casesPerMillionView = document.querySelector('.casesPerMillionView')
const deathsPerMillionView = document.querySelector('.deathsPerMillionView')
const totalTestsView = document.querySelector('.totalTestsView')
const seriousCriticalView = document.querySelector('.seriousCriticalView')
const deathsView = document.querySelector('.deathsView')
const totalRecoveredView = document.querySelector('.totalRecoveredView')
const testsPerMillionView = document.querySelector('.testsPerMillionView')
const activeCasesView = document.querySelector('.activeCasesView')
const casesView = document.querySelector('.casesView')

const selectionsContainer = document.querySelector('.selections-container');

let worldTotal;
let countries;

let casesPerMillionArray = [[],[]];
let deathsPerMillionArray = [[],[]];
let deathsArray = [[],[]];
let totalRecoveredArray = [[],[]];
let totalTestsArray = [[],[]];
let testsPerMillionArray = [[],[]];
let seriousCriticalArray = [[],[]];
let activeCasesArray = [[],[]];
let casesArray = [[],[]];

fetch("https://corona-virus-world-and-india-data.p.rapidapi.com/api", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
		"x-rapidapi-key": "0a4b235d33msh47b69830db3f6f7p15d151jsncd10a68f4e63"
	}
})
.then(response => response.json())
.then(data => { 
	stats.push(data);
	worldTotal = stats[0].world_total;
	countries = stats[0].countries_stat;

	loader();
});

selections.addEventListener('click', function(event){
    switch (event.target.id) {
        case "casesPerMillionCheckbox":
            casesPerMillionView.classList.toggle('display-inline-block');
            break;
        case "deathsPerMillionCheckbox":
            deathsPerMillionView.classList.toggle('display-inline-block');
            break;
        case "totalTestsCheckbox":
            totalTestsView.classList.toggle('display-inline-block');
            break;
        case "seriousCriticalCheckbox":
            seriousCriticalView.classList.toggle('display-inline-block');
            break;
        case "deathsCheckbox":
            deathsView.classList.toggle('display-inline-block');
            break;
        case "totalRecoveredCheckbox":
            totalRecoveredView.classList.toggle('display-inline-block');
            break;
        case "testsPerMillionCheckbox":
            testsPerMillionView.classList.toggle('display-inline-block');
            break;
        case "activeCasesCheckbox":
            activeCasesView.classList.toggle('display-inline-block');
            break;
        case "casesCheckbox":
            casesView.classList.toggle('display-inline-block');
            break;
    }
})

function loader() {
	//Load the page after promise gets information
	populatePage();

	populateTable(countries);
	const input = document.querySelector('.search__filter-input');
	input.addEventListener('keyup', function(){
		const filteredCountries = countries.filter( country => country.country_name.toLowerCase().includes(input.value.toLowerCase()));
		
		if (input.value == "") {
			populateTable(countries);			//if input is an empty string, populate every country
		} else {
			populateTable(filteredCountries);	//else populate filtered countries
		}
	})

	//add 'click' listener on country names (displays detailed information of country clicked)
	tableBody.addEventListener('click', function(event) {
		if (event.target.classList.contains("name")) {
            populateCountriesArray(event.target.innerText);
            event.target.classList.toggle("green-background");
            event.target.nextElementSibling.classList.toggle("green-background");
        };
        
	})
}

function populatePage() {
	const infectedCounter = document.querySelector('.infected-counter');
	const deathsCounter = document.querySelector('.deaths-counter');
	const recoveredCounter = document.querySelector('.recovered-counter');
	const deathRate = document.querySelector('.death-rate');

	//stores statistics as strings
	const totalCasesString = worldTotal.total_cases;
	const totalDeathsString = worldTotal.total_deaths;
	const totalRecoveredString = worldTotal.total_recovered;

	//coerce statistics into numbers
	const totalCases = parseInt(totalCasesString.replace(/,/g, ''))
	const totalDeaths = parseInt(totalDeathsString.replace(/,/g, ''))
	const totalRecovered = parseInt(totalRecoveredString.replace(/,/g, ''))

	const deathPercentage = Math.round(totalDeaths / totalCases * 1000) / 1000 * 100;

	//sets innerText of elements
	infectedCounter.innerText = totalCasesString;
	deathsCounter.innerText = totalDeathsString;
	recoveredCounter.innerText = totalRecoveredString;
	deathRate.innerText = `${deathPercentage}%`;
}

function populateTable(filteredCountries) {
	let dataHtml = '';

	filteredCountries.forEach( country => {
		dataHtml += `<tr>
						<td class="name">${country.country_name}</td>
						<td>${country.cases}</td>
					</tr>`
	})

	tableBody.innerHTML = dataHtml;
}

function populateCountriesArray(countryName) {
    countries.forEach( country => {
        if (country.country_name == countryName) {
            if (country.selected == true) {
                delete country.selected;
            } else {
                country.selected = true;
            }
        }
    })

    let countriesSelectedArray = countries.filter( country => country.selected == true);

    populateSelectedCountryHTML(countriesSelectedArray);

    populateArray(casesPerMillionArray, casesPerMillionChart, "total_cases_per_1m_population", countriesSelectedArray)
    populateArray(deathsPerMillionArray, deathsPerMillionChart, "deaths_per_1m_population", countriesSelectedArray)
    populateArray(deathsArray, deathsChart, "deaths", countriesSelectedArray)
    populateArray(totalRecoveredArray, totalRecoveredChart, "total_recovered", countriesSelectedArray)
    populateArray(totalTestsArray, totalTestsChart, "total_tests", countriesSelectedArray)
    populateArray(testsPerMillionArray, testsPerMillionChart, "tests_per_1m_population", countriesSelectedArray)
    populateArray(seriousCriticalArray, seriousCriticalChart, "serious_critical", countriesSelectedArray)
    populateArray(activeCasesArray, activeCasesChart, "active_cases", countriesSelectedArray)
    populateArray(casesArray, casesChart, "cases", countriesSelectedArray)
}

function populateSelectedCountryHTML(countriesSelectedArray) {
    const countrySelected = document.querySelector('.countries-selected');

    let innerHTML = ''

    countriesSelectedArray.forEach( country => {
        innerHTML += `${country.country_name} | `
    })
    countrySelected.innerHTML = innerHTML;
}

function populateArray(array, arrayChart, searchValue, countriesSelectedArray) {
    array = [[],[]];

    countriesSelectedArray.forEach( country => {
        array[0].push(country.country_name);
        array[1].push(country[`${searchValue}`].replace(/,/g, ''));
    })
    updateChartData(arrayChart, array[0], array[1]);
}

//Function updates chart labels/data
function updateChartData(chart, dataLabels, dataNumbers) {
    chart.data.labels = dataLabels;
    chart.data.datasets[0].data = dataNumbers;
    chart.update();
}


//Creating new charts
let deathsPerMillionChart = new Chart(deathsPerMillion, {
    type: 'horizontalBar',
    data: {
        labels: 
            deathsPerMillionArray[0],
        datasets: [{
            label: 'Deaths Per Million of Population',
            data: deathsPerMillionArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let casesPerMillionChart = new Chart(casesPerMillion, {
    type: 'horizontalBar',
    data: {
        labels: casesPerMillionArray[0],
        datasets: [{
            label: 'Cases Per Million of Population',
            data: casesPerMillionArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let deathsChart = new Chart(deaths, {
    type: 'horizontalBar',
    data: {
        labels: deathsArray[0],
        datasets: [{
            label: 'Total Deaths',
            data: deathsArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let totalRecoveredChart = new Chart(totalRecovered, {
    type: 'horizontalBar',
    data: {
        labels: totalRecoveredArray[0],
        datasets: [{
            label: 'Total Recovered',
            data: totalRecoveredArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let totalTestsChart = new Chart(totalTests, {
    type: 'horizontalBar',
    data: {
        labels: totalTestsArray[0],
        datasets: [{
            label: 'Total Tests',
            data: totalTestsArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let testsPerMillionChart = new Chart(testsPerMillion, {
    type: 'horizontalBar',
    data: {
        labels: testsPerMillionArray[0],
        datasets: [{
            label: 'Tests Per Million of Population',
            data: testsPerMillionArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let seriousCriticalChart = new Chart(seriousCritical, {
    type: 'horizontalBar',
    data: {
        labels: seriousCriticalArray[0],
        datasets: [{
            label: 'People in Serious Critical Condition',
            data: seriousCriticalArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let activeCasesChart = new Chart(activeCases, {
    type: 'horizontalBar',
    data: {
        labels: activeCasesArray[0],
        datasets: [{
            label: 'Active Cases',
            data: activeCasesArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

let casesChart = new Chart(cases, {
    type: 'horizontalBar',
    data: {
        labels: casesArray[0],
        datasets: [{
            label: 'Total Cases',
            data: casesArray[1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});




///////////NEWS

const newsArticles = []

const navBarLogoLogo = document.querySelector('.nav-bar__logo-logo');
const navNews = document.querySelector('.navNews');
const navGraphs = document.querySelector('.navGraphs');
const navLearnMore = document.querySelector('.navLearnMore');
const sectionInformation = document.querySelector('.section__information');
const sectionSearch = document.querySelector('.section__search');
const sectionNews = document.querySelector('.section__news');
const sectionLearnMore = document.querySelector('.section__learn-more');
const sectionNavBar = document.querySelector('.section__nav-bar');

const newsArticlesContainer = document.querySelector('.news-articles-container');
const sectionFrontPage = document.querySelector('.section__front-page');



fetch("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=false&pageNumber=1&pageSize=10&q=pandemic&safeSearch=false", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
		"x-rapidapi-key": "0a4b235d33msh47b69830db3f6f7p15d151jsncd10a68f4e63"
	}
})
.then(response => response.json())
.then(data => {
    data.value.forEach( article => newsArticles.push(article));
    loadNewsPage();
});

//Nav link to Front page
navBarLogoLogo.addEventListener('click', function(event) {

    //move news page out of view
    if (!sectionNews.classList.contains('sectionNewsTranslateLeft')) {
        sectionNews.classList.add('sectionNewsTranslateLeft');
    }
    //move learn more page out of view
    if (!sectionLearnMore.classList.contains('sectionLearnMoreTranslateDown')) {
        sectionLearnMore.classList.add('sectionLearnMoreTranslateDown');
    }
    //move search panel out of view
    if (!sectionSearch.classList.contains('searchPanelTranslateRight')) {
        sectionSearch.classList.add('searchPanelTranslateRight');
    }
    //move graphs out of view
    if (!sectionInformation.classList.contains('informationPanelTranslateUp')) {
        sectionInformation.classList.add('informationPanelTranslateUp');
    }
    //move front page into view
    if (sectionFrontPage.classList.contains('sectionFrontPageDisappear')) {
        sectionFrontPage.classList.remove('sectionFrontPageDisappear');
    }

    let navLinks = [navGraphs, navNews, navLearnMore];

    navLinks.forEach( link => {
        if (link.classList.contains('active-tab')) {
            link.classList.remove('active-tab');
        }
    })
    if (sectionNavBar.classList.contains('make-background-white')) {
        sectionNavBar.classList.remove('make-background-white');
    }
})

//Nav link to Graphs page
navGraphs.addEventListener('click', function(event) {

    //move front page out of view
    if (!sectionFrontPage.classList.contains('sectionFrontPageDisappear')) {
        sectionFrontPage.classList.add('sectionFrontPageDisappear');
    }
    //move news page out of view
    if (!sectionNews.classList.contains('sectionNewsTranslateLeft')) {
        sectionNews.classList.add('sectionNewsTranslateLeft');
    }
    //move learn more page out of view
    if (!sectionLearnMore.classList.contains('sectionLearnMoreTranslateDown')) {
        sectionLearnMore.classList.add('sectionLearnMoreTranslateDown');
    }
    //move search panel back into view
    if (sectionSearch.classList.contains('searchPanelTranslateRight')) {
        sectionSearch.classList.remove('searchPanelTranslateRight');
    }
    //move graphs back into view
    if (sectionInformation.classList.contains('informationPanelTranslateUp')) {
        sectionInformation.classList.remove('informationPanelTranslateUp');
    }

    active_tab(navGraphs);
    if (!sectionNavBar.classList.contains('make-background-white')) {
        sectionNavBar.classList.add('make-background-white');
    }
})

//Nav link to News page
navNews.addEventListener('click', function(event) {

    //move front page out of view
    if (!sectionFrontPage.classList.contains('sectionFrontPageDisappear')) {
        sectionFrontPage.classList.add('sectionFrontPageDisappear');
    }
    //moves graphs out of view
    if (!sectionSearch.classList.contains('searchPanelTranslateRight')) {
        sectionSearch.classList.add('searchPanelTranslateRight');
    }
    //moves panels out of view
    if (!sectionInformation.classList.contains('informationPanelTranslateUp')) {
        sectionInformation.classList.add('informationPanelTranslateUp');
    }
    //move learn more page out of view
    if(!sectionLearnMore.classList.contains('sectionLearnMoreTranslateDown')) {
        sectionLearnMore.classList.add('sectionLearnMoreTranslateDown');
    }
    //move news page into view
    if(sectionNews.classList.contains('sectionNewsTranslateLeft')) {
        sectionNews.classList.remove('sectionNewsTranslateLeft');
    }

    active_tab(navNews);
    if (!sectionNavBar.classList.contains('make-background-white')) {
        sectionNavBar.classList.add('make-background-white');
    }
})

//Nav link to Learn More page
navLearnMore.addEventListener('click', function(event) {

    //move front page out of view
    if (!sectionFrontPage.classList.contains('sectionFrontPageDisappear')) {
        sectionFrontPage.classList.add('sectionFrontPageDisappear');
    }
    //move news page out of view
    if (!sectionNews.classList.contains('sectionNewsTranslateLeft')) {
        sectionNews.classList.add('sectionNewsTranslateLeft');
    }
    //move search panel back into view
    if (!sectionSearch.classList.contains('searchPanelTranslateRight')) {
        sectionSearch.classList.add('searchPanelTranslateRight');
    }
    //move graphs back into view
    if (!sectionInformation.classList.contains('informationPanelTranslateUp')) {
        sectionInformation.classList.add('informationPanelTranslateUp');
    }
    //move learn more page into view
    if (sectionLearnMore.classList.contains('sectionLearnMoreTranslateDown')) {
        sectionLearnMore.classList.remove('sectionLearnMoreTranslateDown');
    }

    active_tab(navLearnMore);

    if (!sectionNavBar.classList.contains('make-background-white')) {
        sectionNavBar.classList.add('make-background-white');
    }
})

function loadNewsPage() {

    let newsArticlesHTML = '';

    newsArticles.forEach( article => {
        newsArticlesHTML += `<div class="news-article">
                                <a href="${article.url}"><img src="${article.image.url}"></a>
                                <div class="news-article-text-container">
                                    <h1 class="news-title"><b>${article.title}</b></h1>
                                    <p class="news-date">${article.datePublished.slice(0, 10).replace(/-/g, '/')}</p>
                                    <p class="news-description">${article.description}</p>
                                    <a href="${article.url}">${article.url}</a>
                                </div>
                            </div>`;
    })

    newsArticlesContainer.innerHTML = newsArticlesHTML;
}

function active_tab(makeThisActive) {
    let navLinks = [navGraphs, navNews, navLearnMore];

    navLinks.forEach( link => {
        if (link.classList.contains('active-tab')) {
            link.classList.remove('active-tab');
        }
    })

    if (!makeThisActive.classList.contains('active-tab')) {
        makeThisActive.classList.add('active-tab');
    }
}