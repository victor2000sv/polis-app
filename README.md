Denna app är ett snabbt exempel inom React Native. Appen är till för att visa upp fall som sker runt om i Sverige dagligen och all information är hämtad från https://polisen.se/api.

I appen kan man se en karta med dagens fall / brott där du kan läsa mer om fallet. Det går även att se mer statiskt om alla typer av fall.

## Installation
```bash
git clone git@github.com:victor2000sv/polis-app.git
```
Börja med att klona ner projektet.
### Backend - Docker
Det finns två vägar att gå för att installera backenden på din dator. Första och den enklaste är genom att använda sig av Docker.
```bash
cd backend
cp .env.example .env.local
```
Vi börjar med att konfigurera våra variabler. Genom att kopiera exempel filen kan vi sedan fylla i de variabler som saknas. Då vi installerar med Docker så krävs det endast att "DB_PASSWORD" fylls i. Du skapar lättast ett lösenord genom:
```bash
openssl rand -base64 20
```
Detta kommer till exempel ge en output: **9f/6Ef5F+sSR+pQxHImjb1HJcmY**

Kom ihåg lösenordet då samma lösenord måste ställas in i env-filen för databasen också.
```bash
cd ..
cd database
cp .env.example .env.local
```
I filen .env.local fyller du i samma lösenord som vi genererade i det tidigare steget under "MARIADB_ROOT_PASSWORD".

Nu återstår det endast att köra backenden.
```bash
docker compose up --build
```
### Backend - Manuell
För att installera backenden manuellt så krävs det att du har en databas uppsatt som du har tillgång till. Databasen måste dessutom vara uppbyggd med följande kod:
```MySQL
CREATE TABLE types (
type_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(60) NOT NULL
);

CREATE TABLE events (
event_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
summary TEXT NOT NULL,
type INT NOT NULL,
longitude DECIMAL(10,6),
latitude DECIMAL(10,6),
city VARCHAR(100),
date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (type) REFERENCES types(type_id)
);

CREATE INDEX type_index ON events(type) USING BTREE;

INSERT INTO types (title) VALUES('Alkohollagen'), ('Anträffad död'), ('Anträffat gods'), ('Arbetsplatsolycka'), ('Bedrägeri'), ('Bombhot'), ('Brand'), ('Brand automatlarm'), ('Bråk'), ('Detonation'), ('Djur skadat/omhändertaget'), ('Ekobrott'), ('Farligt föremål, misstänkt'), ('Fjällräddning'), ('Fylleri/LOB'), ('Förfalskningsbrott'), ('Försvunnen person'), ('Gränskontroll'), ('Häleri'), ('Inbrott'), ('Inbrott, försök'), ('Knivlagen'), ('Kontroll person/fordon'), ('Lagen om hundar och katter'), ('Larm inbrott'), ('Larm överfall'), ('Miljöbrott'), ('Missbruk av urkund'), ('Misshandel'), ('Misshandel, grov'), ('Mord/dråp'), ('Mord/dråp, försök'), ('Motorfordon, anträffat stulet'), ('Motorfordon, stöld'), ('Narkotikabrott'), ('Naturkatastrof'), ('Ofog barn/ungdom'), ('Ofredande/förargelse'), ('Olaga frihetsberövande'), ('Olaga hot'), ('Olaga intrång/hemfridsbrott'), ('Olovlig körning'), ('Ordningslagen'), ('Polisinsats/kommendering'), ('Rattfylleri'), ('Rån'), ('Rån väpnat'), ('Rån övrigt'), ('Rån, försök'), ('Räddningsinsats'), ('Sedlighetsbrott'), ('Sjukdom/olycksfall'), ('Sjölagen'), ('Skadegörelse'), ('Skottlossning'), ('Skottlossning, misstänkt'), ('Spridning smittsamma kemikalier'), ('Stöld'), ('Stöld, försök'), ('Stöld, ringa'), ('Stöld/inbrott'), ('Trafikbrott'), ('Trafikhinder'), ('Trafikkontroll'), ('Trafikolycka'), ('Trafikolycka, personskada'), ('Trafikolycka, singel'), ('Trafikolycka, smitning från'), ('Trafikolycka, vilt'), ('Utlänningslagen'), ('Vapenlagen'), ('Varningslarm/haveri'), ('Våld/hot mot tjänsteman'), ('Våldtäkt'), ('Våldtäkt, försök'), ('Vållande till kroppsskada');
```
Denna databas blir automatiskt uppsatt vid användning av Docker. 
```bash
cd backend
cp .env.example .env.local
```
Vi sätter sedan upp variablerna som krävs för att ansluta till din databas.
```bash
npm i
npm run start
```
Till sist så installerar vi alla dependencies och startar backenden på den port som .env-filen säger.

### Appen
Att installera appen är väldigt simpelt.
```bash
cd app
npm i
npx expo start
```
Vi börjar med att installera dependencies och sedan startar vi appen med npx expo start.

## Test
Då appen gjordes som ett snabbt exempelprojekt så har inte appen och backenden testats ordentligt och buggar medkommer.
### Backend
Backenden har körts på Windows WSL (Ubuntu) utan problem. Backenden har även körts på MacOS Sonoma v14.2.1 med problemet att backenden inte alltid startas utan att den kraschar i nodemon. Detta problem går att kringå genom att spara en fil som tillhör backenden tills den inte längre kraschar. Detta problem verkar inte existera på Windows WSL.

### Appen
Appen har endast körts på iOS Simulator och har inte testats på en Android enhet eller fysisk enhet. Om appen ska testas på en fysiskt enhet eller en enhet som inte är på samma enhet som backenden så krävs det att man ändrar endpointsen i appen då de för tillfället pekar på http://localhost:8080. 
