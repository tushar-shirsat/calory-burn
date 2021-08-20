
const closeBtn = document.getElementById("sliderCloseBtn");
const mainPanel = document.querySelector(".main_panle_box");
const form = document.querySelector(".showForm");
const exercise_slider= document.querySelector(".exercise_slider");
const food_slider= document.querySelector(".food_slider");
const add = document.getElementById("addBtn");
const food_calAdd = document.getElementById("food_calAdd");
const exercise_calAdd = document.getElementById("exercise_calAdd");

add.addEventListener('click',() =>{
    form.classList.toggle('close') ;
    form.classList.add('ani') ;
    // mainPanel.classList.add('close') ;
    exercise_slider.classList.add('close') ;
    food_slider.classList.add('close') ;
})

food_calAdd.addEventListener('click',() =>{
    form.classList.add('close') ;
    // mainPanel.classList.add('close') ;
    exercise_slider.classList.add('close') ;
    food_slider.classList.toggle('close') ;
    food_slider.classList.add('ani') ;
})

exercise_calAdd.addEventListener('click',() =>{
    form.classList.add('close') ;
    // mainPanel.classList.add('close') ;
    exercise_slider.classList.toggle('close') ;
    exercise_slider.classList.add('ani') ;
    food_slider.classList.add('close') ;
})

closeBtn.addEventListener('click',() =>{
    form.classList.add('close') ;
    // mainPanel.classList.remove('close') ;
    exercise_slider.classList.add('close') ;
    food_slider.classList.add('close') ;
})

document.querySelector(".showForm_add_btn").addEventListener('click',(e) =>{
    form.classList.add('close') ;
    // mainPanel.classList.remove('close') ;
})