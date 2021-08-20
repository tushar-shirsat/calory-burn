const caloriesController = (function () {

    let AddCal = function (id, type, description, qauntity, Calories) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.qauntity = qauntity;
        this.Calories = Calories;
    }

    let BurnCal = function (id, type, description, qauntity, Calories) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.qauntity = qauntity;
        this.Calories = Calories;
    }
    let storage = {
        allCalories: {
            add: [],
            burn: []
        },
        all: {
            add: 000,
            burn: 0
        },
        totalCaloriesPerDay: 0,
        minCalPerDay: 2300,
        percentage: 0,
        remaining: 0
    }

    const totalCalories = (type) => {
        let total = storage.allCalories[type].reduce((sum, element) => sum += element.Calories * element.qauntity, 0)
        storage.all[type] = total;
    }

    return {
        computeCalories: function () {
            totalCalories("add");
            totalCalories("burn");

            storage.totalCaloriesPerDay = Math.abs(storage.all.add - storage.all.burn);
            storage.remaining = storage.minCalPerDay - storage.totalCaloriesPerDay;
            storage.percentage = Math.round((storage.totalCaloriesPerDay / storage.minCalPerDay) * 100);
        },
        returnCalories: function () {
            return {
                totalCalories: storage.totalCaloriesPerDay,
                totalAdded: storage.all.add,
                totalBurned: storage.all.burn,
                remaining: storage.remaining,
                percentage: storage.percentage
            }
        },
        addCalory: function (formData) {
            let { type, description, qauntity, Calories } = formData;
            let id, newCalory, caloryLength, caloryArr;
            caloryLength = storage.allCalories[type].length;
            caloryArr = storage.allCalories[type];
            console.log(caloryArr);

            if (caloryLength > 0) {
                id = caloryArr[caloryLength - 1].id + 1;
            } else {
                id = 0;
            }
            if (type === "add") {
                newCalory = new AddCal(id, type, description, qauntity, Calories)
            } else if (type === "burn") {
                newCalory = new BurnCal(id, type, description, qauntity, Calories)
            }
            storage.allCalories[type].push(newCalory);
            return newCalory;
        },
        result: function () {
            return storage;
        },
        deleteCalory: function (type, id) {
            let deleteIndex = storage.allCalories[type].findIndex((curr) => curr.id === id);
            if (deleteIndex !== -1) {
                storage.allCalories[type].splice(deleteIndex, 1)
            }

        }
    }
})();

const AppUiController = (function () {
    let htmlClassNames = {
        typeClass: ".showForm__type",
        descriptionClass: ".showForm__discription__input",
        qauntityClass: ".qauntity",
        CaloriesClass: ".showForm__add_value",
        addBtnClass: ".showForm_add_btn",
        foodSliderClass: ".food__slider",
        exerciseSliderClass: ".exercise__slider",
        foodBtn: ".food_calAdd",
        exreciseBtn: ".exercise_calAdd",
        frontAppResultRemainingCal: ".totalCal__remaining",
        frontAppFoodPanelCal: ".main_panel__result__food_cal",
        frontAppExercisePanelCal: ".main_panel__result__exercise_cal",
        frontAppDatePercentage: ".main_panel__date__percent",
        frontAppChart: ".main_panel__graph__circle",
        frontAppRemaining: ".remaining",
        frontAppMainPanel: ".main_panel",
        frontAppDate: '.main_panel__date__text'
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    extractReamaining = function (num) {
        num = Math.round(num).toString();
        if (num.length > 3) {
            num = num.substr(0, num.length - 3) + "," + num.substr(num.length - 3, 3);
        } else {
            num = num;
        }
        return num;
    };

    extractCalories = function (num) {
        num = Math.abs(num).toFixed(2).split(".");
        let firstNum = num[0];
        let lastNum = num[1];
        if (firstNum.length > 3) {
            num = firstNum.substr(0, firstNum.length - 3) + "," + firstNum.substr(firstNum.length - 3, 3) + "." + lastNum;
        } else {
            num = firstNum + "." + lastNum;
        }
        return num;
    };

    return {
        getFormData: function () {
            return {
                type: document.querySelector(htmlClassNames.typeClass).value,
                description: document.querySelector(htmlClassNames.descriptionClass).value,
                qauntity: +document.querySelector(htmlClassNames.qauntityClass).value,
                Calories: parseFloat(document.querySelector(htmlClassNames.CaloriesClass).value)
            }
        },
        getClassNames: function () {
            return htmlClassNames;
        },
        addCalory: function (newCalory, type) {
            let markup, addNew, notification, removenotification;
            if (type === 'add') {
                addNew = htmlClassNames.foodSliderClass;
                notification = `
                <i class="fab fa-apple"></i>
                <p class="name">+ Food</p>
                <div class="circle"></div>
                `
                removenotification = `
                        <i class="fas fa-fire"></i>
                        <p class="name">- Excrecise</p>
                `
                markup = `
                <div class="food_container__foods" id="add_${newCalory.id}">
                <div class="food_container__foods__name">
                    ${newCalory.description}
                </div>
                <div class="food_container__food__calBalance">
                    Calories Balance
                    <span class="food_container__foods__cal">+${extractCalories(newCalory.Calories)}Cal</span>
                    <div class="food_container__food__bar"></div>
                </div>
                <div class="food_container__foods___delete">
                    <button class="btn_deleteItem"><i class="far fa-times-circle"></i></button>
                </div>
            </div>           
                `
                document.querySelector(htmlClassNames.foodBtn).innerHTML = notification;
                document.querySelector(htmlClassNames.exreciseBtn).innerHTML = removenotification;
            }
            else if (type === 'burn') {
                addNew = htmlClassNames.exerciseSliderClass;
                notification = `
                <i class="fas fa-fire"></i>
                <p class="name">- Excrecise</p>
                <div class="circle"></div>
                `;
                removenotification = `
                <i class="fab fa-apple"></i>
                <p class="name">+ Food</p>
                `;
                markup = `
                <div class="food_container__foods running_container__name" id="burn_${newCalory.id}">
                <div class="food_container__foods__name running_container__name">
                ${newCalory.description}
                </div>
                <div class="food_container__food__calBalance running_calBalance">
                    Calories Burned
                    <span class="food_container__foods__cal running__calBalance__cel">-${extractCalories(newCalory.Calories)}Cal</span>
                    <div class="food_container__food__bar running__calBalance__bar"></div>
                </div>
                <div class="food_container__foods___delete running_container__delete">
                    <button class="btn_deleteItem"><i class="far fa-times-circle"></i></button>
                </div>
            </div>
                `;
                document.querySelector(htmlClassNames.exreciseBtn).innerHTML = notification;
                document.querySelector(htmlClassNames.foodBtn).innerHTML = removenotification;
            }
            document.querySelector(addNew).insertAdjacentHTML('beforeend', markup);
        },
        displayFrontAppCalories: function (calObj) {
            const {
                totalAdded,
                totalBurned,
                remaining,
                percentage, } = calObj;

            document.querySelector(htmlClassNames.frontAppDatePercentage).textContent = `${percentage}%`;
            document.querySelector(htmlClassNames.frontAppFoodPanelCal).textContent = `+ ${extractCalories(totalAdded)}`;
            document.querySelector(htmlClassNames.frontAppExercisePanelCal).textContent = `- ${extractCalories(totalBurned)}`;

            const frontChart = (color) => {
                let editprecentagePath = `
            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#130f40"></circle>
            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#a29bfe" stroke-width="3"></circle>
          
            <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="${color}" stroke-width="2" stroke-dasharray="${percentage} 100" stroke-dashoffset="0"></circle>
            `
                document.querySelector(htmlClassNames.frontAppResultRemainingCal).innerHTML = `<span class="precentage totalCal__remaining" style="color:${color};">${extractReamaining(remaining)}</span>`
                document.querySelector(htmlClassNames.frontAppChart).innerHTML = editprecentagePath;
            }

            if (remaining > 1300) {
                frontChart("#27ae60");
                document.querySelector(htmlClassNames.frontAppRemaining).innerHTML = `
                <span class="remaining">
                    Remaining
                </span>
                `;
            }
            else if (remaining <= 1300 && remaining > 500) {
                frontChart("#8e44ad");
                document.querySelector(htmlClassNames.frontAppRemaining).innerHTML = `
                <span class="remaining">
                    Remaining
                </span>
                `;
            }
            else if (remaining <= 500 && remaining > 0) {
                console.log(remaining);
                document.querySelector(htmlClassNames.frontAppRemaining).innerHTML = `
                <span class="remaining" style="color:#e74c3c !important;">
                    <i class="fa fa-exclamation-circle fa-spin  fa-fw" ></i>
                    Remaining
                </span>
                `;
                frontChart("#e74c3c");
            }
            else if (remaining <= 0) {
                document.querySelector(htmlClassNames.frontAppRemaining).innerHTML = `
                <span class="remaining" style="color:#e74c3c !important;">
                    <i class="fa fa-exclamation-circle fa-spin  fa-fw" ></i>
                    Limit over load
                </span>
                `;
                frontChart("#e74c3c");
            }
        },
        deleteCalory: function (divId) {
            let parent = document.getElementById(divId).parentNode;
            let child = document.getElementById(divId);
            parent.removeChild(child);
        },
        displayDate: function () {
            let today, date, year, newMonth, newDay;
            today = new Date();
            year = today.getFullYear();
            date = today.getDate();
            newMonth = months[today.getMonth()];
            newDay = days[today.getDay()];

            document.querySelector(htmlClassNames.frontAppDate).textContent = `${newDay}, ${date} ${newMonth} ${year}`
        },

    }
})();

const mainController = (function (caloriesCtr, AppUiCtr) {
    let htmlClassNames = AppUiCtr.getClassNames();

    const calculateCalories = () => {
        caloriesCtr.computeCalories();
        let total = caloriesCtr.returnCalories();
        AppUiCtr.displayFrontAppCalories(total);
        console.log(total);
    }
    const addCalories = () => {
        let formData = AppUiCtr.getFormData();
        if (formData.description !== "" && !isNaN(formData.qauntity) && formData.qauntity > 0 && !isNaN(formData.Calories) && formData.Calories > 0) {
            let newCalory = caloriesCtr.addCalory(formData);
            AppUiCtr.addCalory(newCalory, formData.type);
            calculateCalories();
        } else {
            console.log("please fill form correcly!");
        }
    }

    const deleteCalories = (e) => {
        let parentNode, getId, id, type;

        parentNode = e.target.parentNode.parentNode.parentNode.id;
        if (parentNode) {
            getId = parentNode.split('_');
            id = parseInt(getId[1]);
            type = getId[0];
            caloriesCtr.deleteCalory(type, id);
            AppUiCtr.deleteCalory(parentNode);
            calculateCalories();
        }
    }


    document.querySelector(htmlClassNames.addBtnClass).addEventListener('click', (e) => {
        e.preventDefault();
        addCalories();
    })

    document.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            addCalories();
        }
    })

    document.querySelector(htmlClassNames.frontAppMainPanel).addEventListener("click", (e) => {
        deleteCalories(e);
    })
    return {
        initialilze: function () {
            let emptyObj = {
                totalCalories: 0,
                totalAdded: 0,
                totalBurned: 0,
                remaining: 2300,
                percentage: 0,
            }
            AppUiCtr.displayFrontAppCalories(emptyObj);
            AppUiCtr.displayDate();
        }
    }
})(caloriesController, AppUiController);
mainController.initialilze();