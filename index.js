// --- Données Pokémon et Types ---
const POKEMONS = {
    tortank: {
        nom: 'Tortank', type: 'eau', image: 'images/tortank.jpg',
        attaques: [
                { nom: "Pistolet à O", puissance: 25, type: 'eau' },
                { nom: 'Morsure', puissance: 30, type: 'tenebres' },
                { nom: 'Charge', puissance: 20, type: 'normal' },
                { nom: "Uppercut", puissance: 35, type: 'combat' }
        ]
    },
    salameche: {
        nom: 'Salamèche', type: 'feu', image: 'images/levi.jpg',
        attaques: [
            { nom: 'Flammèche', puissance: 25, type: 'feu' },
            { nom: 'Griffe', puissance: 30, type: 'normal' },
            { nom: 'Rugissement', puissance: 0, type: 'statut', effet: 'atk-' },
            { nom: 'Brouillard', puissance: 0, type: 'statut', effet: 'prec-' }
        ]
    }
};

// Multiplicateurs d'efficacité (simplifié)
const TYPE_TABLE = {
    feu: { plante: 2, eau: 0.5, feu: 0.5 },
    eau: { feu: 2, plante: 0.5, eau: 0.5 },
    plante: { eau: 2, feu: 0.5, plante: 0.5 },
    normal: {},
    statut: {}
};

// --- Sélection éléments DOM ---
const overlay = document.getElementById('selection-overlay');
const pokemonOptions = document.querySelectorAll('.pokemon-option');
const logBox = document.getElementById('battle-log');

const imgGauche = document.getElementById('img-gauche-pokemon');
const imgDroite = document.getElementById('img-droite-pokemon');
const barGauche = document.getElementById('bar-gauche');
const barDroite = document.getElementById('bar-droite');
const hpLabelGauche = document.getElementById('hp-gauche-label');
const hpLabelDroite = document.getElementById('hp-droite-label');

const attaquesGauche = [...document.querySelectorAll('.attaque-gauche > div')];
const attaquesDroite = [...document.querySelectorAll('.attaque-droite > div')];

// --- Etat Combat ---
let joueur = null; // objet pokemon
let ennemi = null;
let hpGauche = 100;
let hpDroite = 100;

// --- Utilitaires ---
function log(messageHTML){
    const p = document.createElement('p');
    p.innerHTML = messageHTML;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

function calculMultiplicateur(typeAttaque, typeCible){
    return (TYPE_TABLE[typeAttaque] && TYPE_TABLE[typeAttaque][typeCible]) || 1;
}

function libelleEfficacite(mult){
    if(mult === 2) return '<span class="super-efficace">C\u2019est super efficace !</span>';
    if(mult === 0.5) return '<span class="pas-tres-efficace">Ce n\u2019est pas tr\u00e8s efficace...</span>';
    if(mult === 0) return '<span class="pas-tres-efficace">Sans effet...</span>';
    return '<span class="efficace">Efficacit\u00e9 normale.</span>';
}

function animeEntree(imgEl){
    imgEl.classList.remove('hidden');
    imgEl.classList.add('enter-from-ball');
    setTimeout(()=> imgEl.classList.remove('enter-from-ball'),1200);
}

function configAttaques(colonne, pokemon){
    const cont = colonne === 'gauche' ? attaquesGauche : attaquesDroite;
    cont.forEach((div,i)=>{
        const att = pokemon.attaques[i];
        if(!att){div.textContent='---';div.dataset.degat=0;div.dataset.type='normal';div.classList.add('disabled');return;}
        div.textContent = att.nom;
        div.dataset.degat = att.puissance;
        div.dataset.type = att.type;
    });
}

function finDePartie(message){
    log('<strong>'+message+'</strong>');
    // Désactive les attaques
    [...attaquesGauche,...attaquesDroite].forEach(b=> b.style.pointerEvents='none');
}

function attaque(sourceColonne, elementAttaque){
    const puissance = parseInt(elementAttaque.dataset.degat,10);
    const type = elementAttaque.dataset.type;
    const attaquant = sourceColonne === 'gauche' ? joueur : ennemi;
    const defenseur = sourceColonne === 'gauche' ? ennemi : joueur;
    const cibleBar = sourceColonne === 'gauche' ? barDroite : barGauche;
    let hpCible = sourceColonne === 'gauche' ? hpDroite : hpGauche;
    const cibleType = defenseur.type;

    const mult = calculMultiplicateur(type, cibleType);
    const degats = Math.round(puissance * mult);

    if(puissance > 0){
        hpCible = Math.max(0, hpCible - degats);
        cibleBar.value = hpCible;
        if(sourceColonne === 'gauche') hpDroite = hpCible; else hpGauche = hpCible;
            hpLabelGauche.textContent = `PV: ${hpGauche} / 100`;
            hpLabelDroite.textContent = `PV: ${hpDroite} / 100`;
    }

    const feedback = libelleEfficacite(mult);
    log(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.textContent}</em> inflige ${degats} dégâts. ${feedback}`);

    // Animation secousse
    const imgCible = sourceColonne === 'gauche' ? imgDroite.parentElement : imgGauche.parentElement;
    imgCible.classList.add(sourceColonne === 'gauche' ? 'img-gauche-anim':'img-droite-anim');
    setTimeout(()=> imgCible.classList.remove(sourceColonne === 'gauche' ? 'img-gauche-anim':'img-droite-anim'),600);

    if(hpCible <= 0){
        finDePartie(`${defenseur.nom} est K.O ! ${(attaquant === joueur)?'Tu gagnes !':'Tu perds...'}`);
    }
}

// --- Gestion sélection Pokémon ---
pokemonOptions.forEach(opt=>{
    opt.addEventListener('click',()=>{
        const key = opt.dataset.key;
        joueur = POKEMONS[key];
        // Choix ennemi = autre
        ennemi = Object.entries(POKEMONS).find(([k])=> k!==key)[1];

        // Configure images
        imgGauche.src = joueur.image;
        imgDroite.src = ennemi.image;

        // Configure attaques (côté droit on affiche celles de l'ennemi mais on désactive les clics manuels)
        configAttaques('gauche', joueur);
        configAttaques('droite', ennemi);

        overlay.style.display = 'none';
        animeEntree(imgGauche);
        setTimeout(()=> animeEntree(imgDroite),400);
        log(`<strong>Combat :</strong> ${joueur.nom} VS ${ennemi.nom}`);
    });
});

// --- Ajout écouteurs attaques joueur ---
attaquesGauche.forEach(div=>{
    div.addEventListener('click', function(){
        if(!joueur || hpDroite<=0 || hpGauche<=0) return;
        attaque('gauche', this);
        // Ennemi riposte (IA très simple = attaque aléatoire non nulle)
        if(hpDroite>0 && hpGauche>0){
            setTimeout(()=>{
                const candidates = ennemi.attaques.filter(a=> a.puissance>0);
                const choix = candidates[Math.floor(Math.random()*candidates.length)];
                // Trouver div correspondante côté droit (juste pour animation)
                const divAtt = attaquesDroite[ennemi.attaques.findIndex(a=> a.nom===choix.nom)];
                attaque('droite', divAtt);
            }, 650);
        }
    });
});

// Empêche le joueur de cliquer sur attaques droites
attaquesDroite.forEach(d=> d.style.pointerEvents='none');

// Initial log
log('Sélectionne un Pokémon pour commencer.');


