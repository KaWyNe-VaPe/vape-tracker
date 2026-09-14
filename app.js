const dateArretCigarette = new Date('2026-08-17');

// Navigation & Écrans
const navAccueil = document.getElementById('nav-accueil');
const navRecettes = document.getElementById('nav-recettes');
const navSante = document.getElementById('nav-sante');
const navFinances = document.getElementById('nav-finances');
const navObjectifs = document.getElementById('nav-objectifs');

const ecranAccueil = document.getElementById('ecran-accueil');
const ecranRecettes = document.getElementById('ecran-recettes');
const ecranSante = document.getElementById('ecran-sante');
const ecranFinances = document.getElementById('ecran-finances');
const ecranAjout = document.getElementById('ecran-ajout');
const ecranObjectifs = document.getElementById('ecran-objectifs');

// Éléments Formulaires
const formConfigTabac = document.getElementById('form-config-tabac');
const formDepense = document.getElementById('form-depense');
const btnOuvrirDepense = document.getElementById('btn-ouvrir-depense');
const btnAnnulerDepense = document.getElementById('btn-annuler-depense');

function getJoursEcoules() {
    const aujourdhui = new Date();
    const diff = aujourdhui - dateArretCigarette;
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
}

function calculerJoursSansTabac() {
    document.getElementById('compteur-jours').textContent = getJoursEcoules();
}

// -------------------------------------------------------------
// CERISIER VECTORIEL ÉVOLUTIF (SANS IMAGE EXTERNE)
// -------------------------------------------------------------
function mettreAJourCerisierHD() {
    const jours = getJoursEcoules();
    const badge = document.getElementById('nom-stade-arbre');
    const conteneurSvg = document.getElementById('conteneur-svg-arbre');

    let nomStade = '';
    let svgArbre = '';

    if (jours < 4) {
        nomStade = 'Stade 1 : Jeune pousse 🌿';
        svgArbre = `
            <svg viewBox="0 0 200 220" class="image-arbre-hd">
                <path d="M100 200 Q98 160 100 140 Q95 125 90 115" stroke="#3d2b1f" stroke-width="4" stroke-linecap="round" fill="none"/>
                <!-- Feuilles détaillées -->
                <path d="M90 115 Q75 105 70 115 Q80 125 90 115" fill="#4ea8de"/>
                <path d="M90 115 Q105 105 110 115 Q100 125 90 115" fill="#72efdd"/>
                <path d="M100 140 Q115 130 120 138 Q108 148 100 140" fill="#52b788"/>
            </svg>`;
    } else if (jours < 11) {
        nomStade = 'Stade 2 : Petit arbre 🪴';
        svgArbre = `
            <svg viewBox="0 0 200 220" class="image-arbre-hd">
                <!-- Tronc torsadé -->
                <path d="M100 200 C90 160 110 120 95 80" stroke="#2c1d11" stroke-width="8" stroke-linecap="round" fill="none"/>
                <path d="M98 120 C75 100 60 95 50 90" stroke="#2c1d11" stroke-width="4" stroke-linecap="round" fill="none"/>
                <!-- Feuillage stylisé estampe -->
                <path d="M50 90 Q30 70 60 65 Q80 85 50 90" fill="#4ea8de" opacity="0.8"/>
                <path d="M95 80 Q75 50 110 50 Q120 75 95 80" fill="#52b788" opacity="0.85"/>
            </svg>`;
    } else if (jours < 21) {
        nomStade = 'Stade 3 : Branchement 🪵';
        svgArbre = `
            <svg viewBox="0 0 200 220" class="image-arbre-hd">
                <path d="M100 200 C85 150 115 100 90 50" stroke="#241409" stroke-width="11" stroke-linecap="round" fill="none"/>
                <path d="M96 130 C65 110 45 105 30 100" stroke="#241409" stroke-width="6" fill="none"/>
                <path d="M102 90 C130 75 150 70 165 65" stroke="#241409" stroke-width="5" fill="none"/>
                <!-- Nuages de feuillage aquarelle -->
                <path d="M30 100 Q10 75 45 70 Q60 95 30 100" fill="#2a9d8f" opacity="0.8"/>
                <path d="M165 65 Q185 40 145 40 Q135 60 165 65" fill="#52b788" opacity="0.8"/>
                <path d="M90 50 Q65 25 115 25 Q125 45 90 50" fill="#72efdd" opacity="0.7"/>
            </svg>`;
    } else if (jours < 36) {
        nomStade = 'Stade 4 : Premiers bourgeons 🌺';
        svgArbre = `
            <svg viewBox="0 0 200 220" class="image-arbre-hd">
                <!-- Silhouette du tronc réaliste -->
                <path d="M105 200 C80 140 115 90 85 40" stroke="#1f1007" stroke-width="12" stroke-linecap="round" fill="none"/>
                <path d="M95 125 C55 105 40 95 20 90" stroke="#1f1007" stroke-width="6" stroke-linecap="round" fill="none"/>
                <path d="M98 80 C135 60 155 55 175 45" stroke="#1f1007" stroke-width="5" fill="none"/>
                
                <!-- Feuillage vert d'eau piqué de fleurs -->
                <path d="M85 40 Q55 15 115 15 Q125 35 85 40" fill="#2a9d8f" opacity="0.6"/>
                <path d="M20 90 Q0 70 45 65 Q55 85 20 90" fill="#52b788" opacity="0.6"/>

                <!-- Fleurs Sakura découpées à 5 pétales -->
                <g transform="translate(85, 30) scale(0.8)">
                    <circle cx="0" cy="0" r="3" fill="#ffb7c5"/>
                    <path d="M0 -4 Q-4 -12 0 -15 Q4 -12 0 -4 M-4 0 Q-12 -4 -15 0 Q-12 4 -4 0 M0 4 Q-4 12 0 15 Q4 12 0 4 M4 0 Q12 -4 15 0 Q12 4 4 0" fill="#ff758f"/>
                </g>
                <g transform="translate(30, 75) scale(0.7)">
                    <path d="M0 -4 Q-4 -12 0 -15 Q4 -12 0 -4 M-4 0 Q-12 -4 -15 0 Q-12 4 -4 0 M0 4 Q-4 12 0 15 Q4 12 0 4 M4 0 Q12 -4 15 0 Q12 4 4 0" fill="#ff758f"/>
                </g>
                <g transform="translate(160, 50) scale(0.75)">
                    <path d="M0 -4 Q-4 -12 0 -15 Q4 -12 0 -4 M-4 0 Q-12 -4 -15 0 Q-12 4 -4 0 M0 4 Q-4 12 0 15 Q4 12 0 4 M4 0 Q12 -4 15 0 Q12 4 4 0" fill="#ff758f"/>
                </g>
            </svg>`;
    } else if (jours < 61) {
        nomStade = 'Stade 5 : Premières fleurs 🌸';
        svgArbre = `
            <svg viewBox="0 0 200 220" class="image-arbre-hd">
                <path d="M105 200 C80 130 120 80 85 35" stroke="#180b05" stroke-width="14" stroke-linecap="round" fill="none"/>
                <path d="M92 120 C50 95 35 90 15 85" stroke="#180b05" stroke-width="7" fill="none"/>
                <path d="M98 70 C140 50 160 45 180 35" stroke="#180b05" stroke-width="6" fill="none"/>
                
                <!-- Nuages de fleurs rose poudré -->
                <ellipse cx="85" cy="35" rx="45" ry="30" fill="#ffb7c5" opacity="0.85"/>
                <ellipse cx="20" cy="80" rx="35" ry="22" fill="#ff85a1" opacity="0.85"/>
                <ellipse cx="170" cy="40" rx="38" ry="25" fill="#fbb1bd" opacity="0.85"/>
                <ellipse cx="110" cy="60" rx="40" ry="25" fill="#ff9ebb" opacity="0.8"/>

                <!-- Détails fleurs brillantes -->
                <circle cx="85" cy="35" r="5" fill="#fff"/>
                <circle cx="20" cy="80" r="4" fill="#fff"/>
                <circle cx="170" cy="40" r="4" fill="#fff"/>
            </svg>`;
    } else {
        nomStade = 'Stade 6 : Cerisier majestueux 🌸✨';
        svgArbre = `
            <svg viewBox="0 0 200 220" class="image-arbre-hd">
                <!-- Grand tronc d'estampe courbé -->
                <path d="M110 200 C75 120 125 70 80 25" stroke="#120703" stroke-width="16" stroke-linecap="round" fill="none"/>
                <path d="M90 115 C40 90 25 85 5 80" stroke="#120703" stroke-width="8" fill="none"/>
                <path d="M100 60 C145 40 170 35 195 25" stroke="#120703" stroke-width="7" fill="none"/>
                
                <!-- Explosion florale Sakura HD (dégradés rose & blanc) -->
                <circle cx="80" cy="25" r="50" fill="#ffb7c5" opacity="0.9"/>
                <circle cx="10" cy="75" r="40" fill="#ff85a1" opacity="0.9"/>
                <circle cx="185" cy="30" r="42" fill="#fbb1bd" opacity="0.9"/>
                <circle cx="120" cy="45" r="45" fill="#ff9ebb" opacity="0.85"/>
                <circle cx="50" cy="45" r="38" fill="#ffe5ec" opacity="0.9"/>

                <!-- Coeur lumineux féérique -->
                <circle cx="80" cy="25" r="15" fill="#ffffff" opacity="0.6"/>
                <circle cx="120" cy="45" r="12" fill="#ffffff" opacity="0.6"/>
            </svg>`;
    }

    if (conteneurSvg) conteneurSvg.innerHTML = svgArbre;
    if (badge) badge.textContent = nomStade;

    genererParticules();
}
function genererParticules() {
    const conteneur = document.getElementById('particules');
    if (!conteneur) return;
    conteneur.innerHTML = '';

    for (let i = 0; i < 15; i++) {
        const petale = document.createElement('div');
        petale.className = 'petale-lumineux';
        
        const taille = Math.random() * 6 + 4;
        petale.style.width = `${taille}px`;
        petale.style.height = `${taille * 1.2}px`;
        
        petale.style.left = `${Math.random() * 100}%`;
        petale.style.animationDuration = `${Math.random() * 4 + 4}s`;
        petale.style.animationDelay = `${Math.random() * 5}s`;

        conteneur.appendChild(petale);
    }
}

// -------------------------------------------------------------
// NAVIGATION
// -------------------------------------------------------------
function basculerEcran(ecranAFFICHER) {
    [ecranAccueil, ecranRecettes, ecranSante, ecranFinances, ecranAjout, ecranObjectifs].forEach(e => e.classList.add('masque'));
    ecranAFFICHER.classList.remove('masque');
}

const navs = [
    { btn: navAccueil, ecran: ecranAccueil },
    { btn: navRecettes, ecran: ecranRecettes, action: () => afficherRecettes() },
    { btn: navSante, ecran: ecranSante, action: () => afficherSante() },
    { btn: navFinances, ecran: ecranFinances, action: () => afficherFinances() },
    { btn: navObjectifs, ecran: ecranObjectifs, action: () => afficherObjectifs() }
];

navs.forEach(item => {
    item.btn.addEventListener('click', () => {
        navs.forEach(n => n.btn.classList.remove('actif'));
        item.btn.classList.add('actif');
        basculerEcran(item.ecran);
        if (item.action) item.action();
    });
});

// -------------------------------------------------------------
// ÉCONOMIES
// -------------------------------------------------------------
function calculerEconomies() {
    const jours = getJoursEcoules();
    const config = JSON.parse(localStorage.getItem('configTabac')) || { cigsJour: 15, prixPaquet: 12.5, cigsPaquet: 20 };
    
    const coutParCig = config.prixPaquet / config.cigsPaquet;
    const tabacEvite = jours * config.cigsJour * coutParCig;

    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);

    const economieNette = tabacEvite - totalDepenses;

    document.getElementById('economie-accueil').textContent = `${economieNette.toFixed(2)} €`;
    document.getElementById('tabac-evite-total').textContent = `${tabacEvite.toFixed(2)} €`;
    document.getElementById('dépenses-vape-total').textContent = `${totalDepenses.toFixed(2)} €`;
    document.getElementById('economie-nette-detail').textContent = `${economieNette.toFixed(2)} €`;

    document.getElementById('cigs-jour').value = config.cigsJour;
    document.getElementById('prix-paquet').value = config.prixPaquet;
    document.getElementById('cigs-paquet').value = config.cigsPaquet;
}

formConfigTabac.addEventListener('submit', (e) => {
    e.preventDefault();
    const config = {
        cigsJour: parseFloat(document.getElementById('cigs-jour').value) || 0,
        prixPaquet: parseFloat(document.getElementById('prix-paquet').value) || 0,
        cigsPaquet: parseFloat(document.getElementById('cigs-paquet').value) || 20
    };
    localStorage.setItem('configTabac', JSON.stringify(config));
    calculerEconomies();
});

btnOuvrirDepense.addEventListener('click', () => formDepense.classList.remove('masque'));
btnAnnulerDepense.addEventListener('click', () => formDepense.classList.add('masque'));

formDepense.addEventListener('submit', (e) => {
    e.preventDefault();
    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const nouvelleDepense = {
        id: Date.now(),
        cat: document.getElementById('dep-cat').value,
        montant: parseFloat(document.getElementById('dep-montant').value),
        nom: document.getElementById('dep-nom').value || 'Achat Vape',
        date: new Date().toLocaleDateString('fr-FR')
    };
    depenses.unshift(nouvelleDepense);
    localStorage.setItem('depensesVape', JSON.stringify(depenses));
    formDepense.reset();
    formDepense.classList.add('masque');
    afficherFinances();
});

function afficherFinances() {
    calculerEconomies();
    const depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    const listeEl = document.getElementById('liste-depenses');

    if (depenses.length === 0) {
        listeEl.innerHTML = '<p class="texte-vide">Aucune dépense enregistrée.</p>';
    } else {
        listeEl.innerHTML = depenses.map(d => `
            <div class="carte item-objectif">
                <div>
                    <strong>${d.nom}</strong> (${d.cat})
                    <br><span style="font-size: 0.8rem; color: #8b949e;">${d.date}</span>
                </div>
                <div>
                    <strong>-${d.montant.toFixed(2)} €</strong>
                    <button class="btn-suppr" onclick="supprimerDepense(${d.id})">✕</button>
                </div>
            </div>
        `).join('');
    }
}

window.supprimerDepense = function(id) {
    let depenses = JSON.parse(localStorage.getItem('depensesVape')) || [];
    depenses = depenses.filter(d => d.id !== id);
    localStorage.setItem('depensesVape', JSON.stringify(depenses));
    afficherFinances();
};

// -------------------------------------------------------------
// JALONS SANTÉ
// -------------------------------------------------------------
const jalonsSanteData = [
    { jours: 1, titre: '24 Heures', desc: 'Le monoxyde de carbone est totalement éliminé de l\'organisme.' },
    { jours: 2, titre: '48 Heures', desc: 'Le goût et l\'odorat s\'améliorent. Les terminaisons nerveuses se régénèrent.' },
    { jours: 14, titre: '2 Semaines', desc: 'La respiration devient plus aisée. Le souffle s\'améliore à l\'effort.' },
    { jours: 30, titre: '1 Mois', desc: 'La toux et l\'essoufflement diminuent. Vous regagnez en énergie générale.' },
    { jours: 90, titre: '3 Mois', desc: 'La fonction pulmonaire s\'améliore nettement. Circulation sanguine normalisée.' },
    { jours: 365, titre: '1 An', desc: 'Le risque de maladie cardiovasculaire est réduit de moitié par rapport à un fumeur.' }
];

function afficherSante() {
    const joursActuels = getJoursEcoules();
    const container = document.getElementById('timeline-sante');

    container.innerHTML = jalonsSanteData.map(j => {
        const atteint = joursActuels >= j.jours;
        return `
            <div class="carte jalon-sante ${atteint ? 'atteint' : ''}">
                <h4>${atteint ? '✅' : '⏳'} ${j.titre}</h4>
                <p>${j.desc}</p>
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------------
// RECETTES & FLACONS (AFFICHER & GÉRER)
// -------------------------------------------------------------
function afficherTout() {
    const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
    const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];

    const nomLiquideEl = document.getElementById('nom-liquide');
    const detailsNicotineEl = document.getElementById('details-nicotine');
    const detailsFlaconEl = document.getElementById('details-flacon');
    const btnTerminer = document.getElementById('btn-terminer');
    const btnOuvrirAjout = document.getElementById('btn-ouvrir-ajout');
    const listeHistoriqueEl = document.getElementById('liste-historique');

    if (flaconActif) {
        const dateDebut = new Date(flaconActif.dateOuverture);
        const dateFormatee = dateDebut.toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        nomLiquideEl.textContent = flaconActif.nom;
        detailsNicotineEl.textContent = `${flaconActif.nicotine} mg/ml ${flaconActif.type === 'DIY' ? `• DIY ${flaconActif.arome}%` : ''}`;
        detailsFlaconEl.textContent = `${flaconActif.volume} ml au départ • Entamé le ${dateFormatee}`;
        
        btnTerminer.style.display = 'block';
        btnOuvrirAjout.style.display = 'none';
    } else {
        nomLiquideEl.textContent = 'Aucun flacon actif';
        detailsNicotineEl.textContent = '';
        detailsFlaconEl.textContent = '';
        btnTerminer.style.display = 'none';
        btnOuvrirAjout.style.display = 'block';
    }

    if (historique.length === 0) {
        listeHistoriqueEl.innerHTML = '<p class="texte-vide">Aucun flacon terminé pour le moment.</p>';
    } else {
        listeHistoriqueEl.innerHTML = historique.map(item => `
            <div class="carte carte-historique">
                <strong>${item.nom}</strong> (${item.nicotine} mg/ml)
                <br>
                <span style="font-size:0.85rem; color:#8b949e;">Durée : ${item.dureeJours} jour(s) • Moyenne : <strong>${item.consommationMoyenne} ml/jour</strong></span>
            </div>
        `).join('');
    }
}

function afficherRecettes() {
    const recettes = JSON.parse(localStorage.getItem('recettesLiquides')) || [];
    const listeRecettesEl = document.getElementById('liste-recettes');
    const selectRecette = document.getElementById('select-recette');

    if (recettes.length === 0) {
        listeRecettesEl.innerHTML = '<p class="texte-vide">Aucun liquide enregistré.</p>';
    } else {
        listeRecettesEl.innerHTML = recettes.map(r => `
            <div class="carte">
                <strong>${r.nom}</strong> — ${r.nicotine} mg/ml (${r.type}${r.arome ? ` ${r.arome}%` : ''})
            </div>
        `).join('');
    }

    selectRecette.innerHTML = '<option value="">-- Saisie libre --</option>' + 
        recettes.map(r => `<option value="${r.id}">${r.nom} (${r.nicotine} mg/ml)</option>`).join('');
}

// Initialisation
window.onload = function() {
    calculerJoursSansTabac();
    mettreAJourCerisierHD();
    calculerEconomies();
    afficherTout();
};
