const dateArretCigarette = new Date('2026-08-17');

// Sélection des éléments HTML
const ecranAccueil = document.getElementById('ecran-accueil');
const ecranAjout = document.getElementById('ecran-ajout');
const btnOuvrirAjout = document.getElementById('btn-ouvrir-ajout');
const btnAnnuler = document.getElementById('btn-annuler');
const formFlacon = document.getElementById('form-flacon');
const inputDateOuverture = document.getElementById('date-ouverture');

const nomLiquideEl = document.getElementById('nom-liquide');
const detailsNicotineEl = document.getElementById('details-nicotine');
const detailsFlaconEl = document.getElementById('details-flacon');
const btnTerminer = document.getElementById('btn-terminer');
const listeHistoriqueEl = document.getElementById('liste-historique');

// 1. Calcul des jours sans tabac
function calculerJoursSansTabac() {
    const aujourdhui = new Date();
    const differenceTemps = aujourdhui - dateArretCigarette;
    const jours = Math.floor(differenceTemps / (1000 * 3600 * 24));

    const elementCompteur = document.getElementById('compteur-jours');
    if (elementCompteur) {
        elementCompteur.textContent = jours;
    }
}

// 2. Afficher le flacon actif et l'historique
function afficherTout() {
    const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
    const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];

    // Affichage du flacon actif
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

    // Affichage de l'historique
    if (historique.length === 0) {
        listeHistoriqueEl.innerHTML = '<p class="texte-vide">Aucun flacon terminé pour le moment.</p>';
    } else {
        listeHistoriqueEl.innerHTML = historique.map(item => `
            <div class="carte carte-historique">
                <strong>${item.nom}</strong> (${item.nicotine} mg/ml)
                <br>
                <span>Durée : ${item.dureeJours} jour(s) • Moyenne : <strong>${item.consommationMoyenne} ml/jour</strong></span>
            </div>
        `).join('');
    }
}

// 3. Bouton "Flacon terminé" et calculs
btnTerminer.addEventListener('click', () => {
    const flaconActif = JSON.parse(localStorage.getItem('flaconActif'));
    if (!flaconActif) return;

    const dateDebut = new Date(flaconActif.dateOuverture);
    const dateFin = new Date();

    // Calcul de la durée en jours (minimum 1 jour pour éviter la division par zéro)
    const differenceTemps = dateFin - dateDebut;
    let dureeJours = (differenceTemps / (1000 * 3600 * 24));
    dureeJours = dureeJours < 0.1 ? 0.1 : dureeJours; // Ajustement si terminé immédiatement

    // Calcul de la moyenne en ml/jour
    const moyenneMlJour = (flaconActif.volume / dureeJours).toFixed(2);

    // Création de l'élément d'historique
    const flaconTermine = {
        ...flaconActif,
        dateFin: dateFin.toISOString(),
        dureeJours: dureeJours.toFixed(1),
        consommationMoyenne: moyenneMlJour
    };

    // Sauvegarde dans l'historique
    const historique = JSON.parse(localStorage.getItem('historiqueFlacons')) || [];
    historique.unshift(flaconTermine); // Ajoute au début du tableau
    localStorage.setItem('historiqueFlacons', JSON.stringify(historique));

    // Suppression du flacon actif
    localStorage.removeItem('flaconActif');

    // Rafraîchir l'affichage
    afficherTout();
});

// 4. Navigation
btnOuvrirAjout.addEventListener('click', () => {
    ecranAccueil.classList.add('masque');
    ecranAjout.classList.remove('masque');
    
    const maintenant = new Date();
    maintenant.setMinutes(maintenant.getMinutes() - maintenant.getTimezoneOffset());
    inputDateOuverture.value = maintenant.toISOString().slice(0, 16);
});

btnAnnuler.addEventListener('click', () => {
    ecranAjout.classList.add('masque');
    ecranAccueil.classList.remove('masque');
});

// 5. Formulaire
formFlacon.addEventListener('submit', (e) => {
    e.preventDefault();

    const nouveauFlacon = {
        id: Date.now(),
        nom: document.getElementById('nom').value,
        type: document.getElementById('type').value,
        volume: parseFloat(document.getElementById('volume').value),
        nicotine: parseFloat(document.getElementById('nicotine').value),
        arome: document.getElementById('arome').value ? parseFloat(document.getElementById('arome').value) : null,
        dateOuverture: document.getElementById('date-ouverture').value
    };

    localStorage.setItem('flaconActif', JSON.stringify(nouveauFlacon));
    formFlacon.reset();
    ecranAjout.classList.add('masque');
    ecranAccueil.classList.remove('masque');

    afficherTout();
});

// Initialisation
calculerJoursSansTabac();
afficherTout();
