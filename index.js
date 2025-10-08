// --- Données Pokémon et Types ---
const POKEMONS = {
  tortank: {
    nom: 'Tortank', type: 'eau', image: 'images/tortank.jpg', baseAtk: 48, baseDef: 65,
    mega: { nom: 'Méga-Tortank', type: 'eau', image: 'images/mega tortank.png', baseAtk: 70, baseDef: 90 },
    attaques: [
      { nom: 'Pistolet à O', puissance: 25, type: 'eau', precision: 100, pp: 30 },
      { nom: 'Cascade', puissance: 40, type: 'eau', precision: 95, pp: 15 },
      { nom: 'Hydrocanon', puissance: 55, type: 'eau', precision: 75, pp: 5 },
      { nom: 'Voile Aqua', puissance: 0, type: 'statut', effet: 'atk+', precision: 100, pp: 15 }
    ]
  },
  leviator: {
    nom: 'Léviator', type: 'eau', image: 'images/leviator.png', baseAtk: 70, baseDef: 60,
    mega: { nom: 'Méga-Léviator', type: 'eau', image: 'images/mega leviator.png', baseAtk: 95, baseDef: 90 },
    attaques: [
      { nom: 'Pistolet à O', puissance: 25, type: 'eau', precision: 100, pp: 30 },
      { nom: 'Hydro-Queue', puissance: 40, type: 'eau', precision: 90, pp: 10 },
      { nom: 'Cascade', puissance: 45, type: 'eau', precision: 95, pp: 15 },
      { nom: 'Danse Draco', puissance: 0, type: 'statut', effet: 'atk+', precision: 100, pp: 20 }
    ]
  },
  dragaufeu: {
    nom: 'Dracaufeu', type: 'feu', image: 'images/dragaufeu.png', baseAtk: 65, baseDef: 60,
    mega: { nom: 'Méga-Dracaufeu', type: 'feu', image: 'images/Mega dragaufeu.png', baseAtk: 90, baseDef: 85 },
    attaques: [
      { nom: 'Flammèche', puissance: 25, type: 'feu', precision: 100, pp: 30 },
      { nom: 'Lance-Flammes', puissance: 40, type: 'feu', precision: 90, pp: 15 },
      { nom: 'Nitrocharge', puissance: 20, type: 'feu', precision: 95, effet: 'leech', pp: 10 },
      { nom: 'Danse Flamme', puissance: 30, type: 'feu', precision: 85, pp: 15 }
    ]
  },
  pikachu: {
    nom: 'Pikachu', type: 'electrique', image: 'images/pikachu.png', baseAtk: 55, baseDef: 40,
    gigamax: { nom: 'Pikachu Gigamax', type: 'electrique', image: 'images/pikachu gigamax.png', baseAtk: 85, baseDef: 55 },
    attaques: [
      { nom: 'Éclair', puissance: 25, type: 'electrique', precision: 100, pp: 30 },
      { nom: 'Étincelle', puissance: 30, type: 'electrique', precision: 100, pp: 20 },
      { nom: 'Tonnerre', puissance: 45, type: 'electrique', precision: 85, pp: 10 },
      { nom: 'Charge Statik', puissance: 0, type: 'statut', effet: 'atk+', precision: 100, pp: 25 }
    ]
  },
  mewtwo: {
    nom: 'Mewtwo', type: 'psychique', image: 'images/mewtwo.png', baseAtk: 70, baseDef: 60,
    // Correction du chemin image méga (fichier réel: 'mega mewtwo.png')
    mega: { nom: 'Méga-Mewtwo', type: 'psychique', image: 'images/mega mewtwo.png', baseAtk: 95, baseDef: 95 },
    attaques: [
      { nom: 'Choc Mental', puissance: 30, type: 'psychique', precision: 100, pp: 30 },
      { nom: 'Psyko', puissance: 50, type: 'psychique', precision: 85, pp: 10 },
      { nom: 'Onde Psy', puissance: 35, type: 'psychique', precision: 95, pp: 15 },
      { nom: 'Plénitude', puissance: 0, type: 'statut', effet: 'atk+', precision: 100, pp: 20 }
    ]
  },
  ectoplasma: {
    nom: 'Ectoplasma', type: 'spectre', image: 'images/ectoplasma.png', baseAtk: 65, baseDef: 60,
    mega: { nom: 'Méga-Ectoplasma', type: 'spectre', image: 'images/mega ectoplasma.png', baseAtk: 90, baseDef: 85 },
    attaques: [
      { nom: 'Léchouille', puissance: 30, type: 'spectre', precision: 100, pp: 30 },
      { nom: 'Ball\'Ombre', puissance: 45, type: 'spectre', precision: 85, pp: 15 },
      { nom: 'Onde Folie', puissance: 0, type: 'statut', effet: 'atk-', precision: 90, pp: 10 },
      { nom: 'Hypnose', puissance: 0, type: 'statut', effet: 'prec-', precision: 60, pp: 20 }
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
const nameGaucheSpan = document.getElementById('name-gauche');
const nameDroiteSpan = document.getElementById('name-droite');
const barGauche = document.getElementById('bar-gauche');
const barDroite = document.getElementById('bar-droite');
const barGaucheGhost = document.getElementById('bar-gauche-ghost');
const barDroiteGhost = document.getElementById('bar-droite-ghost');
const hpLabelGauche = document.getElementById('hp-gauche-label');
const hpLabelDroite = document.getElementById('hp-droite-label');
// Overlay fin de combat
const endOverlay = document.getElementById('end-overlay');
const endMessage = document.getElementById('end-message');
const returnMenuBtn = document.getElementById('return-menu-btn');
// Bouton méga inline
const megaBtn = document.getElementById('mega-panel-btn');
const menuBtn = document.getElementById('menu-btn');
const gigamaxBtn = document.getElementById('gigamax-panel-btn');
const bagBtn = document.getElementById('bag-btn');
const bagOverlay = document.getElementById('bag-overlay');
const bagItemsContainer = document.getElementById('bag-items');
const closeBagBtn = document.getElementById('close-bag-btn');
const bagInfo = document.getElementById('bag-info');
const shopBtn = document.getElementById('shop-btn');
const shopOverlay = document.getElementById('shop-overlay');
const shopItemsContainer = document.getElementById('shop-items');
const closeShopBtn = document.getElementById('close-shop-btn');
const shopInfo = document.getElementById('shop-info');
const shopCurrencyAmount = document.getElementById('shop-currency-amount');
// Conteneur liste sélection (pour ajouter les Pokémon capturés)
const pokemonListContainer = document.querySelector('.pokemon-list');

const attaquesGauche = [...document.querySelectorAll('.attaque-gauche > div')];
const attaquesDroite = [...document.querySelectorAll('.attaque-droite > div')];
// Indicateur de tour supprimé volontairement

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
let tour = 1;
let phase = 'player'; // 'player' ou 'enemy'
// Indicateur global de mode sélection PP (empêche lancement d'attaque)
let ppSelectionActive = false;

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
  // Ajouter animation si message K.O
  const plain = p.textContent || '';
  // Plus de détection spécifique K.O. (supprimé sur demande)
  logBox.appendChild(p);
  // Ne conserver que les 2 dernières lignes
  while(logBox.children.length > 2){
    logBox.removeChild(logBox.firstChild);
  }
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
  setTimeout(()=>{ 
    processing=false; 
    // Appeler afterAction après l'affichage d'un message
    if(typeof afterAction === 'function') {
      try { afterAction(); } catch(e){ console.warn('afterAction error', e); }
    }
    processQueue(); 
  }, 550);
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
function updateHPBars(options={}){
  const { healSide=null } = options;
  const apply = (live, ghost, value, side)=>{
    // Largeur live immédiate
    live.style.width = value+'%';
    // Ghost suit plus lentement uniquement si on perd des PV
    const prev = parseInt(ghost.style.width||'100',10);
    if(value < prev){
      ghost.style.width = value+'%';
    } else if(value > prev){
      // Gain de PV: élargir ghost d'abord puis live (déjà fait) => re-synchroniser après petit délai
      setTimeout(()=>{ ghost.style.width = value+'%'; }, 350);
    }
    // Classes d'état
    [live,ghost].forEach(el=>{ el.classList.remove('caution','danger'); });
    if(value <= 30){ live.classList.add('danger'); ghost.classList.add('danger'); }
    else if(value <= 60){ live.classList.add('caution'); ghost.classList.add('caution'); }
    // Stripes si haute vie
    if(value > 60) live.classList.add('striped'); else live.classList.remove('striped');
    // Effet de soin ponctuel
    if(healSide === side){
      live.classList.add('heal-glow');
      setTimeout(()=> live.classList.remove('heal-glow'), 950);
    }
  };
  apply(barGauche, barGaucheGhost, hpGauche, 'gauche');
  apply(barDroite, barDroiteGhost, hpDroite, 'droite');
  hpLabelGauche.textContent = `PV: ${hpGauche} / 100`;
  hpLabelDroite.textContent = `PV: ${hpDroite} / 100`;
}

function majIndicateurTour(){ /* indicateur supprimé */ }

function verrouillerAttaques(lock){
  attaquesGauche.forEach(div=>{
    div.style.pointerEvents = lock? 'none':'auto';
    div.style.opacity = lock? .55 : '';
  });
}
function animeEntree(imgEl){
  imgEl.classList.remove('hidden');
  imgEl.classList.add('enter-from-ball');
  setTimeout(()=> imgEl.classList.remove('enter-from-ball'),1200);
}
// Nouvelle animation de lancement de Pokéball
function throwPokeball(imgEl){
  // Nettoyer état précédent
  imgEl.classList.add('hidden');
  imgEl.classList.remove('spawn');
  const parent = imgEl.parentElement;
  if(!parent) return;
  // Créer la pokéball animée
  const ball = document.createElement('div');
  ball.className = 'throwball';
  parent.appendChild(ball);
  // Ouvrir la ball puis afficher le Pokémon
  setTimeout(()=>{
    ball.classList.add('open');
    ball.classList.add('flash');
    imgEl.classList.remove('hidden');
    imgEl.classList.add('spawn');
  }, 650);
  // Retirer la ball après animation
  setTimeout(()=>{
    ball.remove();
  }, 1300);
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
    const valG = stats.gauche[k] || 0;
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
    if(!att){
      div.textContent='---';
      div.dataset.degat=0;div.dataset.type='normal';
      div.removeAttribute('data-precision');
      div.removeAttribute('data-effet');
      div.removeAttribute('data-pp');
      div.removeAttribute('data-pprestant');
      div.removeAttribute('data-originalname');
      div.classList.add('disabled');
      return;
    }
    div.classList.remove('disabled');
    div.dataset.originalname = att.nom;
    div.dataset.degat = att.puissance;
    div.dataset.type = att.type;
    if(att.precision) div.dataset.precision = att.precision; else div.removeAttribute('data-precision');
    if(att.effet) div.dataset.effet = att.effet; else div.removeAttribute('data-effet');
    if(att.pp){
      div.dataset.pp = att.pp;
      // Si on reconfigure (après méga/gigamax) conserver pprest si déjà là sinon reset
      if(!div.dataset.pprestant || parseInt(div.dataset.pprestant,10) > att.pp){
        div.dataset.pprestant = att.pp;
      }
      div.title = `PP ${div.dataset.pprestant}/${att.pp}`;
    } else {
      div.removeAttribute('data-pp');
      div.removeAttribute('data-pprestant');
      div.title = att.nom;
    }
    if(att.puissance === 0){ div.classList.add('is-status'); } else { div.classList.remove('is-status'); }
    // Mise à jour libellé formaté
  div.innerHTML = formaterLibelleAttaque(div);
  appliquerColorationDegats(div);
  });
}

function formaterLibelleAttaque(div){
  const nom = div.dataset.originalname || div.textContent || '---';
  const puissanceBrute = parseInt(div.dataset.degat || '0',10);
  const estStatus = puissanceBrute<=0;
  const ppTotal = div.dataset.pp;
  const ppRest = div.dataset.pprestant;
  let blocPP = '';
  if(ppTotal){ blocPP = `${ppRest}/${ppTotal}`; }
  let predTxt = '—';
  if(!estStatus){
    const side = attaquesGauche.includes(div)? 'gauche':'droite';
    const attaquant = side==='gauche'? joueur : ennemi;
    const defenseur = side==='gauche'? ennemi : joueur;
    if(attaquant && defenseur){
      const atkStat = attaquant.baseAtk * stageToMult(stats[side].atkStage);
      const defStat = defenseur.baseDef * stageToMult(stats[side==='gauche'?'droite':'gauche'].defStage);
  // Facteur global d'équilibrage des dégâts (augmenté de 1.8 à 2.1)
  let base = (atkStat / defStat) * (puissanceBrute / 10) * 2.1;
      const cibleType = defenseur.types || defenseur.type;
      const multType = calculMultiplicateur(div.dataset.type, cibleType);
      base *= multType;
      const min = Math.max(1, Math.round(base * 0.85));
      const max = Math.max(1, Math.round(base));
      predTxt = min===max? `${max}` : `${min}-${max}`;
      div.dataset.predmindmg = min;
      div.dataset.predmaxdmg = max;
    } else {
      predTxt = puissanceBrute>0? puissanceBrute.toString():'—';
      div.dataset.predmindmg = puissanceBrute;
      div.dataset.predmaxdmg = puissanceBrute;
    }
  } else {
    delete div.dataset.predmindmg; delete div.dataset.predmaxdmg;
  }
  return `\n    <div class="attk-wrapper">\n      <div class="attk-line">\n        <span class="attk-name">${nom}</span>\n      </div>\n      <div class="attk-meta">\n        <span class="attk-dmg" data-dmg="${estStatus? '-': div.dataset.predmaxdmg || puissanceBrute}">${predTxt} dmg</span>\n        <span class="attk-sep">•</span>\n        <span class="attk-pp">${blocPP? blocPP+' PP':'∞'}</span>\n      </div>\n    </div>\n  `;
}

function majLibelleAttaque(div){
  if(!div || !div.dataset) return;
  if(div.dataset.pp){ div.title = `PP ${div.dataset.pprestant}/${div.dataset.pp}`; }
  div.innerHTML = formaterLibelleAttaque(div);
  appliquerColorationDegats(div);
}

function appliquerColorationDegats(div){
  const dmgSpan = div.querySelector('.attk-dmg');
  if(!dmgSpan) return;
  const val = parseInt(div.dataset.predmaxdmg || dmgSpan.dataset.dmg || '0',10);
  dmgSpan.classList.remove('dmg-low','dmg-mid','dmg-high');
  if(isNaN(val) || val<=0){ return; }
  if(val < 20) dmgSpan.classList.add('dmg-low');
  else if(val < 40) dmgSpan.classList.add('dmg-mid');
  else dmgSpan.classList.add('dmg-high');
}

function updateDisplayedDamages(){
  [...attaquesGauche, ...attaquesDroite].forEach(div=>{
    if(div.dataset && div.dataset.degat){
      div.innerHTML = formaterLibelleAttaque(div) || '';
      appliquerColorationDegats(div);
    }
  });
}
function finDePartie(message){
  // Ne plus afficher ni journaliser la phrase K.O., seulement proposer le retour
  [...attaquesGauche,...attaquesDroite].forEach(b=> b.style.pointerEvents='none');
  restartBtn.classList.remove('hidden');
  combatTermine = true;
  
  // Récompense en PokéPièces si victoire
  if(message.includes('Tu gagnes')){
    const recompense = Math.floor(Math.random() * 20) + 15; // 15-34 PokéPièces
    pokepieces += recompense;
    enqueue(`<em style="color: #ffcb05;">+${recompense} PokéPièces gagnées !</em>`);
    updateShopCurrency();
  }
  
  if(endMessage){
    endMessage.style.display = 'block';
    endMessage.classList.remove('win','lose');
    if(message.includes('Tu gagnes')){
      endMessage.textContent = 'LE POKÉMON ENNEMI EST K.O';
      endMessage.classList.add('win');
    } else if(message.includes('Tu perds')){
      endMessage.textContent = 'VOTRE POKÉMON EST K.O';
      endMessage.classList.add('lose');
    } else {
      endMessage.textContent = 'COMBAT TERMINÉ';
    }
  }
  if(endOverlay){
    endOverlay.style.display='flex';
    endOverlay.classList.add('show');
  }
}

function attaque(sourceColonne, elementAttaque){
  if(combatTermine) return;
  const prevGauche = hpGauche;
  const prevDroite = hpDroite;
  if(window.__debugBattle){
    console.log('[DEBUG attaque] start', {sourceColonne, nom: sourceColonne==='gauche'? (joueur&&joueur.nom): (ennemi&&ennemi.nom), hpGauche, hpDroite, attName: elementAttaque.textContent});
  }
  const puissance = parseInt(elementAttaque.dataset.degat, 10);
  const type = elementAttaque.dataset.type;
  const precisionBase = parseInt(elementAttaque.dataset.precision || '100', 10);
  const attaquant = sourceColonne === 'gauche' ? joueur : ennemi;
  const defenseur = sourceColonne === 'gauche' ? ennemi : joueur;
  let hpCible = sourceColonne === 'gauche' ? hpDroite : hpGauche;
  const cibleType = defenseur.type;
  const side = sourceColonne === 'gauche' ? 'gauche' : 'droite';
  const oppSide = sourceColonne === 'gauche' ? 'droite' : 'gauche';

  if(window.__debugBattle && (isNaN(puissance))){
    console.warn('[DEBUG puissance NaN] dataset.degat=', elementAttaque.dataset.degat, 'element:', elementAttaque);
  }

  // PP
  let ppRestant = parseInt(elementAttaque.dataset.pprestant || '0',10);
  if(puissance>=0 && elementAttaque.dataset.pp){
    if(ppRestant<=0){
  enqueue(`<span class="type type-${type}">${type}</span>${attaquant.nom} n'a plus de PP pour ${elementAttaque.dataset.originalname || 'son attaque'}!`);
      return;
    }
    ppRestant -= 1; elementAttaque.dataset.pprestant = ppRestant;
    elementAttaque.title = `PP ${ppRestant}/${elementAttaque.dataset.pp}`;
    if(ppRestant===0) elementAttaque.style.opacity=.35;
  majLibelleAttaque(elementAttaque);
  }
  // Calcul précision
  const accMult = stageToMult(stats[side].accStage);
  const evaMult = stageToMult(stats[oppSide].evaStage);
  const precisionEffective = Math.min(100, Math.max(1, Math.round(precisionBase * accMult / evaMult)));
  if(Math.random()*100 > precisionEffective){
  enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.dataset.originalname || 'une attaque'}</em> mais échoue ! (Précision ${precisionEffective}%)`);
    return;
  }

  const mult = calculMultiplicateur(type, cibleType);
  let degats = 0; let critique = false; let base = 0; let atkStat=0; let defStat=0; let variance=1; let critMult=1;
  if(puissance > 0){
    atkStat = attaquant.baseAtk * stageToMult(stats[side].atkStage);
    defStat = defenseur.baseDef * stageToMult(stats[oppSide].defStage);
  // Facteur global d'équilibrage des dégâts (augmenté de 1.8 à 2.1)
  base = (atkStat / defStat) * (puissance / 10) * 2.1;
    variance = 0.85 + Math.random()*0.15;
    critique = Math.random() < 0.0625; // 6.25%
    critMult = critique ? 1.5 : 1;
    degats = Math.max(1, Math.round(base * mult * variance * critMult));
  }
  if(window.__debugBattle){
    console.log('[DEBUG calc]', {puissance, type, precisionBase, mult, atkStat, defStat, base: Number(base.toFixed? base.toFixed(3): base), variance: variance.toFixed? variance.toFixed(3): variance, critMult, degatsAvantApplication: degats});
  }

  if(puissance > 0){
    const avant = hpCible;
    hpCible = Math.max(0, hpCible - degats);
    if(sourceColonne === 'gauche') hpDroite = hpCible; else hpGauche = hpCible;
    updateHPBars();
    if(window.__debugBattle){ console.log('[DEBUG dégâts]', {degats, hpAvant: avant, hpApres: hpCible, cible:(sourceColonne==='gauche'?'droite':'gauche'), hpGauche, hpDroite}); }
  } else if(window.__debugBattle){
    console.log('[DEBUG pas de dégâts - puissance <= 0]', {puissance, type});
  }
  // (Ancien rollback auto-dégâts supprimé: causait l'annulation des dégâts normaux)
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
    } else if(effet==='atk+'){
      // Hausse d'attaque du lanceur
      const avant = stats[side].atkStage;
      if(avant >= 6){
        texteEffet = `${attaquant.nom} ne peut pas augmenter davantage son Attaque.`;
      } else {
        stats[side].atkStage = Math.min(6, stats[side].atkStage + 1);
        texteEffet = `L'Attaque de ${attaquant.nom} augmente !`;
      }
    }
    majBadges();
  enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> lance <em>${elementAttaque.dataset.originalname || 'une attaque'}</em>. ${texteEffet}`);
  } else {
    popupDegats(oppSide, degats, critique);
    let critTxt = critique ? ' <span class="super-efficace">Coup critique !</span>' : '';
  enqueue(`<span class="type type-${type}">${type}</span><strong>${attaquant.nom}</strong> utilise <em>${elementAttaque.dataset.originalname || 'une attaque'}</em> inflige ${degats} dégâts. ${feedback}${critTxt}`);
    if(elementAttaque.dataset.effet==='leech' && degats>0){
      const avant = side==='gauche'? hpGauche: hpDroite;
      const soin = Math.min(100 - avant, Math.max(1, Math.round(degats*0.5)));
      if(soin>0){
        if(side==='gauche') hpGauche += soin; else hpDroite += soin;
  enqueue(`<em>${attaquant.nom} récupère ${soin} PV !</em>`);
        updateHPBars({healSide: side});
      }
    }
  }

  const imgCible = sourceColonne === 'gauche' ? imgDroite.parentElement : imgGauche.parentElement;
  imgCible.classList.add(sourceColonne === 'gauche' ? 'img-gauche-anim':'img-droite-anim');
  setTimeout(()=> imgCible.classList.remove(sourceColonne === 'gauche' ? 'img-gauche-anim':'img-droite-anim'),600);

  if(hpCible <= 0){
    const victoire = (attaquant === joueur);
    // Appel direct sans ajouter de phrase de K.O.
    finDePartie(victoire ? 'Tu gagnes !' : 'Tu perds...');
  }
  if(window.__debugBattle){ console.log('[DEBUG attaque end]', {hpGauche, hpDroite}); }
}

// Suppression système de projectiles et secousses


// --- Sélection ---
// Fonction utilitaire pour ajouter une option de sélection si elle n'existe pas déjà
function addPokemonOption(key){
  if(!pokemonListContainer) return;
  if(!POKEMONS[key]) return;
  if(document.querySelector(`.pokemon-option[data-key="${key}"]`)) return; // déjà présent
  const data = POKEMONS[key];
  const div = document.createElement('div');
  div.className='pokemon-option';
  div.dataset.key = key;
  const typeLabel = (data.type || (data.types && data.types[0]) || '').toString();
  const typePretty = typeLabel ? typeLabel.charAt(0).toUpperCase()+typeLabel.slice(1) : '';
  div.innerHTML = `
    <div class="pokeball"></div>
    <img src="${data.image}" alt="${data.nom}">
    <span>${data.nom} (${typePretty})</span>
  `;
  div.addEventListener('click', ()=>{
    const keySel = key; // simple sélection (rollback logique USED_PLAYER)
    joueur = POKEMONS[keySel];
    const enemiKey = selectionnerEnnemiSecurise(keySel);
  if(!enemiKey){ enqueue('<em>Aucun ennemi disponible.</em>'); joueur=null; return; }
    ennemi = POKEMONS[enemiKey];
    imgGauche.src = joueur.image; imgDroite.src = ennemi.image;
    nameGaucheSpan.textContent = joueur.nom; nameDroiteSpan.textContent = ennemi.nom;
    throwPokeball(imgGauche); throwPokeball(imgDroite); setTimeout(()=> normaliserSprites(),700);
    configAttaques('gauche', joueur); configAttaques('droite', ennemi);
    ppState.gauche = joueur.attaques.map(a=> a.pp || 0); ppState.droite = ennemi.attaques.map(a=> a.pp || 0);
    overlay.style.display='none';
    enqueue(`<strong>Combat :</strong> ${joueur.nom} VS ${ennemi.nom}`);
    updateHPBars(); majBadges();
    if(menuBtn) menuBtn.classList.remove('hidden');
    if(bagBtn) bagBtn.classList.remove('hidden');
    if(shopBtn) shopBtn.classList.remove('hidden');
    tour=1; phase='player'; majIndicateurTour(); verrouillerAttaques(false); updateTransformationButtons();
  });
  pokemonListContainer.appendChild(div);
}

pokemonOptions.forEach(opt=>{
  opt.addEventListener('click',()=>{
    const key = opt.dataset.key;
    // rollback: permettre la re-sélection libre
    joueur = POKEMONS[key];
    const enemiKey = selectionnerEnnemiSecurise(key);
  if(!enemiKey){ enqueue('<em>Aucun ennemi disponible.</em>'); joueur=null; return; }
    ennemi = POKEMONS[enemiKey];

    imgGauche.src = joueur.image;
    imgDroite.src = ennemi.image;
    nameGaucheSpan.textContent = joueur.nom;
    nameDroiteSpan.textContent = ennemi.nom;
  // Animation d'apparition (Pokéball)
  throwPokeball(imgGauche);
  throwPokeball(imgDroite);
  setTimeout(()=> normaliserSprites(), 700);

    configAttaques('gauche', joueur);
    configAttaques('droite', ennemi);
    ppState.gauche = joueur.attaques.map(a=> a.pp || 0);
    ppState.droite = ennemi.attaques.map(a=> a.pp || 0);

  overlay.style.display = 'none';
  enqueue(`<strong>Combat :</strong> ${joueur.nom} VS ${ennemi.nom}`);
    updateHPBars();
    majBadges();
    if(menuBtn) menuBtn.classList.remove('hidden');
    if(bagBtn) bagBtn.classList.remove('hidden');
    if(shopBtn) shopBtn.classList.remove('hidden');
    tour = 1; phase='player'; majIndicateurTour();
    verrouillerAttaques(false);
    // Gestion des boutons Méga-évolution et Gigamax
    updateTransformationButtons();
  });
});

// Attaques joueur
attaquesGauche.forEach(div=>{
  div.addEventListener('click', function(){
    if(ppSelectionActive) return; // En mode sélection PP: ignorer exécution d'attaque
    if(!joueur || hpDroite<=0 || hpGauche<=0) return;
    if(phase!=='player') return; // empêcher clic hors tour joueur
    attaque('gauche', this);
    // Fin de phase joueur -> passer phase ennemi après petit délai
    if(hpDroite>0 && hpGauche>0){
  phase='enemy'; majIndicateurTour(); verrouillerAttaques(true);
      setTimeout(()=>{ tourEnemySequence(); }, 750);
    }
  });
});

// Exécuter l'action choisie par l'IA de l'ennemi
function executerActionEnnemi() {
  const decision = decisionEnnemi();
  if (!decision) { ennemiTours++; return; }
  if (decision.type === 'mega') {
    ennemiMegaUtilisee = true;
    ennemi.__mega = true;
    appliquerMega(ennemi, 'droite');
  } else if (decision.type === 'gigamax') {
    ennemiGigamaxUtilise = true;
    ennemi.__gigamax = true;
    appliquerGigamax(ennemi, 'droite');
  } else if (decision.type === 'attaque') {
    const divAtt = attaquesDroite[decision.index];
    if (divAtt) attaque('droite', divAtt);
  }
  ennemiTours++;
}

function tourEnemySequence(){
  if(combatTermine) return;
  // Une seule action pour l'ennemi
  executerActionEnnemi();
  // Attendre la file puis repasser au joueur
  setTimeout(()=>{
    if(!combatTermine && hpGauche>0 && hpDroite>0){
  phase='player'; tour++; majIndicateurTour(); verrouillerAttaques(false);
    }
  }, 900);
}

attaquesDroite.forEach(d=> d.style.pointerEvents='none');

enqueue('Sélectionne un Pokémon pour commencer.');

// (Styles capture collection supprimés)

// Snapshot initial pour reset complet
const __BASE_POKEMONS = JSON.parse(JSON.stringify(POKEMONS));

function resetCombat(){
  // Restaurer POKEMONS
  Object.keys(__BASE_POKEMONS).forEach(k=> POKEMONS[k] = JSON.parse(JSON.stringify(__BASE_POKEMONS[k])));
  joueur=null; ennemi=null; hpGauche=100; hpDroite=100; combatTermine=false; megaUtilisee=false; gigamaxUtilise=false; 
  ennemiMegaUtilisee=false; ennemiGigamaxUtilise=false; processing=false; actionQueue=[];
  stats = { gauche:{atkStage:0,defStage:0,accStage:0,evaStage:0}, droite:{atkStage:0,defStage:0,accStage:0,evaStage:0} };
  ppState = { gauche:[], droite:[] };
  // NOTE: pokepieces et CAPTURED sont préservés intentionnellement
  // Effacer log et interface
  logBox.innerHTML='';
  document.getElementById('badges-gauche').innerHTML='';
  document.getElementById('badges-droite').innerHTML='';
  [...attaquesGauche,...attaquesDroite].forEach(div=>{
    div.textContent='---';
    ['degat','type','precision','effet','pp','pprestant'].forEach(a=> delete div.dataset[a]);
    div.style.opacity='';
    if(div.parentElement.classList.contains('attaque-droite')) div.style.pointerEvents='none'; else div.style.pointerEvents='auto';
  });
  imgGauche.src=''; imgDroite.src='';
  nameGaucheSpan.textContent='';
  nameDroiteSpan.textContent='';
  imgGauche.classList.add('hidden'); imgDroite.classList.add('hidden');
  imgGauche.classList.remove('mega-flash','mega-aura','gigamax-aura');
  imgDroite.classList.remove('mega-flash','mega-aura','gigamax-aura');
  megaBtn.classList.add('hidden'); gigamaxBtn.classList.add('hidden'); restartBtn.classList.add('hidden');
  bagBtn && bagBtn.classList.add('hidden');
  shopBtn && shopBtn.classList.add('hidden');
  megaBtn.classList.remove('disabled'); gigamaxBtn.classList.remove('disabled');
  megaBtn.disabled = false; gigamaxBtn.disabled = false;
  // S'assurer que le sac est de nouveau activé après un combat précédent / capture
  if(bagBtn){ bagBtn.disabled = false; }
  updateHPBars();
  enqueue('Sélectionne un Pokémon pour commencer.');
  overlay.style.display='flex';
  // Réappliquer listeners sur les options de sélection
  setTimeout(()=>{
    document.querySelectorAll('.pokemon-option').forEach(opt=>{
      opt.style.pointerEvents = 'auto';
      opt.classList.remove('disabled');
      opt.onclick = null;
      opt.addEventListener('click',()=>{
        const key = opt.dataset.key;
        joueur = POKEMONS[key];
  const enemiKey = selectionnerEnnemiSecurise(key);
        if(!enemiKey){ enqueue('<em>Aucun ennemi disponible (déjà possédés). Choisis un autre Pokémon.</em>'); joueur=null; return; }
        ennemi = POKEMONS[enemiKey];
        imgGauche.src = joueur.image;
        imgDroite.src = ennemi.image;
        nameGaucheSpan.textContent = joueur.nom;
        nameDroiteSpan.textContent = ennemi.nom;
  throwPokeball(imgGauche);
  throwPokeball(imgDroite);
  setTimeout(()=> normaliserSprites(), 700);
        configAttaques('gauche', joueur);
        configAttaques('droite', ennemi);
        ppState.gauche = joueur.attaques.map(a=> a.pp || 0);
        ppState.droite = ennemi.attaques.map(a=> a.pp || 0);
    overlay.style.display = 'none';
    enqueue(`<strong>Combat :</strong> ${joueur.nom} VS ${ennemi.nom}`);
        updateHPBars();
        majBadges();
        if(menuBtn) menuBtn.classList.remove('hidden');
        if(bagBtn) bagBtn.classList.remove('hidden');
        if(shopBtn) shopBtn.classList.remove('hidden');
        tour = 1; phase='player'; majIndicateurTour();
        verrouillerAttaques(false);
        updateTransformationButtons();
      });
    });
  }, 100);
  tour=1; phase='player';
  // Restaurer inventaire (quantités)
  Object.keys(__BASE_INVENTAIRE).forEach(k=>{
    if(INVENTAIRE[k]) INVENTAIRE[k].qty = __BASE_INVENTAIRE[k].qty;
  });
}

restartBtn.addEventListener('click', ()=> {
  enqueue('<em>Tu t\'enfuis...</em>');
  setTimeout(()=> resetCombat(), 400);
});

// Bouton menu en cours de combat (retour au choix sans recharger la page)
if(menuBtn){
  menuBtn.addEventListener('click', ()=>{
    enqueue('<em>Retour au menu...</em>');
    setTimeout(()=>{ resetCombat(); menuBtn.classList.add('hidden'); }, 250);
  });
}

returnMenuBtn && returnMenuBtn.addEventListener('click', ()=>{
  if(endOverlay) endOverlay.style.display='none';
  resetCombat();
});

// (Redéfinitions leviator / dracaufeu supprimées – déjà intégrées dans l'objet POKEMONS initial)

let megaDisponible = true;
let megaUtilisee = false;
let gigamaxUtilise = false;
// ================= Sac & Inventaire =================
const INVENTAIRE = {
  potion: { id:'potion', nom:'Potion', desc:'+20 PV (jusqu\'à 100)', qty:3, type:'heal', valeur:20 },
  superPotion: { id:'superPotion', nom:'Super Potion', desc:'+40 PV', qty:2, type:'heal', valeur:40 },
  potionPP: { id:'potionPP', nom:'Potion PP', desc:'+5 PP à une attaque', qty:4, type:'pp', valeur:5 },
  elixir: { id:'elixir', nom:'Élixir', desc:'Restaure tous les PP d\'une attaque', qty:2, type:'ppfull' },
  maxPotion: { id:'maxPotion', nom:'Max Potion', desc:'PV à 100%', qty:1, type:'healfull' },
  pokeball: { id:'pokeball', nom:'Poké Ball', desc:'Capture un Pokémon sauvage', qty:5, type:'capture' }
};
// Snapshot inventaire (placé après la déclaration pour éviter ReferenceError)
const __BASE_INVENTAIRE = JSON.parse(JSON.stringify(INVENTAIRE));

// ================= PokéShop & PokéPièces =================
let pokepieces = 0;

const SHOP_ITEMS = {
  potion: { id:'potion', nom:'Potion', desc:'+20 PV', prix:15 },
  superPotion: { id:'superPotion', nom:'Super Potion', desc:'+40 PV', prix:25 },
  potionPP: { id:'potionPP', nom:'Potion PP', desc:'+5 PP à une attaque', prix:20 },
  elixir: { id:'elixir', nom:'Élixir', desc:'Restaure tous les PP d\'une attaque', prix:35 },
  maxPotion: { id:'maxPotion', nom:'Max Potion', desc:'PV à 100%', prix:50 },
  pokeball: { id:'pokeball', nom:'Poké Ball', desc:'Capture un Pokémon sauvage', prix:30 }
};

// ================= Système de capture simplifié =================
let captureEnCours = false; // Empêche plusieurs animations simultanées
// CAPTURED: pokémon réellement capturés via Poké Ball
const CAPTURED = new Set();
let currentCaptureEnemyKey = null; // clé de l'ennemi en cours de capture (sécurise si menu cliqué)
// Redéfinir helper debug maintenant que les ensembles existent
window.__captureStatus = ()=>({ captured:[...CAPTURED], total:Object.keys(POKEMONS).length });

function choisirEnnemi(keyExclu){
  const keys = Object.keys(POKEMONS);
  if(keys.length<=1) return keys.find(k=> k!==keyExclu) || null;
  let pick; do { pick = keys[(Math.random()*keys.length)|0]; } while(pick===keyExclu);
  if(window.__debugCapture){ console.log('[DEBUG choisirEnnemi]', {keyExclu, pick}); }
  return pick;
}

// Sélection simple: exclut uniquement le Pokémon choisi par le joueur
function selectionnerEnnemiSecurise(playerKey){ return choisirEnnemi(playerKey); }

function normaliserSprites(){
  [imgGauche, imgDroite].forEach(img=>{
    if(!img) return;
    img.classList.remove('hidden');
    // Ne pas annuler totalement les filtres d'animations (méga / gigamax), juste enlever un éventuel grayscale ou opacity résiduels
    const current = getComputedStyle(img).filter;
    if(current && /grayscale|brightness\(0\.?|opacity\(0/.test(current)){
      img.style.filter='';
    }
    img.style.opacity='1';
    img.classList.add('spawn');
    setTimeout(()=> img.classList.remove('spawn'),650);
  });
}

// Ancienne fonction (collection complète) retirée car non utilisée

function renderInventaire(){
  if(!bagItemsContainer) return;
  bagItemsContainer.innerHTML='';
  Object.values(INVENTAIRE).forEach(obj=>{
    const div=document.createElement('div');
    div.className='bag-item'+(obj.qty<=0?' disabled':'');
    div.dataset.itemId = obj.id;
    div.innerHTML = `
      <span class="bag-item-title">${obj.nom}</span>
      <span class="bag-item-desc">${obj.desc}</span>
      <span class="bag-item-qty">x${obj.qty}</span>
    `;
    if(obj.qty>0) div.addEventListener('click', ()=> utiliserObjet(obj));
    bagItemsContainer.appendChild(div);
  });
}

function ouvrirSac(){
  if(!joueur || combatTermine) return;
  renderInventaire();
  bagOverlay.classList.remove('hidden'); // au cas où il aurait été caché via classe
  bagOverlay.style.display='flex';
  bagOverlay.classList.add('show');
  bagInfo.textContent='Sélectionne un objet.';
}
function fermerSac(){
  bagOverlay.style.display='none';
  bagOverlay.classList.remove('show');
}

function utiliserObjet(obj){
  if(obj.qty<=0) return;
  if(obj.type==='heal'){
    if(hpGauche>=100){ bagInfo.textContent='PV déjà au maximum.'; return; }
    const avant = hpGauche;
    hpGauche = Math.min(100, hpGauche + obj.valeur);
    updateHPBars({healSide:'gauche'});
    enqueue(`<em>${joueur.nom} récupère ${hpGauche-avant} PV grâce à ${obj.nom}.</em>`);
  } else if(obj.type==='healfull'){
    if(hpGauche===100){ bagInfo.textContent='PV déjà au maximum.'; return; }
    const avant = hpGauche;
    hpGauche = 100; updateHPBars({healSide:'gauche'});
    enqueue(`<em>${joueur.nom} est totalement soigné (+${100-avant} PV) !</em>`);
  } else if(obj.type==='pp' || obj.type==='ppfull'){
    // Activer mode sélection par clic
    if(window.__ppSelectCancel){ // nettoyage précédent si bug
      window.__ppSelectCancel();
    }
    // Fermer proprement le sac avant sélection
    fermerSac();
    ppSelectionActive = true;
    bagInfo.textContent = obj.type==='pp' ? 'Sélectionne une attaque à augmenter.' : 'Sélectionne une attaque à restaurer.';
    const selectable = [];
    attaquesGauche.forEach(div=>{
      if(div.dataset && div.dataset.pp){
        const cur = parseInt(div.dataset.pprestant||div.dataset.pp||'0',10);
        const max = parseInt(div.dataset.pp||'0',10);
        if(cur < max){
          div.classList.add('pp-selectable');
          div.style.outline='2px solid #ffcc33';
          div.style.cursor='cell';
          const handler = ()=>{
            // Consommation
            let avant = parseInt(div.dataset.pprestant,10);
            if(obj.type==='pp'){
              const ajout = Math.min(obj.valeur, max-avant);
              div.dataset.pprestant = Math.min(max, avant + obj.valeur);
              majLibelleAttaque(div);
              enqueue(`<em>PP de ${div.dataset.originalname} +${ajout}.</em>`);
            } else {
              div.dataset.pprestant = max;
              majLibelleAttaque(div);
              enqueue(`<em>PP de ${div.dataset.originalname} restaurés (${max}).</em>`);
            }
            obj.qty -=1;
            renderInventaire();
            bagInfo.textContent = `${obj.nom} utilisé.`;
            // Nettoyage
            selectable.forEach(o=> o.el.removeEventListener('click', o.fn));
            attaquesGauche.forEach(d2=>{ d2.classList.remove('pp-selectable'); d2.style.outline=''; d2.style.cursor=''; });
            ppSelectionActive = false;
          };
          div.addEventListener('click', handler, { once:true });
          selectable.push({el:div, fn:handler});
        }
      }
    });
    if(!selectable.length){
      bagInfo.textContent='Aucune attaque n\'a besoin de PP.';
      ppSelectionActive = false;
      return;
    }
    // Fournir une fonction globale d'annulation (optionnel)
    window.__ppSelectCancel = ()=>{
      selectable.forEach(o=> o.el.removeEventListener('click', o.fn));
      attaquesGauche.forEach(d2=>{ d2.classList.remove('pp-selectable'); d2.style.outline=''; d2.style.cursor=''; });
      bagInfo.textContent='Sélection annulée.';
      delete window.__ppSelectCancel;
      ppSelectionActive = false;
    };
    return; // On ne consomme pas tant que pas cliqué
  } else if(obj.type==='capture'){
    // Tentative de capture
    if(!ennemi || hpDroite <= 0) {
      bagInfo.textContent='Aucun Pokémon à capturer.';
      return;
    }
    fermerSac();
    tentativeCapture(obj);
    return; // La consommation se fait dans tentativeCapture si réussie
  }
  obj.qty -=1;
  const itemDiv = bagItemsContainer.querySelector(`[data-item-id="${obj.id}"]`);
  if(itemDiv){ itemDiv.classList.add('flash'); setTimeout(()=> itemDiv.classList.remove('flash'), 900); }
  renderInventaire();
  bagInfo.textContent = `${obj.nom} utilisé.`;
}

bagBtn && bagBtn.addEventListener('click', ()=>{
  if(bagOverlay.style.display==='flex') fermerSac(); else ouvrirSac();
});
closeBagBtn && closeBagBtn.addEventListener('click', ()=> fermerSac());
bagOverlay && bagOverlay.addEventListener('click', e=>{ if(e.target===bagOverlay) fermerSac(); });

// ================= Gestion PokéShop =================
function renderShop(){
  if(!shopItemsContainer) return;
  shopItemsContainer.innerHTML='';
  Object.values(SHOP_ITEMS).forEach(obj=>{
    const div=document.createElement('div');
    const canAfford = pokepieces >= obj.prix;
    div.className='shop-item'+(canAfford ? '' : ' disabled');
    div.innerHTML = `
      <span class="shop-item-title">${obj.nom}</span>
      <span class="shop-item-desc">${obj.desc}</span>
      <span class="shop-item-price">
        <span class="pokecoin-icon">⚡</span>
        ${obj.prix} PokéPièces
      </span>
    `;
    if(canAfford) {
      div.addEventListener('click', ()=> acheterObjet(obj));
    }
    shopItemsContainer.appendChild(div);
  });
}

function ouvrirShop(){
  if(!joueur || combatTermine) return;
  renderShop();
  updateShopCurrency();
  shopOverlay.style.display='flex';
  shopOverlay.classList.add('show');
  shopInfo.textContent='Sélectionne un objet à acheter.';
}

function fermerShop(){
  shopOverlay.style.display='none';
  shopOverlay.classList.remove('show');
}

function updateShopCurrency(){
  if(shopCurrencyAmount) shopCurrencyAmount.textContent = pokepieces;
}

function acheterObjet(shopItem){
  if(pokepieces < shopItem.prix) {
    shopInfo.textContent = 'Pas assez de PokéPièces !';
    return;
  }
  
  // Déduire le prix
  pokepieces -= shopItem.prix;
  updateShopCurrency();
  
  // Ajouter l'objet à l'inventaire
  if(INVENTAIRE[shopItem.id]) {
    INVENTAIRE[shopItem.id].qty += 1;
  }
  
  renderShop(); // Rafraîchir l'affichage du shop
  shopInfo.textContent = `${shopItem.nom} acheté ! Ajouté au sac.`;
  
  // Flash de confirmation
  setTimeout(() => {
    if(shopInfo.textContent === `${shopItem.nom} acheté ! Ajouté au sac.`) {
      shopInfo.textContent = 'Sélectionne un objet à acheter.';
    }
  }, 2000);
}

shopBtn && shopBtn.addEventListener('click', ()=>{
  if(shopOverlay.style.display==='flex') fermerShop(); else ouvrirShop();
});
closeShopBtn && closeShopBtn.addEventListener('click', ()=> fermerShop());
shopOverlay && shopOverlay.addEventListener('click', e=>{ if(e.target===shopOverlay) fermerShop(); });

// ================= Fonctions de capture =================
function tentativeCapture(pokeball){
  if(!ennemi || hpDroite<=0 || combatTermine || captureEnCours) return;
  captureEnCours = true;
  // Bloquer temporairement le bouton menu / fuite pendant la capture
  menuBtn && (menuBtn.disabled = true);
  restartBtn && restartBtn.classList.add('hidden');
  // Mémoriser la clé de l'ennemi tout de suite pour ne pas la perdre en cas de reset prématuré
  try { currentCaptureEnemyKey = Object.entries(POKEMONS).find(([k,v])=> v===ennemi)?.[0] || null; } catch(_e){ currentCaptureEnemyKey = null; }
  const container = imgDroite.parentElement;
  if(container){ container.querySelectorAll('.capture-ball').forEach(b=> b.remove()); }
  const tauxBase = Math.max(10, 80 - hpDroite);
  const reussite = Math.random()*100 < tauxBase;
  animationCapture(reussite, pokeball);
}

function animationCapture(reussite, pokeball){
  const container = imgDroite.parentElement;
  container.style.position='relative';
  verrouillerAttaques(true);
  bagBtn && (bagBtn.disabled=true);
  // Petite Pokéball (lancer)
  const small=document.createElement('div');
  small.className='capture-ball';
  small.style.cssText='position:absolute;width:32px;height:32px;top:100%;left:50%;transform:translateX(-50%);background:linear-gradient(to bottom,#e60012 0%,#e60012 45%,#333 47%,#333 53%,#f8f8f8 55%,#f8f8f8 100%);border:3px solid #000;border-radius:50%;z-index:120;animation:throwBall .9s ease-out forwards;box-shadow:inset 0 0 0 2px #fff,0 4px 8px rgba(0,0,0,.35)';
  const btn=document.createElement('div');btn.style.cssText='position:absolute;width:8px;height:8px;background:#333;border:2px solid #fff;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)';small.appendChild(btn);
  if(!document.querySelector('#capture-keyframes-v2')){const s=document.createElement('style');s.id='capture-keyframes-v2';s.textContent='@keyframes throwBall{0%{transform:translateX(-50%) translateY(0) rotate(0) scale(1);}55%{transform:translateX(-50%) translateY(-85px) rotate(200deg) scale(1.1);}100%{transform:translateX(-50%) translateY(-42px) rotate(360deg) scale(1);} }@keyframes bigShake{0%,100%{transform:translate(-50%,-50%) rotate(0);}15%{transform:translate(-50%,-52%) rotate(-18deg);}35%{transform:translate(-50%,-52%) rotate(18deg);}55%{transform:translate(-50%,-52%) rotate(-18deg);}75%{transform:translate(-50%,-52%) rotate(18deg);} }@keyframes captureGlow{0%{opacity:0;transform:scale(.5);}50%{opacity:1;transform:scale(1.25);}100%{opacity:0;transform:scale(1.6);} }';document.head.appendChild(s);} 
  container.appendChild(small);
  setTimeout(()=>{
    imgDroite.classList.add('hidden');
    small.remove();
    const big=document.createElement('div');
    big.className='capture-ball big';
    big.style.cssText='position:absolute;width:70px;height:70px;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(to bottom,#e60012 0%,#e60012 45%,#222 47%,#222 53%,#f8f8f8 55%,#f8f8f8 100%);border:4px solid #000;border-radius:50%;z-index:130;animation:bigShake 1.2s ease-in-out 1;box-shadow:inset 0 0 0 3px #fff,0 0 14px rgba(255,255,255,.25),0 6px 14px rgba(0,0,0,.45)';
    const btn2=document.createElement('div');btn2.style.cssText='position:absolute;width:14px;height:14px;background:#222;border:3px solid #fff;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)';big.appendChild(btn2);container.appendChild(big);
    setTimeout(()=>{
      if(reussite){
        big.style.animation='none';big.style.background='linear-gradient(to bottom,#4CAF50 0%,#4CAF50 45%,#1d1d1d 47%,#1d1d1d 53%,#81C784 55%,#81C784 100%)';big.style.boxShadow='inset 0 0 0 3px #fff,0 0 25px #4CAF50,0 0 55px #4CAF50';
        const glow=document.createElement('div');glow.style.cssText='position:absolute;inset:-25px;border-radius:50%;background:radial-gradient(circle,rgba(76,175,80,.35) 0%,transparent 70%);animation:captureGlow 1.1s ease-in-out';big.appendChild(glow);
  enqueue(`<em style=\"color:#4CAF50;\">Capture réussie ! ${ennemi.nom} capturé.</em>`);
  // Ajout simple à l'ensemble des capturés (utilise la clé mémorisée au lancement de la capture)
  if(currentCaptureEnemyKey){
          CAPTURED.add(currentCaptureEnemyKey);
          // Rendre le Pokémon capturé sélectionnable (s'il n'était pas dans la liste initiale)
          addPokemonOption(currentCaptureEnemyKey);
        }
        // Vérifier si tous capturés -> reset automatique après message
        if(CAPTURED.size === Object.keys(POKEMONS).length){
          enqueue('<strong>Tous les Pokémon sont capturés ! Réinitialisation automatique...</strong>');
          setTimeout(()=>{ resetCombat(); CAPTURED.clear(); }, 2200);
        }
        const bonus=Math.floor(Math.random()*15)+25; pokepieces+=bonus; enqueue(`<em style=\"color:#ffcb05;\">+${bonus} PokéPièces bonus pour la capture !</em>`); updateShopCurrency();
        pokeball.qty-=1; renderInventaire();
        setTimeout(()=>{ finDeCombatCapture(ennemi.nom); big.remove(); captureEnCours=false; currentCaptureEnemyKey=null; menuBtn && (menuBtn.disabled=false); },1400);
  // Ré-activer le sac après la capture (il était désactivé pendant l'animation). On laisse l'ouverture bloquée par combatTermine jusqu'au prochain reset.
  if(bagBtn){ bagBtn.disabled = false; }
      } else {
        big.style.animation='none';big.style.background='linear-gradient(to bottom,#f44336 0%,#f44336 45%,#222 47%,#222 53%,#ffcdd2 55%,#ffcdd2 100%)';big.style.boxShadow='inset 0 0 0 3px #fff,0 0 18px #f44336,0 6px 16px rgba(0,0,0,.45)';
        enqueue(`<em style=\"color:#f44336;\">Capture échouée ! ${ennemi.nom} s'est échappé !</em>`);
        pokeball.qty-=1; renderInventaire();
        setTimeout(()=>{ imgDroite.classList.remove('hidden'); big.remove(); captureEnCours=false; currentCaptureEnemyKey=null; menuBtn && (menuBtn.disabled=false); verrouillerAttaques(false); bagBtn && (bagBtn.disabled=false); },900);
      }
    },1250);
  },900);
}

// ajouterPokemonSelectable supprimé (collection retirée)

// Fonction spéciale pour fin de combat par capture
function finDeCombatCapture(nomPokemon) {
  [...attaquesGauche,...attaquesDroite].forEach(b=> b.style.pointerEvents='none');
  restartBtn.classList.remove('hidden');
  combatTermine = true;
  
  if(endMessage){
    endMessage.style.display = 'block';
    endMessage.classList.remove('win','lose');
    endMessage.classList.add('capture');
    endMessage.textContent = `${nomPokemon.toUpperCase()} ATTRAPÉ !`;
  }
  if(endOverlay){
    endOverlay.style.display='flex';
    endOverlay.classList.add('show');
  }
}

// Fonction pour mettre à jour l'état des boutons de transformation
function updateTransformationButtons() {
  // Bouton Méga-évolution
  if (joueur && joueur.mega && !megaUtilisee) {
    megaBtn.classList.remove('hidden', 'disabled');
    megaBtn.disabled = false;
    megaBtn.title = "Méga-évoluer (une seule fois)";
  } else {
    megaBtn.classList.add('hidden');
  }

  // Bouton Gigamax
  if (joueur && joueur.gigamax && !gigamaxUtilise) {
    gigamaxBtn.classList.remove('hidden', 'disabled');
    gigamaxBtn.disabled = false;
    gigamaxBtn.title = "Gigamax (Pikachu uniquement)";
  } else {
    gigamaxBtn.classList.add('hidden');
  }
}

// Attaques spéciales Gigamax
const GIGAMAX_ATTACKS = {
  'Pikachu Gigamax': [
    { nom:'Giga-Foudre', puissance:60, type:'electrique', precision:90, pp:5 },
    { nom:'Tonnerre', puissance:50, type:'electrique', precision:85, pp:10 },
    { nom:'Queue Éclair', puissance:40, type:'electrique', precision:100, pp:15 },
    { nom:'Charge Statik', puissance:0, type:'statut', effet:'atk+', precision:100, pp:20 }
  ]
};

function appliquerMega(pokemon, cote){
  if(!pokemon.mega) return;
  const isJoueur = cote==='gauche';
  const imgEl = isJoueur ? imgGauche : imgDroite;
  // Animation enrichie : éclats + morph + aura
  imgEl.classList.add('mega-transforming');
  imgEl.classList.add('mega-morph');
  // Génération d'éclats lumineux
  const shardLayer = document.createElement('div');
  shardLayer.className = 'mega-shards';
  const host = imgEl.parentElement;
  if(host){ host.style.position='relative'; host.appendChild(shardLayer); }
  for(let i=0;i<16;i++){
    const s = document.createElement('div');
    s.className = 'mega-shard';
    const angle = (Math.PI * 2 * (i/16));
    const dist = 70 + Math.random()*55;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    s.style.setProperty('--dx', dx+'px');
    s.style.setProperty('--dy', dy+'px');
    s.style.left = '50%';
    s.style.top = '50%';
    s.style.transform = 'translate(-50%,-50%)';
    s.style.animationDelay = (Math.random()*0.15)+'s';
    shardLayer.appendChild(s);
  }
  setTimeout(()=>{
    if(shardLayer) shardLayer.remove();
  }, 1200);
  setTimeout(()=>{
    imgEl.classList.remove('mega-morph');
    imgEl.classList.add('mega-aura');
    imgEl.classList.remove('mega-transforming');
  },1100);
  // Mise à jour des stats et nom
  pokemon.nom = pokemon.mega.nom;
  pokemon.type = pokemon.mega.type;
  pokemon.baseAtk = pokemon.mega.baseAtk;
  pokemon.baseDef = pokemon.mega.baseDef;
  imgEl.src = pokemon.mega.image;
  if(isJoueur) nameGaucheSpan.textContent = pokemon.nom; else nameDroiteSpan.textContent = pokemon.nom;
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
  if(!joueur || megaUtilisee || !joueur.mega || megaBtn.disabled) return;
  megaUtilisee = true;
  updateTransformationButtons();
  appliquerMega(joueur, 'gauche');
});

// Bouton Gigamax
if(gigamaxBtn){
  gigamaxBtn.addEventListener('click', ()=>{
    if(!joueur || gigamaxUtilise || !joueur.gigamax || gigamaxBtn.disabled) return;
    gigamaxUtilise = true;
    updateTransformationButtons();
    appliquerGigamax(joueur, 'gauche');
  });
}

// Surcharge fonction configAttaques pour gérer nouveaux effets
const oldConfigAttaques = configAttaques;
configAttaques = function(colonne, pokemon){
  oldConfigAttaques(colonne, pokemon);
};

// Etendre effets dans attaque
const oldAttaque = attaque;
attaque = function(sourceColonne, elementAttaque){ oldAttaque(sourceColonne, elementAttaque); };

// Extension effets statut dans la fonction attaque existante (ré-édition légère)
// On va monkey patcher la logique sans tout réécrire :
// Ajout nouvel effet atk+ (Danse Draco)
// Ajout déclenchement automatique méga ennemi à 50% PV si disponible

// Variables pour l'IA de l'ennemi
let ennemiMegaUtilisee = false;
let ennemiGigamaxUtilise = false;
ennemiTours = 0; // Compteur de décisions ennemies

// IA de l'ennemi pour décider de ses actions
function decisionEnnemi() {
  if (!ennemi || hpDroite <= 0) return null;

  // Les ennemis ne peuvent plus se transformer (Méga/Gigamax désactivés)
  // Commenté pour désactiver les transformations ennemies :
  /*
  const canGigamax = ennemi.gigamax && !ennemiGigamaxUtilise && !ennemi.__gigamax;
  const canMega = ennemi.mega && !ennemiMegaUtilisee && !ennemi.__mega;
  if (ennemiTours >= 1 && (canGigamax || canMega)) {
    // ... code de transformation désactivé
  }
  */

  // Pas de transformation ce tour -> sélection d'attaque
  const attaquesDisponibles = ennemi.attaques.map((att,idx)=>({att,idx})).filter(({att,idx})=>{
    const divAtt = attaquesDroite[idx];
    if(!divAtt) return false;
    const ppRestant = parseInt(divAtt.dataset.pprestant || divAtt.dataset.pp || '999',10);
    return ppRestant>0;
  });
  if(!attaquesDisponibles.length) return null;
  const r = Math.random();
  let choix;
  if(r < 0.5){
    choix = attaquesDisponibles[Math.floor(Math.random()*attaquesDisponibles.length)]; // totalement aléatoire
  } else if(r < 0.8){
    const faibles = attaquesDisponibles.filter(o=> o.att.puissance>0 && o.att.puissance < 35);
    if(faibles.length) choix = faibles[Math.floor(Math.random()*faibles.length)];
  }
  if(!choix){
    if(hpGauche <= 30){
      const fortes = attaquesDisponibles.filter(o=> o.att.puissance >= 40);
      choix = fortes.length ? fortes[Math.floor(Math.random()*fortes.length)] : attaquesDisponibles[Math.floor(Math.random()*attaquesDisponibles.length)];
    } else if(hpDroite <= 40 && Math.random() < 0.35){
      const statut = attaquesDisponibles.filter(o=> o.att.type==='statut');
      choix = statut.length ? statut[Math.floor(Math.random()*statut.length)] : attaquesDisponibles[Math.floor(Math.random()*attaquesDisponibles.length)];
    } else {
      choix = attaquesDisponibles[Math.floor(Math.random()*attaquesDisponibles.length)];
    }
  }
  return { type:'attaque', index: choix.idx };
}

// Observer le log queue pour appliquer patch dynamique après chaque action
function baseAfterAction(){
  updateTransformationButtons();
}

// (Hook processQueue supprimé : afterAction est maintenant appelé directement dans processQueue)

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
  if(gigamaxBtn) gigamaxBtn.classList.add('hidden');
};

// Ajout fonctions supplémentaires méga
function setTypes(pokemon, types){ pokemon.types = types; }
setTypes(POKEMONS.tortank, ['eau']);
setTypes(POKEMONS.leviator, ['eau']);
setTypes(POKEMONS.dragaufeu, ['feu']);
setTypes(POKEMONS.pikachu, ['electrique']);
setTypes(POKEMONS.mewtwo, ['psychique']);
setTypes(POKEMONS.ectoplasma, ['spectre']);
// Ajout types méga multiples
POKEMONS.leviator.mega.types = ['eau','tenebres'];
POKEMONS.dragaufeu.mega.types = ['feu','dragon'];
if(POKEMONS.tortank.mega){ POKEMONS.tortank.mega.types = ['eau']; }
if(POKEMONS.ectoplasma.mega){ POKEMONS.ectoplasma.mega.types = ['spectre','psychique']; }

// Attaques post-méga (remplacement)
const MEGA_NEW_ATTACKS = {
  'Méga-Léviator': [
    { nom:'Cascade', puissance:45, type:'eau', precision:95, pp:15 },
    { nom:'Hydrocanon', puissance:55, type:'eau', precision:75, pp:5 },
    { nom:'Aqua Impact', puissance:50, type:'eau', precision:90, pp:10 },
    { nom:'Danse Draco', puissance:0, type:'statut', effet:'atk+', precision: 100, pp: 20 }
  ],
  'Méga-Dracaufeu': [
    { nom:'Déflagration', puissance:50, type:'feu', precision:85, pp:5 },
    { nom:'Draco-Griffe', puissance:40, type:'dragon', precision:100, pp:15 },
    { nom:'Lance-Flammes', puissance:35, type:'feu', precision:95, pp:15 },
    { nom:'Vol', puissance:30, type:'normal', precision:95, pp:15 }
  ],
  'Méga-Mewtwo': [
    { nom:'Psyko', puissance:55, type:'psychique', precision:90, pp:10 },
    { nom:'Choc Mental', puissance:35, type:'psychique', precision:100, pp:25 },
    { nom:'Ball’Ombre', puissance:45, type:'normal', precision:95, pp:10 },
    { nom:'Plénitude', puissance:0, type:'statut', effet:'atk+', precision:100, pp:15 }
  ],
  'Méga-Tortank': [
    { nom:'Hydro-Barrage', puissance:55, type:'eau', precision:80, pp:5 },
    { nom:'Vibraqua', puissance:40, type:'eau', precision:100, pp:15 },
    { nom:'Aqua-Jet', puissance:30, type:'eau', precision:100, pp:20 },
    { nom:'Carapace Renforcée', puissance:0, type:'statut', effet:'atk+', precision:100, pp:15 }
  ],
  'Méga-Ectoplasma': [
    { nom:'Ball\'Ombre', puissance:50, type:'spectre', precision:90, pp:15 },
    { nom:'Dévorêve', puissance:45, type:'spectre', precision:85, pp:10 },
    { nom:'Psyko', puissance:40, type:'psychique', precision:100, pp:15 },
    { nom:'Malédiction', puissance:0, type:'statut', effet:'atk+', precision:100, pp:10 }
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
function afterAction(){
  baseAfterAction();
  if(joueur && joueur.nom && joueur.nom.startsWith('Méga-')){
    const cont = document.getElementById('badges-gauche');
    if(cont && !cont.querySelector('.badge-mega')){
      const b=document.createElement('div');b.className='badge-mega';b.textContent='MEGA';cont.prepend(b);
    }
  }
  if(ennemi && ennemi.nom && ennemi.nom.startsWith('Méga-')){
    const cont = document.getElementById('badges-droite');
    if(cont && !cont.querySelector('.badge-mega')){
      const b=document.createElement('div');b.className='badge-mega';b.textContent='MEGA';cont.prepend(b);
    }
  }
}
