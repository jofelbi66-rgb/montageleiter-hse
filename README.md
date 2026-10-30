# HSE vor Ort – Montageleitung

Eigenständige Neuimplementierung anhand der sichtbaren Montageleiter-App. Kein exportierter Emergent-Code, keine Verbindung zu Emergent, kein Abo und keine externen Laufzeitbibliotheken. Enthält keine Originaldaten und kein kopiertes Firmenlogo.

## Start

Mit Node.js: `npm start`, dann http://127.0.0.1:4173 öffnen. Keine Paketinstallation erforderlich. Nicht per Doppelklick als file:// starten: JavaScript-Module benötigen einen Webserver.

## Funktionen

- Projektübergaben: Stammdaten, zehn HSE-Prüfbereiche, Bemerkungen, Maßnahmen und zwei handschriftliche Bestätigungen.
- Änderungen an Stammdaten oder Checkliste setzen Übergabebestätigungen zurück. Bestätigungen sind keine Arbeitsfreigabe und keine qualifizierte elektronische Signatur.
- Maßnahmen mit Verantwortung, Fälligkeit und Erledigt-Status; gemeinsame Übersicht.
- Toolbox Talk: Thema, Inhalte, Baustelle, Datum, Leitung und unterschriebene Teilnehmerbestätigungen.
- LMRA: fünf Prüffragen, Gefährdungen/Maßnahmen und Stopp-/Prüfergebnis. Positiver Abschluss nur bei fünf Ja-Antworten. Fachlicher Pilotentwurf, betrieblich zu prüfen.
- Suche und Standortfilter; fiktive Beispieldaten auf Wunsch.
- Lokaler Browser-Speicher, geprüfter JSON-Import/-Export, Druckansicht zum Speichern als PDF.

## Daten und Grenzen

Speicherung in localStorage unter `montageleitung-hse-v1`. Kein Login, kein Backend, keine automatische Synchronisation, keine KI und keine garantierte Offlineinstallation. Browserdaten sind weder verschlüsselt noch automatisch gesichert. Regelmäßig über „Datensicherung“ exportieren. Auf einem anderen Gerät oder unter einer anderen Domain sind Daten erst nach Import verfügbar. Import ersetzt den lokalen Bestand nach Bestätigung; der alte Stand wird zuvor als Datei angeboten. Die Größe des Browserspeichers ist begrenzt, vor allem bei vielen Unterschriften.

Echte Personendaten nur nach betrieblicher Freigabe und mit geeignetem Geräte-/Zugriffsschutz verwenden. Keine Datenexporte ins Repository einchecken. Das Veröffentlichen des App-Codes veröffentlicht nicht den lokalen Browserbestand. Für gemeinschaftliche Nutzung ist ein gesondertes Backend mit Anmeldung und Berechtigungen erforderlich.

## GitHub Pages

Die vier Laufzeitdateien `index.html`, `style.css`, `app.mjs`, `model.mjs` sowie `.nojekyll` funktionieren unter einem Repository-Unterpfad. Hash-Routing unterstützt Direktlinks ohne Server-Rewrites. Keine Build-Schlüssel oder Umgebungsvariablen erforderlich.

Repository → Settings → Pages → Deploy from a branch → main → / (root). Alternativ einen Pages-Workflow verwenden. Verfügbarkeit für private Repositories hängt vom GitHub-Tarif ab. Repository nicht ohne Entscheidung des Eigentümers öffentlich stellen. Diese Anleitung aktiviert selbst kein Hosting.

## Prüfen

`npm test`: Sicherungsformat, Bestätigungsrücksetzung, Status, LMRA-Konsistenz und ungültige Imports.

Manuelle Abnahme: Übergabe speichern und neu laden; beide Unterschriften erfassen; Checkliste ändern und Rücksetzung kontrollieren; Maßnahme erledigen; Toolbox-Teilnahme erfassen; LMRA mit Nein nicht positiv abschließen; Sicherung exportieren/importieren; PDF-Druckbild und mobile Bedienung prüfen. Daten und Unterschriften ausschließlich mit fiktiven Testangaben prüfen.

Die Emergent-Originalapp wird durch diesen Code nicht verändert. Ein späterer Originaldatenimport erfordert eine separate Abbildung auf dieses Datenformat.
