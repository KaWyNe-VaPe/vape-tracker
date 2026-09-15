// =============================================================
// VAPE TRACKER PWA - CODE PRINCIPAL APPLICATION
// =============================================================
// SUPPRESSION PHYSIQUE DU SPLASH SCREEN POUR DÉBLOQUER LES CLICS
setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.remove(); // Supprime complètement l'élément du code HTML
    }
}, 3000);
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

let configUser = JSON.parse(localStorage.getItem('vt_config')) || null;
let flacons = JSON.parse(localStorage.getItem('vt_flacons')) || [];
let recettes = JSON.parse(localStorage.getItem('vt_recettes')) || [];
let depenses = JSON.parse(localStorage.getItem('vt_depenses')) || [];
let objectifs = JSON.parse(localStorage.getItem('vt_objectifs')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err));
    }

    if (!configUser || !configUser.dateArret) {
        afficherEcran('ecran-onboarding');
        document.getElementById('entete-app').style.display = 'none';
        document.querySelector('nav').style.display = 'none';
    } else {
        initialiserInterface();
    }

    configurerEcouteurs();
});

function initialiserInterface() {
    document.getElementById('entete-app').style.display = 'flex';
    document.querySelector('nav').style.display = 'flex';
    
    // Champs de config profil/finances
    document.getElementById('cigs-jour').value = configUser.cigsJour || 15;
    document.getElementById('prix-paquet').value = configUser.prixPaquet || 12.5;
    document.getElementById('config-vapote').value = configUser.vapote ? 'oui' : 'non';
    document.getElementById('config-nicotine').value = configUser.nicotineActuelle ?? 12;

    const grpNic = document.getElementById('groupe-config-nicotine');
    if (grpNic) {
        if (configUser.vapote) {
            grpNic.classList.remove('masque-champ');
        } else {
            grpNic.classList.add('masque-champ');
        }
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
    const heures = getHeuresEcoulees();
    
    const cigsParJour = configUser.cigsJour || 15;
    const prixPaquet = configUser.prixPaquet || 12.5;
    const cigsParPaquet = configUser.cigsPaquet || 20;

    const cigsEvitees = Math.floor(jours * cigsParJour);
    const economieBrute = (cigsEvitees / cigsParPaquet) * prixPaquet;

    const totalDepensesVape = depenses.reduce((acc, d) => acc + d.montant, 0);
    const economieNette = economieBrute - totalDepensesVape;

    document.getElementById('card-jours').textContent = jours;
    document.getElementById('prenom-accueil').textContent = configUser.prenom ? `Bravo ${configUser.prenom} !` : 'Jours d\'arrêt';
    document.getElementById('card-cigs').textContent = cigsEvitees;
    document.getElementById('card-economies').textContent = `${economieNette.toFixed(2)} €`;

    // Carte 4 : Nicotine actuelle & Prochain Objectif
    const cardNicotineVal = document.getElementById('card-nicotine-valeur');
    const cardNicotineObj = document.getElementById('card-nicotine-objectif');

    if (configUser.vapote && configUser.nicotineActuelle !== undefined) {
        cardNicotineVal.textContent = `${configUser.nicotineActuelle} mg/ml`;
    } else {
        cardNicotineVal.textContent = '0 mg/ml (Non vapoteur)';
    }

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

    const cheminImage = `./arbre-stade-${numStade}.png`;

    if (conteneur) {
        conteneur.style.zIndex = '1';
        conteneur.innerHTML = `
            <img src="${cheminImage}" 
                 alt="${nomStade}" 
                 class="arbre-brise"
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 16px; display: block; position: relative; z-index: 1;"
                 onerror="console.error('Erreur chargement image:', this.src);">
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

function afficherFlaconActif() {
    const actif = flacons.find(f => f.actif);
    const btnTerminer = document.getElementById('btn-terminer');

    if (actif) {
        document.getElementById('nom-liquide').textContent = actif.nom;
        document.getElementById('details-nicotine').textContent = `Nicotine : ${actif.nicotine} mg/ml | Type : ${actif.type}`;
        
        const dateOuv = new Date(actif.dateOuverture);
        const heuresUtilisation = Math.floor((new Date() - dateOuv) / (1000 * 60 * 60));
        document.getElementById('details-flacon').textContent = `Ouvert le ${dateOuv.toLocaleDateString()} (${heuresUtilisation}h d'utilisation)`;
        
        btnTerminer.style.display = 'block';
    } else {
        document.getElementById('nom-liquide').textContent = 'Aucun flacon en cours';
        document.getElementById('details-nicotine').textContent = 'Enregistre un flacon pour suivre ta consommation.';
        document.getElementById('details-flacon').textContent = '';
        btnTerminer.style.display = 'none';
    }
}

function afficherHistoriqueFlacons() {
    const conteneur = document.getElementById('liste-historique');
    const termines = flacons.filter(f => !f.actif);

    if (termines.length === 0) {
        conteneur.innerHTML = '<p class="texte-vide">Aucun flacon terminé pour le moment.</p>';
        return;
    }

    conteneur.innerHTML = termines.map(f => {
        const dOuv = new Date(f.dateOuverture).toLocaleDateString();
        const dFin = new Date(f.dateFermeture).toLocaleDateString();
        return `
            <div class="carte">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>${f.nom} (${f.nicotine} mg)</strong>
                    <button class="btn-suppr" onclick="supprimerFlacon('${f.id}')">🗑️</button>
                </div>
                <p class="texte-secondaire">Du ${dOuv} au ${dFin} (${f.volume} ml)</p>
            </div>
        `;
    }).join('');
}

function supprimerFlacon(id) {
    flacons = flacons.filter(f => f.id !== id);
    localStorage.setItem('vt_flacons', JSON.stringify(flacons));
    mettreAJourTout();
}

function afficherRecettes() {
    const conteneur = document.getElementById('liste-recettes');
    if (recettes.length === 0) {
        conteneur.innerHTML = '<p class="texte-vide">Aucune recette enregistrée.</p>';
        return;
    }

    conteneur.innerHTML = recettes.map(r => `
        <div class="carte">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>${r.nom}</strong>
                <button class="btn-suppr" onclick="supprimerRecette('${r.id}')">🗑️</button>
            </div>
            <p class="texte-secondaire">Type : ${r.type} | Nicotine : ${r.nicotine} mg/ml ${r.arome ? '| Arôme : ' + r.arome + '%' : ''}</p>
        </div>
    `).join('');
}

function remplirSelectRecettes() {
    const select = document.getElementById('select-recette');
    select.innerHTML = '<option value="">-- Saisie libre --</option>';
    recettes.forEach(r => {
        select.innerHTML += `<option value="${r.id}">${r.nom} (${r.nicotine}mg)</option>`;
    });
}

function supprimerRecette(id) {
    recettes = recettes.filter(r => r.id !== id);
    localStorage.setItem('vt_recettes', JSON.stringify(recettes));
    mettreAJourTout();
}

function afficherTimelineSante() {
    const conteneur = document.getElementById('timeline-sante');
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
    const cigsParJour = configUser.cigsJour || 15;
    const prixPaquet = configUser.prixPaquet || 12.5;
    const cigsParPaquet = configUser.cigsPaquet || 20;

    const tabacEvite = ((jours * cigsParJour) / cigsParPaquet) * prixPaquet;
    const totalDepenses = depenses.reduce((acc, d) => acc + d.montant, 0);
    const economieNette = tabacEvite - totalDepenses;

    document.getElementById('tabac-evite-total').textContent = `${tabacEvite.toFixed(2)} €`;
    document.getElementById('dépenses-vape-total').textContent = `${totalDepenses.toFixed(2)} €`;
    document.getElementById('economie-nette-detail').textContent = `${economieNette.toFixed(2)} €`;

    const conteneur = document.getElementById('liste-depenses');
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
    // Navigation basse
    document.getElementById('nav-accueil').onclick = () => afficherEcran('ecran-accueil');
    document.getElementById('nav-recettes').onclick = () => afficherEcran('ecran-recettes');
    document.getElementById('nav-sante').onclick = () => afficherEcran('ecran-sante');
    document.getElementById('nav-finances').onclick = () => afficherEcran('ecran-finances');
    document.getElementById('nav-objectifs').onclick = () => afficherEcran('ecran-objectifs');

    // Onboarding : dynamique Oui/Non Vape
    const selectObVapote = document.getElementById('ob-vapote');
    const grpObNicotine = document.getElementById('groupe-ob-nicotine');
    if (selectObVapote && grpObNicotine) {
        selectObVapote.addEventListener('change', (e) => {
            if (e.target.value === 'non') {
                grpObNicotine.classList.add('masque-champ');
            } else {
                grpObNicotine.classList.remove('masque-champ');
            }
        });
    }

    // Config Finances : dynamique Oui/Non Vape
    const selectCfgVapote = document.getElementById('config-vapote');
    const grpCfgNicotine = document.getElementById('groupe-config-nicotine');
    if (selectCfgVapote && grpCfgNicotine) {
        selectCfgVapote.addEventListener('change', (e) => {
            if (e.target.value === 'non') {
                grpCfgNicotine.classList.add('masque-champ');
            } else {
                grpCfgNicotine.classList.remove('masque-champ');
            }
        });
    }

    // Soumission Onboarding Form
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

    // Soumission Configuration Tabac / Vape Form
    document.getElementById('form-config-tabac').onsubmit = (e) => {
        e.preventDefault();
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

    document.getElementById('btn-ouvrir-ajout-recette').onclick = () => {
        document.getElementById('form-recette').classList.remove('masque');
    };
    document.getElementById('btn-annuler-recette').onclick = () => {
        document.getElementById('form-recette').classList.add('masque');
    };

    document.getElementById('form-recette').onsubmit = (e) => {
        e.preventDefault();
        const nouvelleRecette = {
            id: Date.now().toString(),
            nom: document.getElementById('recette-nom').value,
            type: document.getElementById('recette-type').value,
            nicotine: parseFloat(document.getElementById('recette-nicotine').value),
            arome: parseFloat(document.getElementById('recette-arome').value) || 0
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
