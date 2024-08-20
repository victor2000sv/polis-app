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