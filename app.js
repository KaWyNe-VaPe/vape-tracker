// =============================================================
// AUTO-SUPPRESSION SECURE DU SPLASH SCREEN
// =============================================================
setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.remove();
}, 3000);

// =============================================================
// VAPE TRACKER PWA - CODE PRINCIPAL APPLICATION
// =============================================================

const JALONS_SANTE = [
    { delaiHeures: 20, titre: "Pression sanguine", desc: "La pression sanguine et le pouls redeviennent normaux." },
    { delaiHeures: 8, titre: "Oxygénation", desc: "La quantité de monoxyde de carbone dans le sang diminue de moitié." },
    { delaiHeures: 24, titre: "Risque d'infarctus", desc: "Le monoxyde de carbone est éliminé. Le risque d'infarctus diminue." },
    { delaiHeures: 48, titre: "Goût et Odorat", desc: "La nicotine est éliminée. Le goût et l'odorat s'améliorent." },
    { delaiHeures: 72, titre: "Respiration", desc: "Les bronches se relâchent, respirer devient plus facile." },
    { delaiHeures: 336, titre: "Energie (2 sem.)", desc: "La circulation sanguine s'améliore, le souffle revient." },
    { delaiHeures: 720, titre: "Capacité pulmonaire (1 mois)", desc: "Toux et fatigue diminuent. Les poumons se nettoient." },
    { delaiHeures: 2160, titre: "Fonction pulmonaire (3 mois)", desc: "La fonction pulmonaire s'est accrue de 10 à 30%." },
    { delaiHeures: 6480, titre: "Toux et essoufflement (9 mois)", desc: "Les cils pulmonaires ont repoussé." },
    { delaiHeures: 8760, titre: "Risque cardiaque (-50%)", desc: "Le risque de maladie cardiovasculaire est réduit de moitié." }
];

let configUser = null;
let flacons = [];
let recettes = [];
let depenses = [];
let objectifs = [];

try {
    configUser = JSON.parse(localStorage.getItem('vt_config')) || null;
    flacons = JSON.parse(localStorage.getItem('vt_flacons')) || [];
    recettes = JSON.parse(localStorage.getItem('vt_recettes')) || [];
    depenses = JSON.parse(localStorage.getItem('vt_depenses')) || [];
    objectifs = JSON.parse(localStorage.getItem('vt_objectifs')) || [];
} catch (e) {
    console.error("Erreur lecture LocalStorage", e);
}

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err));
    }

    if (!configUser || !configUser.dateArret) {
        afficherEcran('ecran-onboarding');
        const entete = document.getElementById('entete-app');
        const nav = document.getElementById('navigation-basse');
        if (entete) entete.style.display = 'none';
        if (nav) nav.style.display = 'none';
    } else {
        initialiserInterface();
    }

    configurerEcouteurs();
});

function initialiserInterface() {
    const entete = document.getElementById('entete-app');
    const nav = document.getElementById('navigation-basse');
    if (entete) entete.style.display = 'flex';
    if (nav) nav.style.display = 'flex';
    
    try {
        if (document.getElementById('cigs-jour')) document.getElementById('cigs-jour').value = configUser.cigsJour || 15;
        if (document.getElementById('prix-paquet')) document.getElementById('prix-paquet').value = configUser.prixPaquet || 12.5;
        if (document.getElementById('config-vapote')) document.getElementById('config-vapote').value = configUser.vapote ? 'oui' : 'non';
        if (document.getElementById('config-nicotine')) document.getElementById('config-nicotine').value = configUser.nicotineActuelle ?? 12;

        const grpNic = document.getElementById('groupe-config-nicotine');
        if (grpNic) {
            if (configUser.vapote) grpNic.classList.remove('masque-champ');
            else grpNic.classList.add('masque-champ');
        }
    } catch (err) {
        console.warn("Champs non initialisés", err);
    }

    mettreAJourTout();
    afficherEcran('ecran-accueil');
}

function mettreAJourTout() {
    mettreAJourDashboard();
    mettreAJourCerisierHD();
    afficherFlaconActif();
    afficherHistoriqueFlacons();
    afficherRecettes();
    afficherTimelineSante();
    afficherFinances();
    afficherObjectifs();
    remplirSelectRecettes();
}

function getJoursEcoules() {
    if (!configUser || !configUser.dateArret) return 0;
    const debut = new Date(configUser.dateArret);
    const maintenant = new Date();
    const diffTemps = Math.abs(maintenant - debut);
    return Math.floor(diffTemps / (1000 * 60 * 60 * 24));
}

function getHeuresEcoulees() {
    if (!configUser || !configUser.dateArret) return 0;
    const debut = new Date(configUser.dateArret);
    const maintenant = new Date();
    return Math.abs(maintenant - debut) / (1000 * 60 * 60);
}

function mettreAJourDashboard() {
    const jours = getJoursEcoules();
    const cigsParJour = configUser ? (configUser.cigsJour || 15) : 15;
    const prixPaquet = configUser ? (configUser.prixPaquet || 12.5) : 12.5;
    const cigsParPaquet = configUser ? (configUser.cigsPaquet || 20) : 20;

    const cigsEvitees = Math.floor(jours * cigsParJour);
    const economieBrute = (cigsEvitees / cigsParPaquet) * prixPaquet;

    const totalDepensesVape = depenses.reduce((acc, d) => acc + d.montant, 0);
    const economieNette = economieBrute - totalDepensesVape;

    if (document.getElementById('card-jours')) document.getElementById('card-jours').textContent = jours;
    if (document.getElementById('prenom-accueil')) {
        document.getElementById('prenom-accueil').textContent = (configUser && configUser.prenom) ? `Bravo ${configUser.prenom} !` : 'Jours d\'arrêt';
    }
    if (document.getElementById('card-cigs')) document.getElementById('card-cigs').textContent = cigsEvitees;
    if (document.getElementById('card-economies')) document.getElementById('card-economies').textContent = `${economieNette.toFixed(2)} €`;

    const cardNicotineVal = document.getElementById('card-nicotine-valeur');
    const cardNicotineObj = document.getElementById('card-nicotine-objectif');

    if (cardNicotineVal) {
        if (configUser && configUser.vapote && configUser.nicotineActuelle !== undefined) {
            cardNicotineVal.textContent = `${configUser.nicotineActuelle} mg/ml`;
        } else {
            cardNicotineVal.textContent = '0 mg/ml (Non vapoteur)';
        }
    }

    if (cardNicotineObj) {
        const maintenant = new Date();
        const objectifsFuturs = objectifs
            .filter(o => new Date(o.date) >= maintenant)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (objectifsFuturs.length > 0) {
            const pro = objectifsFuturs[0];
            const dateFormatee = new Date(pro.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            cardNicotineObj.textContent = `${pro.titre} le ${dateFormatee}`;
        } else {
            cardNicotineObj.textContent = 'Aucun objectif futur';
        }
    }
}

// =============================================================
// GESTION DE L'ARBRE (RETOUR À L'IMAGE PNG D'ORIGINE)
// =============================================================
function mettreAJourCerisierHD() {
    const jours = getJoursEcoules();
    const badge = document.getElementById('nom-stade-arbre');
    const conteneur = document.getElementById('conteneur-svg-arbre');

    let nomStade = '';
    let numStade = 1;

    if (jours <= 30) {
        nomStade = 'Stade 1 : Jeune pousse (0 à 1 mois) 🌿';
        numStade = 1;
    } else if (jours <= 90) {
        nomStade = 'Stade 2 : Petit arbuste (1 à 3 mois) 🪴';
        numStade = 2;
    } else if (jours <= 150) {
        nomStade = 'Stade 3 : Arbre vigoureux (3 à 5 mois) 🪵';
        numStade = 3;
    } else if (jours <= 240) {
        nomStade = 'Stade 4 : Premiers bourgeons (5 à 8 mois) 🌸';
        numStade = 4;
    } else {
        nomStade = 'Stade 5 : Cerisier majestueux (8 mois à 1 an+) 🌸✨';
        numStade = 5;
    }

    if (badge) badge.textContent = nomStade;

    if (conteneur) {
        const urlImage = `./arbre-stade-${numStade}.png`;
        conteneur.innerHTML = `
            <img src="${urlImage}" 
                 alt="${nomStade}" 
                 class="arbre-brise"
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px; display: block;"
                 onerror="this.onerror=null; this.src='icon.png';">
        `;
    }

    genererParticules();
}

function genererParticules() {
    const conteneur = document.getElementById('particules');
    if (!conteneur) return;
    conteneur.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const petale = document.createElement('div');
        petale.className = 'petale-lumineux';
        const taille = Math.random() * 8 + 6;
        petale.style.width = `${taille}px`;
        petale.style.height = `${taille}px`;
        petale.style.left = `${Math.random() * 100}%`;
        petale.style.animationDuration = `${Math.random() * 4 + 4}s`;
        petale.style.animationDelay = `${Math.random() * 3}s`;
        conteneur.appendChild(petale);
    }
}

// =============================================================
// CALCULATEUR DIY EXACT EN DIRECT & AFFICHAGE RECETTES
// =============================================================
function calculerDosagesDIY() {
    const volTotal = parseFloat(document.getElementById('recette-volume').value) || 0;
    const nicoVisee = parseFloat(document.getElementById('recette-nicotine').value) || 0;
    const pctArome = parseFloat(document.getElementById('recette-arome').value) || 0;
    const tauxBooster = parseFloat(document.getElementById('recette-taux-booster').value) || 20;

    const volArome = (volTotal * pctArome) / 100;
    const volBooster = tauxBooster > 0 ? (volTotal * nicoVisee) / tauxBooster : 0;
    const nbrFiolesBooster = (volBooster / 10).toFixed(1);

    let volBase = volTotal - volArome - volBooster;
    
    if (volBase < 0) {
        volBase = 0;
        if (document.getElementById('calc-base')) {
            document.getElementById('calc-base').style.color = '#f85149';
        }
    } else {
        if (document.getElementById('calc-base')) {
            document.getElementById('calc-base').style.color = '#e6edf3';
        }
    }

    if (document.getElementById('calc-arome')) {
        document.getElementById('calc-arome').textContent = `${volArome.toFixed(1)} ml (${pctArome}%)`;
    }
    if (document.getElementById('calc-booster')) {
        document.getElementById('calc-booster').textContent = `${volBooster.toFixed(1)} ml (${nbrFiolesBooster} fiole${nbrFiolesBooster > 1 ? 's' : ''})`;
    }
    if (document.getElementById('calc-base')) {
        document.getElementById('calc-base').textContent = `${volBase.toFixed(1)} ml`;
    }

    return { volTotal, volArome, volBooster, volBase, nbrFiolesBooster };
}

function afficherRecettes() {
    const conteneur = document.getElementById('liste-recettes');
    if (!conteneur) return;
    if (recettes.length === 0) {
        conteneur.innerHTML = '<p class="texte-vide">Aucune recette DIY enregistrée.</p>';
        return;
    }

    conteneur.innerHTML = recettes.map(r => `
        <div class="carte">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>🧪 ${r.nom}</strong>
                <button class="btn-suppr" onclick="supprimerRecette('${r.id}')">🗑️</button>
            </div>
            <p class="texte-secondaire" style="margin-top:4px;">
                <strong>Volume Total : ${r.volumeTotal || 50} ml</strong> | Nicotine : ${r.nicotine} mg/ml
            </p>
            <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px; margin-top: 8px; font-size: 0.8rem;">
                <div style="display:flex; justify-content:space-between;"><span>🧪 Concentré (${r.arome}%) :</span> <strong>${(r.volArome || 0).toFixed(1)} ml</strong></div>
                <div style="display:flex; justify-content:space-between; margin: 3px 0;"><span>⚡ Booster Nicotine :</span> <strong>${(r.volBooster || 0).toFixed(1)} ml (${r.nbrFioles || 0} fioles)</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>💧 Base Neutre :</span> <strong>${(r.volBase || 0).toFixed(1)} ml</strong></div>
            </div>
        </div>
    `).join('');
}

function remplirSelectRecettes() {
    const select = document.getElementById('select-recette');
    if (!select) return;
    select.innerHTML = '<option value="">-- Saisie libre --</option>';
    recettes.forEach(r => {
        select.innerHTML += `<option value="${r.id}">${r.nom} (${r.volumeTotal}ml - ${r.nicotine}mg)</option>`;
    });
}

function supprimerRecette(id) {
    recettes = recettes.filter(r => r.id !== id);
    localStorage.setItem('vt_recettes', JSON.stringify(recettes));
    mettreAJourTout();
}

function afficherFlaconActif() {
    const actif = flacons.find(f => f.actif);
    const btnTerminer = document.getElementById('btn-terminer');

    if (actif) {
        if (document.getElementById('nom-liquide')) document.getElementById('nom-liquide').textContent = actif.nom;
        if (document.getElementById('details-nicotine')) document.getElementById('details-nicotine').textContent = `Nicotine : ${actif.nicotine} mg/ml | Type : ${actif.type}`;
        
        const dateOuv = new Date(actif.dateOuverture);
        const heuresUtilisation = Math.floor((new Date() - dateOuv) / (1000 * 60 * 60));
        if (document.getElementById('details-flacon')) {
            document.getElementById('details-flacon').textContent = `Ouvert le ${dateOuv.toLocaleDateString()} (${heuresUtilisation}h d'utilisation)`;
        }
        if (btnTerminer) btnTerminer.style.display = 'block';
    } else {
        if (document.getElementById('nom-liquide')) document.getElementById('nom-liquide').textContent = 'Aucun flacon en cours';
        if (document.getElementById('details-nicotine')) document.getElementById('details-nicotine').textContent = 'Enregistre un flacon pour suivre ta consommation.';
        if (document.getElementById('details-flacon')) document.getElementById('details-flacon').textContent = '';
        if (btnTerminer) btnTerminer.style.display = 'none';
    }
}

function afficherHistoriqueFlacons() {
    const conteneur = document.getElementById('liste-historique');
    if (!conteneur) return;
    const termines = flacons.filter(f => !f.actif);

    if (termines.length === 0) {
        conteneur.innerHTML = '<p class="texte-vide">Aucun flacon terminé pour le moment.</p>';
        return;
    }

    conteneur.innerHTML = termines.map(f => `
        <div class="carte">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>${f.nom} (${f.nicotine} mg)</strong>
                <button class="btn-suppr" onclick="supprimerFlacon('${f.id}')">🗑️</button>
            </div>
            <p class="texte-secondaire">Ouvert le ${new Date(f.dateOuverture).toLocaleDateString()} (${f.volume} ml)</p>
        </div>
    `).join('');
}

function supprimerFlacon(id) {
    flacons = flacons.filter(f => f.id !== id);
    localStorage.setItem('vt_flacons', JSON.stringify(flacons));
    mettreAJourTout();
}

function afficherTimelineSante() {
    const conteneur = document.getElementById('timeline-sante');
    if (!conteneur) return;
    const heures = getHeuresEcoulees();

    conteneur.innerHTML = JALONS_SANTE.map(j => {
        const atteint = heures >= j.delaiHeures;
        return `
            <div class="carte jalon-sante ${atteint ? 'atteint' : ''}">
                <div style="display:flex; justify-content:space-between;">
                    <strong>${j.titre}</strong>
                    <span>${atteint ? '✅ Atteint' : '⏳ En cours'}</span>
                </div>
                <p class="texte-secondaire" style="margin-top:6px;">${j.desc}</p>
            </div>
        `;
    }).join('');
}

function afficherFinances() {
    const jours = getJoursEcoules();
    const cigsParJour = configUser ? (configUser.cigsJour || 15) : 15;
    const prixPaquet = configUser ? (configUser.prixPaquet || 12.5) : 12.5;
    const cigsParPaquet = configUser ? (configUser.cigsPaquet || 20) : 20;

    const tabacEvite = ((jours * cigsParJour) / cigsParPaquet) * prixPaquet;
    const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
    const economieNette = tabacEvite - totalDepenses;

    if (document.getElementById('tabac-evite-total')) document.getElementById('tabac-evite-total').textContent = `${tabacEvite.toFixed(2)} €`;
    if (document.getElementById('dépenses-vape-total')) document.getElementById('dépenses-vape-total').textContent = `${totalDepenses.toFixed(2)} €`;
    if (document.getElementById('economie-nette-detail')) document.getElementById('economie-nette-detail').textContent = `${economieNette.toFixed(2)} €`;

    const conteneur = document.getElementById('liste-depenses');
    if (!conteneur) return;
    if (depenses.length === 0) {
        conteneur.innerHTML = '<p class="texte-vide">Aucune dépense enregistrée.</p>';
        return;
    }

    conteneur.innerHTML = depenses.map(d => `
        <div class="carte" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${d.nom || d.categorie}</strong>
                <p class="texte-secondaire">${new Date(d.date).toLocaleDateString()} - ${d.categorie}</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:#f85149; font-weight:bold;">-${d.montant.toFixed(2)} €</span>
                <button class="btn-suppr" onclick="supprimerDepense('${d.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function supprimerDepense(id) {
    depenses = depenses.filter(d => d.id !== id);
    localStorage.setItem('vt_depenses', JSON.stringify(depenses));
    mettreAJourTout();
}

function afficherObjectifs() {
    const conteneur = document.getElementById('liste-objectifs');
    if (!conteneur) return;
    if (objectifs.length === 0) {
        conteneur.innerHTML = '<p class="texte-vide">Aucun objectif fixé.</p>';
        return;
    }

    conteneur.innerHTML = objectifs.map(o => `
        <div class="carte item-objectif">
            <div>
                <strong>${o.titre}</strong>
                <p class="texte-secondaire">Cible : ${new Date(o.date).toLocaleDateString()}</p>
            </div>
            <button class="btn-suppr" onclick="supprimerObjectif('${o.id}')">🗑️</button>
        </div>
    `).join('');
}

function supprimerObjectif(id) {
    objectifs = objectifs.filter(o => o.id !== id);
    localStorage.setItem('vt_objectifs', JSON.stringify(objectifs));
    mettreAJourTout();
}

function afficherEcran(idEcran) {
    document.querySelectorAll('.ecran').forEach(e => e.classList.add('masque'));
    const ecranCible = document.getElementById(idEcran);
    if (ecranCible) ecranCible.classList.remove('masque');

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('actif'));
    const navAssociee = document.getElementById(`nav-${idEcran.replace('ecran-', '')}`);
    if (navAssociee) navAssociee.classList.add('actif');
}

function configurerEcouteurs() {
    document.getElementById('nav-accueil').onclick = () => afficherEcran('ecran-accueil');
    document.getElementById('nav-recettes').onclick = () => afficherEcran('ecran-recettes');
    document.getElementById('nav-sante').onclick = () => afficherEcran('ecran-sante');
    document.getElementById('nav-finances').onclick = () => afficherEcran('ecran-finances');
    document.getElementById('nav-objectifs').onclick = () => afficherEcran('ecran-objectifs');

    // ÉCOUTEURS DE CALCUL DIY EN DIRECT (COMPATIBLE WEB ET MOBILE)
    const champsDIY = ['recette-volume', 'recette-nicotine', 'recette-arome', 'recette-taux-booster'];
    champsDIY.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            ['input', 'keyup', 'change'].forEach(evt => {
                el.addEventListener(evt, calculerDosagesDIY);
            });
        }
    });

    const selectObVapote = document.getElementById('ob-vapote');
    const grpObNicotine = document.getElementById('groupe-ob-nicotine');
    if (selectObVapote && grpObNicotine) {
        selectObVapote.addEventListener('change', (e) => {
            if (e.target.value === 'non') grpObNicotine.classList.add('masque-champ');
            else grpObNicotine.classList.remove('masque-champ');
        });
    }

    const selectCfgVapote = document.getElementById('config-vapote');
    const grpCfgNicotine = document.getElementById('groupe-config-nicotine');
    if (selectCfgVapote && grpCfgNicotine) {
        selectCfgVapote.addEventListener('change', (e) => {
            if (e.target.value === 'non') grpCfgNicotine.classList.add('masque-champ');
            else grpCfgNicotine.classList.remove('masque-champ');
        });
    }

    document.getElementById('form-onboarding').onsubmit = (e) => {
        e.preventDefault();
        const estVapoteur = document.getElementById('ob-vapote').value === 'oui';
        configUser = {
            prenom: document.getElementById('ob-prenom').value,
            dateArret: document.getElementById('ob-date-arret').value,
            cigsJour: parseFloat(document.getElementById('ob-cigs-jour').value),
            prixPaquet: parseFloat(document.getElementById('ob-prix-paquet').value),
            cigsPaquet: 20,
            vapote: estVapoteur,
            nicotineActuelle: estVapoteur ? parseFloat(document.getElementById('ob-nicotine-actuelle').value || 0) : 0
        };
        localStorage.setItem('vt_config', JSON.stringify(configUser));
        initialiserInterface();
    };

    document.getElementById('form-config-tabac').onsubmit = (e) => {
        e.preventDefault();
        if (!configUser) configUser = {};
        configUser.cigsJour = parseFloat(document.getElementById('cigs-jour').value);
        configUser.prixPaquet = parseFloat(document.getElementById('prix-paquet').value);
        configUser.cigsPaquet = parseFloat(document.getElementById('cigs-paquet').value);
        
        const estVapoteur = document.getElementById('config-vapote').value === 'oui';
        configUser.vapote = estVapoteur;
        configUser.nicotineActuelle = estVapoteur ? parseFloat(document.getElementById('config-nicotine').value || 0) : 0;

        localStorage.setItem('vt_config', JSON.stringify(configUser));
        mettreAJourTout();
        alert('Paramètres mis à jour !');
    };

    document.getElementById('btn-ouvrir-ajout').onclick = () => afficherEcran('ecran-ajout');
    document.getElementById('btn-annuler').onclick = () => afficherEcran('ecran-accueil');

    document.getElementById('select-recette').onchange = (e) => {
        const idRecette = e.target.value;
        if (idRecette) {
            const r = recettes.find(item => item.id === idRecette);
            if (r) {
                document.getElementById('nom').value = r.nom;
                document.getElementById('type').value = r.type;
                document.getElementById('nicotine').value = r.nicotine;
                document.getElementById('volume').value = r.volumeTotal || 50;
                document.getElementById('arome').value = r.arome || 0;
            }
        }
    };

    document.getElementById('form-flacon').onsubmit = (e) => {
        e.preventDefault();
        flacons.forEach(f => f.actif = false);

        const nouveauFlacon = {
            id: Date.now().toString(),
            nom: document.getElementById('nom').value,
            type: document.getElementById('type').value,
            volume: parseFloat(document.getElementById('volume').value),
            nicotine: parseFloat(document.getElementById('nicotine').value),
            arome: parseFloat(document.getElementById('arome').value) || 0,
            dateOuverture: document.getElementById('date-ouverture').value || new Date().toISOString(),
            actif: true
        };

        flacons.unshift(nouveauFlacon);
        localStorage.setItem('vt_flacons', JSON.stringify(flacons));
        mettreAJourTout();
        afficherEcran('ecran-accueil');
    };

    document.getElementById('btn-terminer').onclick = () => {
        const actif = flacons.find(f => f.actif);
        if (actif) {
            actif.actif = false;
            actif.dateFermeture = new Date().toISOString();
            localStorage.setItem('vt_flacons', JSON.stringify(flacons));
            mettreAJourTout();
        }
    };

    // FORMULAIRE RECETTE DIY
    document.getElementById('btn-ouvrir-ajout-recette').onclick = () => {
        document.getElementById('form-recette').classList.remove('masque');
        calculerDosagesDIY();
    };
    document.getElementById('btn-annuler-recette').onclick = () => {
        document.getElementById('form-recette').classList.add('masque');
    };

    document.getElementById('form-recette').onsubmit = (e) => {
        e.preventDefault();
        const calcs = calculerDosagesDIY();

        const nouvelleRecette = {
            id: Date.now().toString(),
            nom: document.getElementById('recette-nom').value,
            type: document.getElementById('recette-type').value,
            nicotine: parseFloat(document.getElementById('recette-nicotine').value),
            arome: parseFloat(document.getElementById('recette-arome').value) || 0,
            volumeTotal: calcs.volTotal,
            volArome: calcs.volArome,
            volBooster: calcs.volBooster,
            nbrFioles: calcs.nbrFiolesBooster,
            volBase: calcs.volBase
        };

        recettes.unshift(nouvelleRecette);
        localStorage.setItem('vt_recettes', JSON.stringify(recettes));
        document.getElementById('form-recette').reset();
        document.getElementById('form-recette').classList.add('masque');
        mettreAJourTout();
    };

    document.getElementById('btn-ouvrir-depense').onclick = () => {
        document.getElementById('form-depense').classList.remove('masque');
    };
    document.getElementById('btn-annuler-depense').onclick = () => {
        document.getElementById('form-depense').classList.add('masque');
    };

    document.getElementById('form-depense').onsubmit = (e) => {
        e.preventDefault();
        const nouvelleDepense = {
            id: Date.now().toString(),
            categorie: document.getElementById('dep-cat').value,
            nom: document.getElementById('dep-nom').value,
            montant: parseFloat(document.getElementById('dep-montant').value),
            date: new Date().toISOString()
        };
        depenses.unshift(nouvelleDepense);
        localStorage.setItem('vt_depenses', JSON.stringify(depenses));
        document.getElementById('form-depense').reset();
        document.getElementById('form-depense').classList.add('masque');
        mettreAJourTout();
    };

    document.getElementById('btn-ouvrir-ajout-objectif').onclick = () => {
        document.getElementById('form-objectif').classList.remove('masque');
    };
    document.getElementById('btn-annuler-objectif').onclick = () => {
        document.getElementById('form-objectif').classList.add('masque');
    };

    document.getElementById('form-objectif').onsubmit = (e) => {
        e.preventDefault();
        const nouvelObjectif = {
            id: Date.now().toString(),
            titre: document.getElementById('obj-titre').value,
            date: document.getElementById('obj-date').value
        };
        objectifs.unshift(nouvelObjectif);
        localStorage.setItem('vt_objectifs', JSON.stringify(objectifs));
        document.getElementById('form-objectif').reset();
        document.getElementById('form-objectif').classList.add('masque');
        mettreAJourTout();
    };

    document.getElementById('btn-notifications').onclick = () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('Notifications activées avec succès ! 🌸');
                    new Notification('Vape Tracker', {
                        body: 'Félicitations pour ton engagement ! Ton cerisier te remercie 🌸',
                        icon: 'icon.png'
                    });
                }
            });
        }
    };
}
