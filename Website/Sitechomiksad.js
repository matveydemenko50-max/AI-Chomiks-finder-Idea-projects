// ===== ПЛАВНАЯ ПРОКРУТКА =====

// функция прокрутки к секции
function scrollToSection(id){

// находим элемент по id
const element = document.getElementById(id);

// плавно прокручиваем
element.scrollIntoView({
behavior:"smooth"
});

}


// ===== ПРИМЕР: МОЖНО ДОБАВИТЬ ЛОГИКУ =====

// здесь можно:
// - подключить игру
// - добавить анимации
// - добавить звук
// - добавить меню

console.log("Сайт Medieval Shooter загружен");
