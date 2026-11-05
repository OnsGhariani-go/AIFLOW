# AIFLOW
### La Problématique
De nos jours, les étudiants en informatique et en ingénierie font souvent face à une lacune majeure : ils apprennent les définitions formelles des algorithmes (BFS, DFS, Dijkstra, Heuristique) sans saisir concrètement **quand**, **pourquoi** et **comment** les appliquer de manière optimale. La théorie reste souvent abstraite.

### La Solution : AI FLOW
**AI FLOW** tire son nom de **AI** (Intelligence Artificielle) et **FLOW** (le parcours fluide et interactif tracé par l'étudiant). Le projet élimine cette ambiguïté pédagogique en permettant aux étudiants de **"vivre" l'algorithme** à travers une interface de graphes interactive, où chaque choix de trajectoire a un impact direct sur le coût et la réussite.

## Les Étapes du Parcours (Modes de Travail)

Le jeu est divisé en trois étapes progressives, représentant les grands modes de recherche en IA :

### 1. Step 1 : Dijkstra (La Fiabilité et le Coût Réel)
* **Objectif :** Relier les nœuds pour former le mot **"INT"**.
* **Concept pédagogique :** Apprendre à calculer les distances et les poids réels pour garantir un chemin sécurisé, sans déviation.

### 2. Step 2 : Heuristique / Recherche Informée (L'Optimisation et l'Estimation)
* **Objectif :** Former le mot **"ELLIG"** en respectant une contrainte mathématique stricte : atteindre un coût heuristique total exact de **64**[cite: 2].
* **Concept pédagogique :** Comprendre l'utilisation d'une fonction d'estimation $h(n)$. Un compteur dynamique affiche le coût en temps réel à chaque nœud visité, enseignant l'importance des choix pondérés.

### 3. Step 3 : BFS - Breadth-First Search (L'Exploration Systématique)
* **Objectif :** Réaliser le parcours final vers **"ENCE"**.
* **Concept pédagogique :** Visualiser l'exploration par niveaux pour garantir l'atteinte de la solution finale et compléter le mot **INTELLIGENCE**.

## Outils & Technologies

Le projet repose sur une architecture web légère, moderne et performante, ne nécessitant aucune installation de bibliothèque lourde :

* **HTML5 Canvas** : Utilisé pour le rendu graphique dynamique des graphes, des nœuds interactifs et des lignes de liaison dynamiques ("effet élastique" lors du tracé à la souris).
* **JavaScript (Vanilla ES6)** : Assure toute la logique métier, la gestion des états de jeu, le calcul dynamique des coûts heuristiques (`reduce`), la détection de collision des nœuds et le contrôle des transitions entre les étapes.
* **CSS3** : Offre une interface utilisateur au design futuriste (style néon/cyberpunk), gère l'ergonomie visuelle, les états de verrouillage des étapes (`locked`) et les retours visuels (succès/erreur).

## Installation & Lancement

1. Clonez ou téléchargez le projet sur votre machine locale.
2. Assurez-vous d'avoir les fichiers principaux du projet dans le même dossier (`index.html`, `aiflow.js`, et les fichiers CSS associés).
3. Ouvrez le fichier **`index.html`** directement dans n'importe quel navigateur web moderne (Google Chrome, Mozilla Firefox, Microsoft Edge).
4. Jouez, tracez vos flux et maîtrisez les algorithmes de l'IA !


## Conclusion

En finissant **AI FLOW**, l'étudiant ne se contente pas de mémoriser du code : il acquiert une intuition technique claire lui permettant de distinguer l'utilité de chaque algorithme (précision de Dijkstra, estimation heuristique, et structure du BFS) pour de futures applications professionnelles (IoT, robotique, réseaux et logistique)[cite: 2].
