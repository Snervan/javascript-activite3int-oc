/* 
Activité 3

Ajout de liens et récupération de la liste les contenant depuis une API

Créé par Snervan (RetroMan sur OC)
*/

// Liste des liens Web à afficher. Un lien est défini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publié)
var listeLiens = null;

// Crée et renvoie un élément DOM affichant les données d'un lien
// Le paramètre lien est un objet JS représentant un lien
function createLinkElement(lien) {
    var titreLien = document.createElement("a");
    titreLien.href = lien.url;
    titreLien.target = "new";
    titreLien.style.color = "#428bca";
    titreLien.style.textDecoration = "none";
    titreLien.style.marginRight = "5px";
    titreLien.appendChild(document.createTextNode(lien.titre));

    var urlLien = document.createElement("span");
    urlLien.appendChild(document.createTextNode(lien.url));

    // Cette ligne contient le titre et l'URL du lien
    var ligneTitre = document.createElement("h4");
    ligneTitre.style.margin = "0px";
    ligneTitre.appendChild(titreLien);
    ligneTitre.appendChild(urlLien);

    // Cette ligne contient l'auteur
    var ligneDetails = document.createElement("span");
    ligneDetails.appendChild(document.createTextNode("Ajouté par " + lien.auteur));

    var divLien = document.createElement("div");
    divLien.classList.add("lien");
    divLien.appendChild(ligneTitre);
    divLien.appendChild(ligneDetails);

    return divLien;
}

function addLink(titre, url, auteur) {
    //On prépare un objet pour l'envoyer à l'api
    var newLink = { titre: titre, url: url, auteur: auteur };

    ajaxPost('https://oc-jswebsrv.herokuapp.com/api/lien', newLink, function(reponse) {
        //Affichage de la réussite de l'ajout du lien sur la page web
        addedPost.style.display = "block";
    }, 
    true);
}

// Parcours de la liste des liens et ajout d'un élément au DOM pour chaque lien
function getLinks() {
    ajaxGet('https://oc-jswebsrv.herokuapp.com/api/liens', function(liens) {
        /* Vide le contenu à chaque fois qu'on va chercher 
           à obtenir le contenu du tableau pour éviter les doublons
           lorsqu'on affiche à l'écran */
        contenu.textContent = null; 

        listeLiens = JSON.parse(liens);

        listeLiens.forEach(function (lien) {
            var elementLien = createLinkElement(lien);
            contenu.appendChild(elementLien);
        });
    });
}

//Fonction affichant un texte différent suivant l'erreur
function errorManagement(type) {
    var textServerError = document.createElement("p");
    switch(type) {
        case 1:
            textServerError.textContent = "Erreur lors de l'ajout lien sur le serveur";
            break;
        case 2:
            textServerError.textContent = "Erreur réseau";
            break;
        case 3:
            textServerError.textContent = "Adresse web incorrecte, veuillez réessayez !";
            break;
    }
    displayError.appendChild(textServerError);
    displayError.style.display = "block";
}

//Obtentien de l'id "contenu"
var contenu = document.getElementById("contenu");

//Bouton "Ajouter un site"
var ajoutButton = document.getElementById('ajoutButton');

//On obtient l'id du formulaire
var formulaire = document.getElementById('formulaire');

/* On obtient l'id du bloc affichant qu'un nouveau lien a bien été ajouté */
var addedPost = document.getElementById('addedPost');

/* On récupère l'id du div qui affichera 
   une erreur si on a ce n'est pas conforme à une url de site web 
   ou qu'il y a une erreur réseau */
var displayError = document.getElementById('error');

/* Appel de la fonction lors du chargement de la page
   pour obtenir les différents articles au sein de l'API */
getLinks();
 

ajoutButton.addEventListener('click', function(){
    ajoutButton.style.display = "none";
    formulaire.style.display = "block";
    formulaire.elements.auteur.focus();
});

formulaire.addEventListener('submit', function(form) {
    form.preventDefault();

    formulaire.style.display = "none";
    ajoutButton.style.display = "block";

    //On affecte à des variables les valeurs des éléments du formulaire
    var titreLien = form.target.titreSite.value;
    var urlLien = form.target.urlSite.value;
    var auteurLien = form.target.auteur.value;
    
    var regexHttp = /(http:|https:)\/\/+\w\w\w\.{0,4}[a-z]+\.[a-z]{2,5}$/ ;

    if(!regexHttp.test(urlLien))
    {
        //Ajoute "http://" au début s'il n'a pas été saisi
        urlLien = "http://" + urlLien;

        if (!regexHttp.test(urlLien)) {
            errorManagement(3);
        } else {
            //Appel de la fonction pour ajouter un lien
            addLink(titreLien, urlLien, auteurLien);
        }
    }
    else 
    {
        //Appel de la fonction pour ajouter un lien
        addLink(titreLien, urlLien, auteurLien);
    }

    //On retire les valeurs qu'on vient de soumettre du formulaire
    form.target.auteur.value = null;
    form.target.titreSite.value = null;
    form.target.urlSite.value = null;

    /* Timeout pour laisser afficher le bloc de réussite 
       ou d'erreur pendant deux secondes avant de le faire partir.

       Une fois l'éxécution du Timeout terminée, la liste des liens est
       rafraichie.
    */
    setTimeout(function(){
        //On va recharger à nouveau le "contenu" (que l'ajout soit réussi ou non)
        getLinks(); 

        displayError.style.display = "none";
        addedPost.style.display = "none";
        displayError.textContent = null;
    }, 2000);
});