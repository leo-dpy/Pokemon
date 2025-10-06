let atk1 = document.querySelector('.attaque1-droite');
let atk2 = document.querySelector('.attaque2-droite');
let atk3 = document.querySelector('.attaque3-droite');
let atk4 = document.querySelector('.attaque4-droite');

let atq1 = document.querySelector('.attaque1-gauche');
let atq2 = document.querySelector('.attaque2-gauche');
let atq3 = document.querySelector('.attaque3-gauche');
let atq4 = document.querySelector('.attaque4-gauche');

let progressbar1 = document.querySelector('#bar-gauche');
let progressbar2 = document.querySelector('#bar-droite');

let imgdroite = document.querySelector('.img-droite');
let imggauche = document.querySelector('.img-gauche');

let PVPokemonGauche = 100;
let PVPokemonDroite = 100;

function updateHP1(){
    PVPokemonDroite -= this.getAttribute('data-degat')
    progressbar1.value -= this.getAttribute('data-degat');
    imggauche.classList.add('img-droite-anim');
    let timeout = setTimeout(function(){    imggauche.classList.remove('img-droite-anim');    }, 2000);
    if (PVPokemonDroite <= 0){
        alert ("Le pokémon de Gauche est K.O");
    } else {
        alert("Il reste " + PVPokemonDroite + "HP à l'ennemi")
    }
}

function updateHP2(){
    PVPokemonGauche -= this.getAttribute('data-degat')
    progressbar2.value -= this.getAttribute('data-degat');
    imgdroite.classList.add('img-gauche-anim');
    let timeout = setTimeout(function(){    imgdroite.classList.remove('img-gauche-anim');    }, 2000);
    if (PVPokemonGauche <= 0){
        alert ("Le pokémon de Droite est K.O");
    } else {
        alert("Il reste " + PVPokemonGauche + "HP à l'ennemi")
    }
}


atk1.addEventListener('click',updateHP1);
atk2.addEventListener('click',updateHP1);
atk3.addEventListener('click',updateHP1);
atk4.addEventListener('click',updateHP1);

atq1.addEventListener('click',updateHP2);
atq2.addEventListener('click',updateHP2);
atq3.addEventListener('click',updateHP2);
atq4.addEventListener('click',updateHP2);


