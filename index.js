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
  salameche: {
    nom: 'Salamèche', type: 'feu', image: 'images/levi.jpg', baseAtk: 52, baseDef: 43,
    attaques: [
      { nom: 'Flammèche', puissance: 25, type: 'feu', precision: 100, pp: 25 },
      { nom: 'Griffe', puissance: 30, type: 'normal', precision: 100, pp: 35 },
      { nom: 'Rugissement', puissance: 0, type: 'statut', effet: 'atk-', precision: 100, pp: 40 },
      { nom: 'Brouillard', puissance: 0, type: 'statut', effet: 'prec-', precision: 85, pp: 20 }
    ]
  },
  bulbizarre: {
    nom: 'Bulbizarre', type: 'plante', image: 'images/tortank.jpg', baseAtk: 49, baseDef: 49,
    attaques: [
      { nom: 'Fouet Lianes', puissance: 25, type: 'plante', precision: 100, pp: 25 },
      { nom: 'Vampigraine', puissance: 15, type: 'plante', precision: 90, effet: 'leech', pp: 10 },
      { nom: 'Rugissement', puissance: 0, type: 'statut', effet: 'atk-', precision: 100, pp: 40 },
      { nom: 'Charge', puissance: 20, type: 'normal', precision: 100, pp: 35 }
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

// Audio minimaliste via Web Audio
let audioCtx;
function playTone(freq=440, duration=0.15, type='sine', volume=0.2){
  try {
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) { /* silence */ }
}

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
function enqueue(messageHTML, sound){
  actionQueue.push({messageHTML, sound});
  processQueue();
}
function processQueue(){
  if(processing) return;
  if(actionQueue.length===0) return;
  processing = true;
  const {messageHTML, sound} = actionQueue.shift();
  log(messageHTML);
  if(sound) sound();
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
  enqueue('<strong>'+message+'</strong>', ()=> playTone(220,0.3,'sawtooth',0.25));
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
      enqueue(`<span class="type type-${type}">${type}</span>${attaquant.nom} n'a plus de PP pour ${elementAttaque.textContent}!`, ()=> playTone(120,0.15,'square'));
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
    enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.textContent}</em> mais échoue ! (Précision ${precisionEffective}%)`, ()=> playTone(140,0.12,'square'));
    return;
  }

  const mult = calculMultiplicateur(type, cibleType);
  let degats = 0; let critique = false;
  if(puissance > 0){
    const atkStat = attaquant.baseAtk * stageToMult(stats[side].atkStage);
    const defStat = defenseur.baseDef * stageToMult(stats[oppSide].defStage);
    const base = (atkStat / defStat) * (puissance / 10);
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
    enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> lance <em>${elementAttaque.textContent}</em>. ${texteEffet}`, ()=> playTone(310,0.15,'triangle'));
  } else {
    popupDegats(oppSide, degats, critique);
    let critTxt = critique ? ' <span class="super-efficace">Coup critique !</span>' : '';
    enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.textContent}</em> inflige ${degats} dégâts. ${feedback}${critTxt}`, ()=> playTone(520,0.12,'sine'));
    if(elementAttaque.dataset.effet==='leech' && degats>0){
      const avant = side==='gauche'? hpGauche: hpDroite;
      const soin = Math.min(100 - avant, Math.max(1, Math.round(degats*0.5)));
      if(soin>0){
        if(side==='gauche') hpGauche += soin; else hpDroite += soin;
        enqueue(`<em>${attaquant.nom} récupère ${soin} PV !</em>`, ()=> playTone(660,0.2,'triangle',0.15));
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
    enqueue(`<strong>Combat :</strong> ${joueur.nom} VS ${ennemi.nom}`, ()=> playTone(600,0.25,'square',0.15));
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

restartBtn.addEventListener('click', ()=> location.reload());


