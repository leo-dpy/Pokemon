// --- Données Pokémon et Types ---
const POKEMONS = {
  tortank: {
    nom: 'Tortank', type: 'eau', image: 'images/tortank.jpg', baseAtk: 48, baseDef: 65,
    attaques: [
      { nom: "Pistolet à O", puissance: 25, type: 'eau', precision: 100, pp: 25 },
      { nom: 'Morsure', puissance: 30, type: 'tenebres', precision: 95, pp: 15 },
      { nom: 'Charge', puissance: 20, type: 'normal', precision: 100, pp: 35 },
      { nom: 'Uppercut', puissance: 35, type: 'combat', precision: 90, pp: 10 }
    ]
  },
  leviator: {
    nom: 'Léviator', type: 'eau', image: 'images/levi.jpg', baseAtk: 70, baseDef: 60,
    mega: { nom: 'Méga-Léviator', type: 'eau', image: 'images/mega leviator.png', baseAtk: 95, baseDef: 90 },
    attaques: [
      { nom: 'Morsure', puissance: 30, type: 'tenebres', precision: 100, pp: 25 },
      { nom: 'Hydro-Queue', puissance: 35, type: 'eau', precision: 90, pp: 10 },
      { nom: 'Ouragan', puissance: 25, type: 'normal', precision: 95, pp: 15 },
      { nom: 'Danse Draco', puissance: 0, type: 'statut', effet: 'atk+', precision: 100, pp: 20 }
    ]
  },
  dragaufeu: {
    nom: 'Dracaufeu', type: 'feu', image: 'images/dragaufeu.png', baseAtk: 65, baseDef: 60,
    mega: { nom: 'Méga-Dracaufeu', type: 'feu', image: 'images/Mega dragaufeu.png', baseAtk: 90, baseDef: 85 },
    attaques: [
      { nom: 'Flammèche', puissance: 25, type: 'feu', precision: 100, pp: 25 },
      { nom: 'Nitrocharge', puissance: 15, type: 'feu', precision: 90, effet: 'leech', pp: 10 },
      { nom: 'Rugissement', puissance: 0, type: 'statut', effet: 'atk-', precision: 100, pp: 40 },
      { nom: 'Charge', puissance: 20, type: 'normal', precision: 100, pp: 35 }
    ]
  },
  pikachu: {
    nom: 'Pikachu', type: 'electrique', image: 'images/pikachu.png', baseAtk: 55, baseDef: 40,
    mega: { nom: 'Méga-Pikachu', type: 'electrique', image: 'images/mega_pikachu.jpg', baseAtk: 80, baseDef: 60 },
    attaques: [
      { nom: 'Morsure', puissance: 30, type: 'tenebres', precision: 100, pp: 25 },
      { nom: 'Queue de fer', puissance: 35, type: 'fer', precision: 90, pp: 10 },
      { nom: 'Ouragan', puissance: 25, type: 'normal', precision: 95, pp: 15 },
      { nom: 'Danse Draco', puissance: 0, type: 'statut', effet: 'atk+', precision: 100, pp: 20 }
    ]
  },
  mewtwo: {
    nom: 'Mewtwo', type: 'psychique', image: 'images/mewtwo.png', baseAtk: 70, baseDef: 60,
    mega: { nom: 'Méga-Mewtwo', type: 'psychique', image: 'images/mega_mewtwo.png', baseAtk: 95, baseDef: 90 },
    attaques: [
      { nom: 'Lance-Flammes', puissance: 35, type: 'feu', precision: 90, pp: 15 },
      { nom: 'Griffe', puissance: 30, type: 'normal', precision: 100, pp: 35 },
      { nom: 'Rugissement', puissance: 0, type: 'statut', effet: 'atk-', precision: 100, pp: 40 },
      { nom: 'Vol', puissance: 30, type: 'normal', precision: 95, pp: 15 }
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
const restartBtn = document.getElementById('restart-btn');

const imgGauche = document.getElementById('img-gauche-pokemon');
const imgDroite = document.getElementById('img-droite-pokemon');
const barGauche = document.getElementById('bar-gauche');
const barDroite = document.getElementById('bar-droite');
const hpLabelGauche = document.getElementById('hp-gauche-label');
const hpLabelDroite = document.getElementById('hp-droite-label');

const attaquesGauche = [...document.querySelectorAll('.attaque-gauche > div')];
const attaquesDroite = [...document.querySelectorAll('.attaque-droite > div')];

// --- Etat Combat ---
let joueur = null;
let ennemi = null;
let hpGauche = 100;
let hpDroite = 100;
let stats = {
  gauche: { atkStage: 0, defStage: 0, accStage: 0, evaStage: 0 },
  droite: { atkStage: 0, defStage: 0, accStage: 0, evaStage: 0 }
};
let ppState = { gauche: [], droite: [] };
let actionQueue = [];
let processing = false;
let combatTermine = false;

// Sons désactivés
function playTone(){}

const STAGE_MULT = [
  0.33, 0.4, 0.5, 0.66, 0.75, 0.85, 1,
  1.15, 1.3, 1.5, 1.7, 1.9, 2.1
];
function stageToMult(stage){
  const idx = Math.min(Math.max(stage+6,0),12);
  return STAGE_MULT[idx];
}

// --- Journal et file d'attente ---
function log(messageHTML){
  const p = document.createElement('p');
  p.innerHTML = messageHTML;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight;
}
function enqueue(messageHTML){
  actionQueue.push({messageHTML});
  processQueue();
}
function processQueue(){
  if(processing) return;
  if(actionQueue.length===0) return;
  processing = true;
  const {messageHTML} = actionQueue.shift();
  log(messageHTML);
  setTimeout(()=>{ processing=false; processQueue(); }, 550);
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
function updateHPBars(){
  const fillG = barGauche;
  const fillD = barDroite;
  fillG.style.width = hpGauche+'%';
  fillD.style.width = hpDroite+'%';
  [fillG,fillD].forEach(f=>{
    f.classList.remove('caution','danger');
    const val = parseInt(f.style.width,10);
    if(val <= 30) f.classList.add('danger'); else if(val <= 60) f.classList.add('caution');
  });
  hpLabelGauche.textContent = `PV: ${hpGauche} / 100`;
  hpLabelDroite.textContent = `PV: ${hpDroite} / 100`;
}
function animeEntree(imgEl){
  imgEl.classList.remove('hidden');
  imgEl.classList.add('enter-from-ball');
  setTimeout(()=> imgEl.classList.remove('enter-from-ball'),1200);
}
function popupDegats(cote, degats, crit=false){
  if(degats<=0) return;
  const container = cote==='gauche'? imgGauche.parentElement : imgDroite.parentElement;
  const rect = container.getBoundingClientRect();
  const pop = document.createElement('div');
  pop.className = 'dmg-pop'+(crit?' crit':'');
  pop.style.left = (rect.width/2)+'px';
  pop.style.top = '10px';
  pop.textContent = '-'+degats + (crit? '!':'');
  container.style.position='relative';
  container.appendChild(pop);
  setTimeout(()=> pop.remove(), 1100);
}
function majBadges(){
  const map = { atkStage:'ATK', defStage:'DEF', accStage:'PREC', evaStage:'ESQ' };
  const g = document.getElementById('badges-gauche');
  const d = document.getElementById('badges-droite');
  g.innerHTML=''; d.innerHTML='';
  Object.entries(map).forEach(([k,label])=>{
    const valG = stats.gauche[k];
    if(valG!==0){
      const b=document.createElement('div');
      b.className='stat-badge ' + (valG>0?'up':'down');
      b.textContent = label + (valG>0? '+'+valG: valG);
      g.appendChild(b);
    }
    const valD = stats.droite[k];
    if(valD!==0){
      const b=document.createElement('div');
      b.className='stat-badge ' + (valD>0?'up':'down');
      b.textContent = label + (valD>0? '+'+valD: valD);
      d.appendChild(b);
    }
  });
}

function configAttaques(colonne, pokemon){
  const cont = colonne === 'gauche' ? attaquesGauche : attaquesDroite;
  cont.forEach((div,i)=>{
    const att = pokemon.attaques[i];
    if(!att){div.textContent='---';div.dataset.degat=0;div.dataset.type='normal';div.classList.add('disabled');return;}
    div.textContent = att.nom;
    div.dataset.degat = att.puissance;
    div.dataset.type = att.type;
    if(att.precision) div.dataset.precision = att.precision;
    if(att.effet) div.dataset.effet = att.effet;
    if(att.pp){ div.dataset.pp = att.pp; div.dataset.pprestant = att.pp; div.title = `PP ${att.pp}/${att.pp}`; }
  });
}
function finDePartie(message){
  enqueue('<strong>'+message+'</strong>');
  [...attaquesGauche,...attaquesDroite].forEach(b=> b.style.pointerEvents='none');
  restartBtn.classList.remove('hidden');
  combatTermine = true;
}

function attaque(sourceColonne, elementAttaque){
  if(combatTermine) return;
  const puissance = parseInt(elementAttaque.dataset.degat,10);
  const type = elementAttaque.dataset.type;
  const precisionBase = parseInt(elementAttaque.dataset.precision || '100',10);
  const attaquant = sourceColonne === 'gauche' ? joueur : ennemi;
  const defenseur = sourceColonne === 'gauche' ? ennemi : joueur;
  let hpCible = sourceColonne === 'gauche' ? hpDroite : hpGauche;
  const cibleType = defenseur.type;
  const side = sourceColonne === 'gauche' ? 'gauche':'droite';
  const oppSide = sourceColonne === 'gauche' ? 'droite':'gauche';

  // PP
  let ppRestant = parseInt(elementAttaque.dataset.pprestant || '0',10);
  if(puissance>=0 && elementAttaque.dataset.pp){
    if(ppRestant<=0){
  enqueue(`<span class="type type-${type}">${type}</span>${attaquant.nom} n'a plus de PP pour ${elementAttaque.textContent}!`);
      return;
    }
    ppRestant -= 1; elementAttaque.dataset.pprestant = ppRestant;
    elementAttaque.title = `PP ${ppRestant}/${elementAttaque.dataset.pp}`;
    if(ppRestant===0) elementAttaque.style.opacity=.35;
  }

  // Précision
  const accMult = stageToMult(stats[side].accStage);
  const evaMult = stageToMult(stats[oppSide].evaStage);
  const precisionEffective = Math.min(100, Math.max(1, Math.round(precisionBase * accMult / evaMult)));
  if(Math.random()*100 > precisionEffective){
  enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.textContent}</em> mais échoue ! (Précision ${precisionEffective}%)`);
    return;
  }

  const mult = calculMultiplicateur(type, cibleType);
  let degats = 0; let critique = false;
  if(puissance > 0){
    const atkStat = attaquant.baseAtk * stageToMult(stats[side].atkStage);
    const defStat = defenseur.baseDef * stageToMult(stats[oppSide].defStage);
  // Augmentation dégâts: multiplier base par 1.8
  const base = (atkStat / defStat) * (puissance / 10) * 1.8;
    const variance = 0.85 + Math.random()*0.15;
    critique = Math.random() < 0.0625; // 6.25%
    const critMult = critique ? 1.5 : 1;
    degats = Math.max(1, Math.round(base * mult * variance * critMult));
  }

  if(puissance > 0){
    hpCible = Math.max(0, hpCible - degats);
    if(sourceColonne === 'gauche') hpDroite = hpCible; else hpGauche = hpCible;
    updateHPBars();
  }
  let feedback = '';
  if(puissance>0) feedback = libelleEfficacite(mult);

  if(type==='statut' && elementAttaque.dataset.effet){
    const effet = elementAttaque.dataset.effet;
    let texteEffet='';
    if(effet==='atk-'){
      stats[oppSide].atkStage = Math.max(stats[oppSide].atkStage -1, -6);
      texteEffet = `${defenseur.nom} voit son Attaque baisser !`;
    } else if(effet==='prec-'){
      stats[oppSide].evaStage = Math.min(stats[oppSide].evaStage +1, 6);
      texteEffet = `${defenseur.nom} est enveloppé de fumée ! Esquive augmentée.`;
    }
    majBadges();
  enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> lance <em>${elementAttaque.textContent}</em>. ${texteEffet}`);
  } else {
    popupDegats(oppSide, degats, critique);
    let critTxt = critique ? ' <span class="super-efficace">Coup critique !</span>' : '';
  enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.textContent}</em> inflige ${degats} dégâts. ${feedback}${critTxt}`);
    if(elementAttaque.dataset.effet==='leech' && degats>0){
      const avant = side==='gauche'? hpGauche: hpDroite;
      const soin = Math.min(100 - avant, Math.max(1, Math.round(degats*0.5)));
      if(soin>0){
        if(side==='gauche') hpGauche += soin; else hpDroite += soin;
  enqueue(`<em>${attaquant.nom} récupère ${soin} PV !</em>`);
        updateHPBars();
      }
    }
  }

  const imgCible = sourceColonne === 'gauche' ? imgDroite.parentElement : imgGauche.parentElement;
  imgCible.classList.add(sourceColonne === 'gauche' ? 'img-gauche-anim':'img-droite-anim');
  setTimeout(()=> imgCible.classList.remove(sourceColonne === 'gauche' ? 'img-gauche-anim':'img-droite-anim'),600);

  if(hpCible <= 0){
    finDePartie(`${defenseur.nom} est K.O ! ${(attaquant === joueur)?'Tu gagnes !':'Tu perds...'}`);
  }
}

// Suppression système de projectiles et secousses


// --- Sélection ---
pokemonOptions.forEach(opt=>{
  opt.addEventListener('click',()=>{
    const key = opt.dataset.key;
    joueur = POKEMONS[key];
    const autres = Object.entries(POKEMONS).filter(([k])=> k!==key).map(e=> e[1]);
    ennemi = autres[Math.floor(Math.random()*autres.length)];

    imgGauche.src = joueur.image;
    imgDroite.src = ennemi.image;

    configAttaques('gauche', joueur);
    configAttaques('droite', ennemi);
    ppState.gauche = joueur.attaques.map(a=> a.pp || 0);
    ppState.droite = ennemi.attaques.map(a=> a.pp || 0);

    overlay.style.display = 'none';
    animeEntree(imgGauche);
    setTimeout(()=> animeEntree(imgDroite),400);
  enqueue(`<strong>Combat :</strong> ${joueur.nom} VS ${ennemi.nom}`);
    updateHPBars();
    majBadges();
  });
});

// Attaques joueur
attaquesGauche.forEach(div=>{
  div.addEventListener('click', function(){
    if(!joueur || hpDroite<=0 || hpGauche<=0) return;
    attaque('gauche', this);
    if(hpDroite>0 && hpGauche>0){
      setTimeout(()=>{
        const candidates = ennemi.attaques.filter(a=> a.puissance>0 || a.type==='statut');
        const choix = candidates[Math.floor(Math.random()*candidates.length)];
        const divAtt = attaquesDroite[ennemi.attaques.findIndex(a=> a.nom===choix.nom)];
        attaque('droite', divAtt);
      }, 650);
    }
  });
});

attaquesDroite.forEach(d=> d.style.pointerEvents='none');

enqueue('Sélectionne un Pokémon pour commencer.');

restartBtn.addEventListener('click', ()=> {
  if(combatTermine){
    enqueue('<em>Tu prends la fuite ! Le combat est terminé.</em>');
  } else {
    combatTermine = true;
    enqueue('<em>Tu fuis le combat !</em>');
  }
  [...attaquesGauche,...attaquesDroite].forEach(b=> b.style.pointerEvents='none');
});

// (Redéfinitions leviator / dracaufeu supprimées – déjà intégrées dans l'objet POKEMONS initial)

const megaBtn = document.getElementById('mega-btn');
let megaDisponible = true;
let megaUtilisee = false;

function appliquerMega(pokemon, cote){
  if(!pokemon.mega) return;
  const isJoueur = cote==='gauche';
  const imgEl = isJoueur ? imgGauche : imgDroite;
  // Animation
  imgEl.classList.add('mega-flash');
  setTimeout(()=>{
    imgEl.classList.remove('mega-flash');
    imgEl.classList.add('mega-aura');
  },1200);
  // Mise à jour des stats et nom
  pokemon.nom = pokemon.mega.nom;
  pokemon.type = pokemon.mega.type;
  pokemon.baseAtk = pokemon.mega.baseAtk;
  pokemon.baseDef = pokemon.mega.baseDef;
  imgEl.src = pokemon.mega.image;
  enqueue(`<strong>${pokemon.nom}</strong> méga-évolue ! Puissance accrue !`);
  // Boost léger de stages
  if(isJoueur){
    stats.gauche.atkStage = Math.min(stats.gauche.atkStage+1,6);
    stats.gauche.defStage = Math.min(stats.gauche.defStage+1,6);
  } else {
    stats.droite.atkStage = Math.min(stats.droite.atkStage+1,6);
    stats.droite.defStage = Math.min(stats.droite.defStage+1,6);
  }
  majBadges();
}

megaBtn.addEventListener('click', ()=>{
  if(!joueur || megaUtilisee || !joueur.mega) return;
  megaUtilisee = true;
  megaBtn.classList.add('hidden');
  appliquerMega(joueur, 'gauche');
});

// Surcharge fonction configAttaques pour gérer nouveaux effets
const oldConfigAttaques = configAttaques;
configAttaques = function(colonne, pokemon){
  oldConfigAttaques(colonne, pokemon);
};

// Etendre effets dans attaque
const oldAttaque = attaque;
attaque = function(sourceColonne, elementAttaque){
  oldAttaque(sourceColonne, elementAttaque);
};

// Extension effets statut dans la fonction attaque existante (ré-édition légère)
// On va monkey patcher la logique sans tout réécrire :
// Ajout nouvel effet atk+ (Danse Draco)
// Ajout déclenchement automatique méga ennemi à 50% PV si disponible

// Observer le log queue pour appliquer patch dynamique après chaque action
function afterAction(){
  if(!megaUtilisee && joueur && joueur.mega){ megaBtn.classList.remove('hidden'); }
  // Méga auto ennemi si PV <= 50 et pas encore méga et possède mega
  if(ennemi && ennemi.mega && !ennemi.__mega && hpDroite <= 50){
    ennemi.__mega = true;
    appliquerMega(ennemi, 'droite');
  }
}

// Hook processQueue pour afterAction
const originalProcessQueue = processQueue;
processQueue = function(){
  originalProcessQueue();
  if(!processing) afterAction();
};

// Patch supplémentaire pour inclure effets atk+
const originalEnqueue = enqueue;
enqueue = function(messageHTML){
  originalEnqueue(messageHTML.replace('atk+', ''));
};

// Mutation de la fonction finDePartie pour masquer bouton méga si fin
const oldFin = finDePartie;
finDePartie = function(message){
  oldFin(message);
  megaBtn.classList.add('hidden');
};

// Ajout fonctions supplémentaires méga
function setTypes(pokemon, types){ pokemon.types = types; }
setTypes(POKEMONS.tortank, ['eau']);
setTypes(POKEMONS.leviator, ['eau']);
setTypes(POKEMONS.dragaufeu, ['feu']);
setTypes(POKEMONS.pikachu, ['electrique']);
setTypes(POKEMONS.mewtwo, ['psychique']);
// Ajout types méga multiples
POKEMONS.leviator.mega.types = ['eau','tenebres'];
POKEMONS.dragaufeu.mega.types = ['feu','dragon'];

// Attaques post-méga (remplacement)
const MEGA_NEW_ATTACKS = {
  'Méga-Léviator': [
    { nom:'Mâchouille', puissance:40, type:'tenebres', precision:100, pp:15 },
    { nom:'Cascade', puissance:40, type:'eau', precision:95, pp:15 },
    { nom:'Séisme', puissance:45, type:'normal', precision:90, pp:10 },
    { nom:'Danse Draco', puissance:0, type:'statut', effet:'atk+', precision: 100, pp: 20 }
  ],
  'Méga-Dracaufeu': [
    { nom:'Déflagration', puissance:50, type:'feu', precision:85, pp:5 },
    { nom:'Draco-Griffe', puissance:40, type:'dragon', precision:100, pp:15 },
    { nom:'Lance-Flammes', puissance:35, type:'feu', precision:95, pp:15 },
    { nom:'Vol', puissance:30, type:'normal', precision:95, pp:15 }
  ]
};

// Mettre à jour calcul multiplicateur pour double type
const originalCalculMult = calculMultiplicateur;
calculMultiplicateur = function(typeAttaque, typeCible){
  if(Array.isArray(typeCible)){
    return typeCible.reduce((acc,t)=> acc * ((TYPE_TABLE[typeAttaque] && TYPE_TABLE[typeAttaque][t]) || 1),1);
  }
  return originalCalculMult(typeAttaque, typeCible);
};

// Injection du badge MEGA dans afterAction
const oldAfterAction = afterAction;
function afterAction(){
  if(oldAfterAction) oldAfterAction();
  // Afficher badge MEGA pour formes méga
  if(joueur && joueur.nom.startsWith('Méga-')){
    let cont = document.getElementById('badges-gauche');
    if(!cont.querySelector('.badge-mega')){
      const b=document.createElement('div');b.className='badge-mega';b.textContent='MEGA';cont.prepend(b);
    }
  }
  if(ennemi && ennemi.nom.startsWith('Méga-')){
    let cont = document.getElementById('badges-droite');
    if(!cont.querySelector('.badge-mega')){
      const b=document.createElement('div');b.className='badge-mega';b.textContent='MEGA';cont.prepend(b);
    }
  }
}
// Remplacer référence
window.afterAction = afterAction;

// Amélioration appliquerMega pour remplacement attaques + boosts progressifs
const oldAppliquerMega = appliquerMega;
appliquerMega = function(pokemon, cote){
  oldAppliquerMega(pokemon, cote);
  // Remplacer attaques si liste spéciale
  if(MEGA_NEW_ATTACKS[pokemon.nom]){
    pokemon.attaques = MEGA_NEW_ATTACKS[pokemon.nom];
    configAttaques(cote==='gauche'?'gauche':'droite', pokemon);
  }
  // Boosts progressifs sur 3 pulses
  let step = 0;
  const interval = setInterval(()=>{
    if(step===0){ if(cote==='gauche') stats.gauche.atkStage = Math.min(stats.gauche.atkStage+1,6); else stats.droite.atkStage = Math.min(stats.droite.atkStage+1,6); }
    if(step===1){ if(cote==='gauche') stats.gauche.defStage = Math.min(stats.gauche.defStage+1,6); else stats.droite.defStage = Math.min(stats.droite.defStage+1,6); }
    if(step===2){ if(cote==='gauche') stats.gauche.accStage = Math.min(stats.gauche.accStage+1,6); else stats.droite.accStage = Math.min(stats.droite.accStage+1,6); }
    majBadges();
    step++;
    if(step>2) clearInterval(interval);
  }, 600);
  enqueue(`<div class='mega-log'><em>La puissance de ${pokemon.nom} monte en flèche !</em></div>`);
};


