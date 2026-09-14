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
            <svg viewBox="0 0 200 200" class="image-arbre-hd">
                <path d="M100 180 Q100 150 100 130" stroke="#4a3525" stroke-width="6" stroke-linecap="round" fill="none"/>
                <path d="M100 130 Q80 110 70 120 Q90 135 100 130" fill="#52b788"/>
                <path d="M100 130 Q120 110 130 120 Q110 135 100 130" fill="#74c69d"/>
            </svg>`;
    } else if (jours < 11) {
        nomStade = 'Stade 2 : Petit arbre 🪴';
        svgArbre = `
            <svg viewBox="0 0 200 200" class="image-arbre-hd">
                <path d="M100 180 Q95 130 100 90" stroke="#3d2616" stroke-width="10" stroke-linecap="round" fill="none"/>
                <path d="M100 120 Q70 100 60 105" stroke="#3d2616" stroke-width="5" stroke-linecap="round" fill="none"/>
                <circle cx="60" cy="105" r="15" fill="#74c69d" opacity="0.9"/>
                <circle cx="100" cy="80" r="22" fill="#52b788" opacity="0.9"/>
            </svg>`;
    } else if (jours < 21) {
        nomStade = 'Stade 3 : Branchement 🪵';
        svgArbre = `
            <svg viewBox="0 0 200 200" class="image-arbre-hd">
                <path d="M100 185 Q90 120 100 70" stroke="#2c1a0e" stroke-width="14" stroke-linecap="round" fill="none"/>
                <path d="M98 120 Q60 95 45 100" stroke="#2c1a0e" stroke-width="7" stroke-linecap="round" fill="none"/>
                <path d="M102 95 Q140 75 150 80" stroke="#2c1a0e" stroke-width="6" stroke-linecap="round" fill="none"/>
                <circle cx="45" cy="100" r="22" fill="#52b788" opacity="0.85"/>
                <circle cx="150" cy="80" r="25" fill="#74c69d" opacity="0.85"/>
                <circle cx="100" cy="60" r="30" fill="#40916c" opacity="0.9"/>
            </svg>`;
    } else if (jours < 36) {
        nomStade = 'Stade 4 : Premiers bourgeons 🌺';
        svgArbre = `
            <svg viewBox="0 0 200 200" class="image-arbre-hd">
                <defs>
                    <radialGradient id="grad-fleurs" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#ffb7c5"/>
                        <stop offset="100%" stop-color="#ff4081"/>
                    </radialGradient>
                </defs>
                <path d="M100 185 Q88 115 100 60" stroke="#2a1810" stroke-width="16" stroke-linecap="round" fill="none"/>
                <path d="M96 125 Q50 95 35 100" stroke="#2a1810" stroke-width="8" stroke-linecap="round" fill="none"/>
                <path d="M102 90 Q150 65 165 72" stroke="#2a1810" stroke-width="7" stroke-linecap="round" fill="none"/>
                <circle cx="35" cy="100" r="25" fill="#52b788" opacity="0.7"/>
                <circle cx="165" cy="72" r="28" fill="#74c69d" opacity="0.7"/>
                <circle cx="100" cy="50" r="35" fill="#40916c" opacity="0.8"/>
                <circle cx="30" cy="92" r="8" fill="url(#grad-fleurs)"/>
                <circle cx="160" cy="65" r="10" fill="url(#grad-fleurs)"/>
                <circle cx="90" cy="40" r="11" fill="url(#grad-fleurs)"/>
                <circle cx="115" cy="45" r="9" fill="url(#grad-fleurs)"/>
            </svg>`;
    } else if (jours < 61) {
        nomStade = 'Stade 5 : Premières fleurs 🌸';
        svgArbre = `
            <svg viewBox="0 0 200 200" class="image-arbre-hd">
                <path d="M100 185 Q85 110 100 50" stroke="#24140e" stroke-width="18" stroke-linecap="round" fill="none"/>
                <path d="M95 125 Q45 90 30 95" stroke="#24140e" stroke-width="9" stroke-linecap="round" fill="none"/>
                <path d="M102 85 Q155 60 170 68" stroke="#24140e" stroke-width="8" stroke-linecap="round" fill="none"/>
                <circle cx="100" cy="45" r="42" fill="#ffb7c5" opacity="0.85"/>
                <circle cx="30" cy="95" r="32" fill="#ff80ab" opacity="0.85"/>
                <circle cx="170" cy="68" r="35" fill="#ffcdd2" opacity="0.9"/>
                <circle cx="70" cy="65" r="28" fill="#f8bbd0" opacity="0.8"/>
                <circle cx="135" cy="50" r="30" fill="#ff4081" opacity="0.75"/>
            </svg>`;
    } else {
        nomStade = 'Stade 6 : Cerisier majestueux 🌸✨';
        svgArbre = `
            <svg viewBox="0 0 200 200" class="image-arbre-hd">
                <path d="M100 185 Q80 110 100 45" stroke="#1c0f0a" stroke-width="20" stroke-linecap="round" fill="none"/>
                <path d="M92 125 Q35 85 20 92" stroke="#1c0f0a" stroke-width="10" stroke-linecap="round" fill="none"/>
                <path d="M105 80 Q160 50 180 58" stroke="#1c0f0a" stroke-width="9" stroke-linecap="round" fill="none"/>
                <circle cx="100" cy="40" r="50" fill="#ffb7c5" opacity="0.9"/>
                <circle cx="20" cy="92" r="38" fill="#ff80ab" opacity="0.85"/>
                <circle cx="180" cy="58" r="42" fill="#ffcdd2" opacity="0.9"/>
                <circle cx="60" cy="60" r="35" fill="#f8bbd0" opacity="0.85"/>
                <circle cx="140" cy="42" r="38" fill="#ff4081" opacity="0.8"/>
                <circle cx="100" cy="25" r="30" fill="#ffffff" opacity="0.6"/>
            </svg>`;
    }

    if (conteneurSvg) {
        conteneurSvg.innerHTML = svgArbre;
    }
    if (badge) {
        badge.textContent = nomStade;
    }

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
