const FS = require('fs');
const HTTP = require('http');
const { SOBRE } = require('./SOBRE/SOBRE.js.js');

SOBRE.FILE.driver = FS;
SOBRE.HTTP.driver = HTTP.createServer();

// En Sobre v2 les utilisateurs permettent de définir le DOM.
const utilisateur = new SOBRE.CLASS.UTILISATEUR('');
utilisateur.DefinirDOM(980, 2000); // On définit ici la taille du visuel lors de la création des requierment du DOM.
// On récupère les ressources textex et images.
SOBRE.FILE.LireFichier('./MathausLethLogo.png', new SOBRE.CLASS.DIMENSION2D(512, 512));
SOBRE.FILE.LireFichier('./edito.txt');
// On définit la fonction qui va générer la page html
const app = function (request, response) {
	// Il suffit maintenant de décrire la page que l'on souhaite :	
	// ##### DIV PARENTE ####
	// 1 - On créé la div principale:
	const appDiv = SOBRE.COMPONENT.AppFrame(utilisateur);
	// 2 - On lui donne les fonctionnalitées de bordures:
	SOBRE.DISPLAY.STYLE.Bordurer(appDiv);
	// 3 - On définit ses bordures, ici une à une:
	appDiv.BorderTop(50, 'solid', SOBRE.CONTROL.ENUM.COULEUR.ALPHA.TBLEU)
		.BorderLeft(50, 'solid', SOBRE.CONTROL.ENUM.COULEUR.ALPHA.TBLEU)
		.BorderBottom(50, 'solid', SOBRE.CONTROL.ENUM.COULEUR.ALPHA.TROSE)
		.BorderRight(50, 'solid', SOBRE.CONTROL.ENUM.COULEUR.ALPHA.TROSE);
	// ##### DIV DU CONTENU ####
	// 4 - On créé une div qui va contenir les différents élements de la page et on lui donne les fonctionnalitées de bordures:
	const contentDiv = SOBRE.DISPLAY.OBJECT.CreerElement(appDiv, 'div');
	SOBRE.DISPLAY.STYLE.Bordurer(contentDiv);
	// 5 - On applique les différents élements de styles à la div de contenu:
	contentDiv.Fit() // On définit sa taille à celle du parent
		.Border(6); // Une bordure de 6
	// 6 - On créé la structure de la div de contenue, ici un découpage manuel en 3 parties:
	const header = SOBRE.DISPLAY.OBJECT.CreerElement(contentDiv, 'div');
	const edito = SOBRE.DISPLAY.OBJECT.CreerElement(contentDiv, 'div'); 
	const footer = SOBRE.DISPLAY.OBJECT.CreerElement(contentDiv, 'div');
	// 7 - On récupère les ressources utiles:
	// note : en v2 LireFichier est uniquement asynchrone.
	const imgLogo  = SOBRE.FILE.files['./MathausLethLogo.png'];
	const editoText = SOBRE.FILE.files['./edito.txt'].file.toString('latin1');
	const getEditoLines = editoText.split('\r\n');
	// getEditoLines.forEach((line, index) => {
		// var tab = line.split(/\s+/);
		// var res = '';
		// tab.forEach( (word) =>  res += ('<b>' + word.substring(0, Math.ceil(word.length / 2)) + '</b>' + word.substring(Math.ceil(word.length / 2), word.length) + ' '));
		// getEditoLines[index] = res;
	// });
	const editoDate = getEditoLines[0];
	getEditoLines.shift();
	const editoTitle = getEditoLines[0];
	getEditoLines.shift();
	const editoLastLine = getEditoLines[getEditoLines.length - 1];
	getEditoLines.pop();
	// ##### HEADER ####
	// 8a - On décrit le header:
	header.Float('left')
		.Size(868, 160);
	// 8b - Découpage manuel du header en 3 parties:
	const headerImgDiv = SOBRE.DISPLAY.OBJECT.CreerElement(header, 'div');
	const headerDateDiv = SOBRE.DISPLAY.OBJECT.CreerElement(header, 'div');
	const headerTitleDiv = SOBRE.DISPLAY.OBJECT.CreerElement(header, 'div');
	// 8c - On décrit chaque partie du header:
	headerImgDiv.Float('left')
		.Size(160, 160);
	headerDateDiv.Float('left')
		.Size(708, 80);
	headerTitleDiv.Float('left')
		.Size(708, 80);
	// 8d - On ajoute l'image:
	const headerImg = SOBRE.DISPLAY.OBJECT.CreerImage(headerImgDiv, imgLogo.file)
		.Size(160, SOBRE.DISPLAY.FUNCTION.CalculerHauteurImageSelonFichier(imgLogo, 160));
	// 8e - On ajoute la date:
	const headerDate = SOBRE.DISPLAY.OBJECT.CreerElement(headerDateDiv, 'p')
		.Float('left');
	headerDate.innerHTML = editoDate;
	// 8f - On positionne la date:
	SOBRE.DISPLAY.STYLE.Styliser(headerDateDiv, 'position', 'relative');
	headerDate.Main(true)
		.Top(0)
		.Right(10);
	// 8g - On ajuste la hauteur de ligne de la date et on décrit la date:
	SOBRE.DISPLAY.STYLE.Textualiser(headerDateDiv);
	headerDateDiv.LineHeight(40)
		.FontSize('28px')
		.FontStyle('italic')
		.FontVariant('small-caps')
		.FontWeight('lighter');
	// 8h - On ajoute le titre:
	const headerTitle = SOBRE.DISPLAY.OBJECT.CreerElement(headerTitleDiv, 'h1')
		.Float('left');
	headerTitle.innerHTML = editoTitle;
	// 8i - On position le titre:
	SOBRE.DISPLAY.STYLE.Styliser(headerTitleDiv, 'position', 'relative');
	headerTitle.Main(true)
		.Bottom(0)
		.Left(0);
	// 8j - On ajuste la hauteur de ligne du header:
	SOBRE.DISPLAY.STYLE.Textualiser(headerTitleDiv);
	headerTitleDiv.LineHeight(80);
	// ##### EDITO ####
	// 9a - On textualise l'edito (car il va contenir du texte):
	SOBRE.DISPLAY.STYLE.Textualiser(edito);
	// 9b - On décrit l'edito:
	edito.Float('left')
		.Size(868, 1568)
		.FontWeight('100')
		.FontVariant('small-caps')
		.FontSize('24px');
	// 9c - On écrit le contenu de l'edito ligne par ligne, soit paragraphe par paragraphe:
	getEditoLines.forEach((line) => 
	{
		var p = SOBRE.DISPLAY.OBJECT.CreerElement(edito, 'p');
		p.innerHTML = line;
		SOBRE.DISPLAY.STYLE.Aligner(p);
		p.Margin(23)
			.Margin(35, SOBRE.CONTROL.ENUM.SIDELESS.VERTICAL);
		if (line.indexOf('sans réussite') !== -1 || line.indexOf('<b>sa</b>ns <b>réuss</b>ite') !== -1) p.Padding('320px', 'left');
	});
	// ##### FOOTER ####
	// 10a - On décrit le footer:
	footer.Float('left')
		.Size(868, 160);
	// 10b - On découpe le footer en 2 parties:
	const footerTextSpan = SOBRE.DISPLAY.OBJECT.CreerElement(footer, 'span');
	const footerImgSpan = SOBRE.DISPLAY.OBJECT.CreerElement(footer, 'span');
	// 10c - On décrit chaque partie du footer:
	footerImgSpan.Size(160, 160)
		.Float('left');
	footerTextSpan.Size(708, 160)
		.Float('left');
	// 10d - On ajoute le texte du footer:
	const footerText = SOBRE.DISPLAY.OBJECT.CreerElement(footerTextSpan, 'h1')
		.Float('left');
	footerText.innerHTML = editoLastLine;
	// 10e - On positionne le footer:
	SOBRE.DISPLAY.STYLE.Styliser(footerTextSpan, 'position', 'relative');
	footerText.Main(true)
		.Bottom(0)
		.Right(10);
	// 10f - On ajuste la hauteur de ligne du footer.
	SOBRE.DISPLAY.STYLE.Textualiser(footerTextSpan);
	footerTextSpan.LineHeight(160);
	// 10g - On ajoute l'image:
	const footerImg = SOBRE.DISPLAY.OBJECT.CreerImage(footerImgSpan, imgLogo.file)
		.Size(160, SOBRE.DISPLAY.FUNCTION.CalculerHauteurImageSelonFichier(imgLogo, 160));
	SOBRE.DISPLAY.STYLE.Styliser(footerImg, 'transform', 'scaleX(-1)');
	// ##### REQUEST ####
	// On ajoute le formatage de la réponse.
	// A noter qu'il ne s'agit pas ici de la bonne méthode pour le faire car cette réponse sera renvoyé pour chaque requête (même .ico, .css, .js etc ..)
	// Pour un souci d'exemple, on acceptera cette méthode.
	response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
	response.write(`<!DOCTYPE html>\n<html>\n<head>\n<title>Mathaus LETH - EDITO</title>\n<style>html, body { margin: 0; padding: 0; }</style>\n<meta charset="UTF-8">\n<meta name="author" content="Mathaus LETH">\n</head>\n<body>${utilisateur.body.innerHTML}</body>\n</html>\n`);
	SOBRE.HTTP.FormaterReponse(request, response);
};
SOBRE.HTTP.EcouterRequete(app);
SOBRE.HTTP.driver.listen(80);