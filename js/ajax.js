function ajaxGet(url, callback) {
	//Création requête HTTP
	var req = new XMLHttpRequest();
	//Requête HTTP GET synchrone vers le fichier langages.txt publié localment
	req.open("GET", url);

	req.addEventListener("load", function() {
		if(req.status >= 200 && req.status < 400)
		{
			//Affiche la réponse reçu pour la requête
			callback(req.responseText);
		} else {
			//Affichage des informations sur l'échec du traitement de la requête
			console.log(req.status + " " + req.statusText);
		}
	});
	req.addEventListener("error", function() {
		console.log("Erreur réseau avec l'URL " + url);
	});
	//Envoi requête
	req.send(null);
}

//Execute appel AJAX
//Prend en paramètre l'url cible, la donnée à envoyer et la fonction callback en cas de succès
function ajaxPost(url, data, callback, isJson) {
	var req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
            errorManagement(1); //Appel de la fonction de gestion des erreurs dans "liensweb.js"
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
        errorManagement(2); //Fonction gestion des erreurs
    });
    if (isJson) {
        // Définit le contenu de la requête comme étant du JSON
        req.setRequestHeader("Content-Type", "application/json");
        // Transforme la donnée du format JSON vers le format texte avant l'envoi
        data = JSON.stringify(data);
    }
    req.send(data);
}