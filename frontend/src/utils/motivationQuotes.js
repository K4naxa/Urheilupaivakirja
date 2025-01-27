const motivationQuotes = [
  "Ei ole olemassa epäonnistumista. On vain tuloksia.",
  "Urheilu ei rakenna luonnetta. Se paljastaa sen.",
  "Voittajat eivät koskaan luovuta. Luovuttajat eivät koskaan voita.",
  "Kipu on väliaikaista. Luovuttaminen on ikuisesti.",
  "Kovin taistelu käydään korvien välissä.",
  "Sinun ei tarvitse olla paras. Sinun tarvitsee vain tehdä parhaasi.",
  "Jokainen mestari oli kerran aloittelija.",
  "Ei ole olemassa liian myöhäistä aloittaa.",
  "Kun luovutat unelmistasi, kuolee osa sinusta.",
  "Ei ole mitään, mitä et voisi saavuttaa, jos asetat mielesi siihen.",
  "Pienet parannukset päivittäin johtavat suuriin tuloksiin.",
  "Menestys ei tule luoksesi, sinun täytyy mennä sen luo.",
  "Kovaa työtä ei voi korvata millään.",
  "Tavoittele jatkuvaa parantamista, älä täydellisyyttä.",
  "Unelmat eivät toimi, ellei sinä tee.",
  "Jokainen harjoitus vie sinut lähemmäs tavoitettasi.",
  "Kipu, jonka tunnet tänään, on voima, jonka tunnet huomenna.",
  "Urheilu on yhtä paljon fyysistä kuin henkistä.",
  "Esteet ovat vain niitä asioita, jotka näet, kun otat katseesi pois tavoitteesta.",
  "Pysy keskittyneenä ja usko itseesi. Voit saavuttaa kaiken.",
  "Suuret mestarit ovat valmiita tekemään sitä, mitä muut eivät ole.",
  "Menestys on harjoittelun ja kärsivällisyyden summa.",
  "Urheilussa ei ole oikoteitä - vain kova työ ja omistautuminen.",
  "Voitto syntyy sydämestä, ei vain lihaksista.",
  "Luota prosessiin ja anna kaiken energiasi jokaiseen hetkeen.",
  "Anna tavoitteidesi olla suurempia kuin pelkosi.",
  "Todellinen voima tulee sisältä, ei vain lihaksista.",
  "Älä koskaan aliarvioi pienten askelten voimaa matkalla kohti suuruutta.",
  "Mestaruus on asenne, ei titteli.",
  "Jokainen harjoitus on askel lähemmäs täydellisyyttä.",
  "Urheilu opettaa, että voitto vaatii aina kovaa työtä.",
  "Se, joka jaksaa jatkaa, kun muut pysähtyvät, on todellinen voittaja.",
  "Joka päivä on uusi mahdollisuus parantaa itseään.",
  "Usko itseesi, vaikka kukaan muu ei uskoisi.",
  "Haasteet tekevät sinusta vahvemman urheilijan.",
  "Sinun suurin kilpailijasi olet sinä itse.",
  "Kun annat kaikkesi, et koskaan häviä.",
  "Tee työtä hiljaisesti, anna saavutusten puhua puolestasi.",
  "Sinun unelmasi ovat saavutettavissa, kunhan et koskaan luovuta.",
  "Päämäärät ja intohimo ovat avaimet menestykseen.",
  "Mestaruus ei ole yksi iso askel, vaan monia pieniä askeleita.",
  "Onnistuminen vaatii uhrauksia ja sinnikkyyttä.",
  "Voitto alkaa mielessä ja jatkuu teoissa.",
  "Älä pelkää epäonnistumista, pelkää yrittämättömyyttä.",
  "Menestys on seurausta valmistautumisesta, kovasta työstä ja oppimisesta epäonnistumisista.",
  "Ole vahvempi kuin vahvin tekosyysi.",
  "Kivun hetkellä tiedät, että olet kasvanut urheilijana.",
  "Vaikeudet ovat vain tilapäisiä, ylpeys kestää ikuisesti.",
  "Sinun ainoa kilpailijasi on eilisen sinä.",
  "Harjoittele kuin olisit kakkonen, mutta kilpaile kuin olisit ykkönen.",
  "Kun et enää jaksa, jatka vielä hetki - siellä odottaa menestys.",
  "Voitto alkaa aina ensimmäisestä askeleesta.",
  "Menestys ei ole määränpää, vaan matka.",
  "Älä koskaan unohda, miksi aloitit.",
  "Oikea hetki aloittaa on nyt.",
  "Sinun ei tarvitse olla täydellinen, mutta sinun täytyy olla sinnikäs.",
  "Pysy sitoutuneena unelmiisi, vaikka matka olisi vaikea.",
  "Joka kerta kun kaadut, sinulla on mahdollisuus nousta vahvempana.",
  "Harjoitus tekee mestarin, mutta asenne tekee voittajan.",
  "Vaikeat ajat ovat tilaisuus kasvaa ja oppia.",
  "Voitto ei ole vain palkinto, se on asenne.",
  "Älä anna yhden epäonnistumisen määrittää lopputulosta.",
  "Jokainen päivä on uusi mahdollisuus tulla paremmaksi versioksi itsestäsi.",
  "Voimakkuus ei tule fyysisestä kapasiteetista, vaan horjumattomasta tahdosta.",
  "Ponnistele, kunnes saavut tavoitteesi.",
  "Ole kärsivällinen, suuria asioita ei saavuteta yhdessä yössä.",
  "Älä odota inspiraatiota, vaan luo sitä omilla teoillasi.",
  "Tavoitteet saavutetaan yksi askel kerrallaan.",
  "Vain ne, jotka uskaltavat epäonnistua suuresti, voivat saavuttaa suuria.",
  "Anna jokaisen ponnistuksen viedä sinut lähemmäs unelmaasi.",
  "Urheilussa opit, ettei mikään ole mahdotonta.",
  "Pysy keskittyneenä, pysy vahvana, pysy voitokkaana.",
  "Älä koskaan aliarvioi pienten voittojen merkitystä.",
  "Voit saavuttaa mitä tahansa, kun uskot itseesi.",
  "Anna jokaisen harjoituksen olla askel kohti menestystä.",
  "Sinun täytyy uskoa, että voit, ennen kuin todella voit.",
  "Älä koskaan luovuta unelmistasi, vaikka matka olisi pitkä.",
  "Jokainen vaikeus on mahdollisuus parantaa itseään.",
  "Suurimmat saavutukset alkavat pienistä askeleista.",
  "Voitto ei tule helpolla, mutta se on aina sen arvoista.",
];

const getMotivationQuoteOfTheDay = () => {
  const date = new Date();
  const day = date.getDate();
  return motivationQuotes[day % motivationQuotes.length];
};

export default getMotivationQuoteOfTheDay;
