const searchInput = document.getElementById('search');
const submitBtn = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

function searchMeal(e) {
    e.preventDefault();

    // clear single meal
    singleMealEl.innerHTML = '';

    const searchTerm = search.value;
    if (searchTerm.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                resultHeading.innerHTML = `<h2>Search results for "${searchTerm}"</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
                } else {
                    mealsEl.innerHTML = data.meals
                        .map((meal) => {
                            return `
                            <div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                <div class="meal-info" data-mealID="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>
                        `;
                        })
                        .join('');
                }
            });
        // clear search text
        searchInput.value = '';
    } else {
        alert('Please enter a search term');
    }
}

function getRandomMeal() {
    mealsEl.innerHTML = ``;
    resultHeading.innerHTML = ``;

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            
            addMealToDOM(meal);
        })
}

function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                ${meal.strInstructions}
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

// event listeners
submitBtn.addEventListener('submit', searchMeal);
randomBtn.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', (e) => {
    const mealsInfo = e.path.find((item) => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealsInfo) {
        const mealId = mealsInfo.getAttribute('data-mealid');
        getMealById(mealId);
    }
});
