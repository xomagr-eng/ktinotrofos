/* ================= ΚΤΗΝΟΤΡΟΦΟΣ ΤΝ — ΒΙΝΤΕΟ ΕΡΓΑΣΙΩΝ =================
   Φορτώνουν ΜΟΝΟ με κλικ, από youtube-nocookie.com (αυξημένη ιδιωτικότητα).
   id: YouTube ID (ελεγμένο με oEmbed) · t: ελληνική περιγραφή · ch: κανάλι · l: γλώσσα (el/en)
   g: ομάδες ζώων ή ["all"] · kw: λέξεις-κλειδιά εργασίας (σύνδεση με Πρόγραμμα ΤΝ & Εργαλεία) */
window.VIDEO_CATS = {care:"✂️ Περιποίηση & σήμανση",health:"💉 Υγεία & θεραπεία",milk:"🥛 Άμελξη",birth:"🍼 Τοκετός & νεογέννητα",repro:"🤰 Αναπαραγωγή",feed:"🌾 Διατροφή & χορτονομή",handle:"🚧 Χειρισμός & περίφραξη",poultry:"🐣 Πουλερικά",bees:"🐝 Μελισσοκομία",species:"🐾 Εκτροφή ειδών"};
window.VIDEOS = [
  // Περιποίηση & σήμανση
  {id:"uoI8F6gmdmg",c:"care",t:"Παραδοσιακός & μηχανικός τρόπος κουρέματος προβάτων",ch:"Thanasis Katopodis",l:"el",g:["smallrum"],kw:["κούρεμα"]},
  {id:"vIOJJIAyRnY",c:"care",t:"Κουρευτική μηχανή προβάτων: ρύθμιση & λίπανση",ch:"VlachosTools",l:"el",g:["smallrum"],kw:["κούρεμα"]},
  {id:"3TqV7JDOGPY",c:"care",t:"Περιποίηση οπλών αιγοπροβάτων για αρχάριους",ch:"NC State Extension",l:"en",g:["smallrum"],kw:["οπλ","νυχ","χωλότ","σήψη"]},
  {id:"pUA_ehSw1yc",c:"care",t:"Κοπή νυχιών αγελάδας — ολλανδική μέθοδος (5 βήματα)",ch:"Irish Farmers Journal",l:"en",g:["cattle"],kw:["οπλ","νυχ","χωλότ"]},
  {id:"VklHIlJ81-A",c:"care",t:"Αντιμετώπιση χωλότητας με ποδόλουτρο",ch:"Teagasc",l:"en",g:["smallrum","cattle"],kw:["ποδόλουτρ","σήψη","οπλ","χωλότ"]},
  {id:"xQq1BhGelDc",c:"care",t:"Τοποθέτηση ενωτίων σε πρόβατα",ch:"CanSheepFed",l:"en",g:["smallrum"],kw:["σήμανση","ενώτι"]},
  {id:"PDadfJMnj24",c:"care",t:"Τοποθέτηση ενωτίων σε μοσχάρια",ch:"Shearwell Data",l:"en",g:["cattle"],kw:["σήμανση","ενώτι"]},
  {id:"9jV74vgYv2w",c:"care",t:"Κούρεμα αλπακά από την αρχή ως το τέλος",ch:"Adam Riley",l:"en",g:["other"],kw:["κούρεμα"]},
  {id:"kDCdzWOzPKs",c:"care",t:"Περιποίηση μακριών οπλών αλόγου",ch:"Idaho Horseshoeing School",l:"en",g:["equine"],kw:["πεταλ","οπλ"]},
  // Υγεία & θεραπεία
  {id:"bpiPDjBzvMc",c:"health",t:"Εμβόλια προβάτων — εμπειρία κτηνοτρόφου",ch:"Η Φάρμα της Γιαγιάς",l:"el",g:["smallrum"],kw:["εμβολ","κλωστηρ"]},
  {id:"94P_JEQDobg",c:"health",t:"Υποδόρια ένεση σε αιγοπρόβατα (σωστή τεχνική)",ch:"Tri-State Veterinary Service",l:"en",g:["smallrum","other"],kw:["εμβολ","ένεση","κλωστηρ"]},
  {id:"TWKcDJ0on9Y",c:"health",t:"Χειρισμός & ενέσεις σε χοιρίδια (σίδηρος)",ch:"Michigan Pork Producers",l:"en",g:["pig"],kw:["σίδηρ","ένεση","χοιρίδ"]},
  {id:"m0TFBU75DiM",c:"health",t:"Σωστή τεχνική χορήγησης ανθελμινθικού (drench)",ch:"AHDB Beef & Lamb",l:"en",g:["smallrum","cattle","game","other"],kw:["αποπαρασ","ανθελμ"]},
  {id:"KYFUAvFQ15g",c:"health",t:"Παράσιτα αιγών: βαθμολόγηση FAMACHA",ch:"Oklahoma State Extension",l:"en",g:["smallrum","other","game"],kw:["famacha","αναιμ","αποπαρασ"]},
  {id:"aGj4L75lp5U",c:"health",t:"Κοπρανοσκόπηση — μέτρηση αυγών παρασίτων",ch:"N.C. Cooperative Extension",l:"en",g:["smallrum","cattle","equine","other","game"],kw:["κοπρανοσκόπ","αποπαρασ"]},
  {id:"xnDxJpIb5oo",c:"health",t:"Βαθμολόγηση σωματικής κατάστασης (BCS) προβάτων",ch:"UConn Extension",l:"en",g:["smallrum"],kw:["σωματικ","bcs","flushing","τοξαιμ"]},
  {id:"wASXNn_CTCU",c:"health",t:"Βαθμολόγηση σωματικής κατάστασης αγελάδων",ch:"Penn State Extension",l:"en",g:["cattle"],kw:["σωματικ","bcs","ξήρανση","μετάβασ"]},
  {id:"7WtMTV-rjlQ",c:"health",t:"Τεστ μαστίτιδας CMT σε αγελάδες",ch:"Penn State Extension",l:"en",g:["cattle","smallrum"],kw:["μαστίτ","cmt","ξήρανση"]},
  {id:"K0ngaaHYET4",c:"health",t:"Τυμπανισμός αρνιών — τι είναι στην πραγματικότητα (κτηνίατρος)",ch:"Sez the Vet",l:"en",g:["smallrum","cattle"],kw:["τυμπαν"]},
  // Άμελξη
  {id:"H729x8mPmpU",c:"milk",t:"Πρόβατα φυλής Χίου στο αμελκτήριο",ch:"Ioannis Giannopoulos",l:"el",g:["smallrum"],kw:["άμελξ","γάλα"]},
  {id:"MB9xhbNl-f4",c:"milk",t:"Αρμεγή & γαλακτομέτρηση προβάτων Ασσάφ",ch:"Farma Hellas Genetics",l:"el",g:["smallrum"],kw:["άμελξ","γάλα"]},
  {id:"MXmgzLfUtUI",c:"milk",t:"Περιστροφικό αμελκτήριο αγελάδων",ch:"Πανκτηνοτροφική",l:"el",g:["cattle"],kw:["άμελξ","γάλα"]},
  {id:"XWW-Pwe8Ac4",c:"milk",t:"Καλή πρακτική άμελξης — εμβάπτιση θηλών",ch:"Interactive Content",l:"en",g:["cattle","smallrum"],kw:["άμελξ","μαστίτ"]},
  // Τοκετός & νεογέννητα
  {id:"XsAcoGzUt5Q",c:"birth",t:"Προετοιμασία των μοσχίδων για τον τοκετό",ch:"EURCAW Ruminants & Equines",l:"el",g:["cattle"],kw:["τοκετ","μετάβασ","close-up","ξήρανση"]},
  {id:"Yh6o2Fu4SqE",c:"birth",t:"Πότε & πώς επεμβαίνουμε σε δύσκολο τοκετό αγελάδας",ch:"Beef Cattle Research Council",l:"en",g:["cattle"],kw:["τοκετ","δυστοκ"]},
  {id:"vJRDvhb8QUQ",c:"birth",t:"Σωστή τοποθέτηση αλυσίδων τοκετού",ch:"Progressive Dairy",l:"en",g:["cattle"],kw:["τοκετ","δυστοκ"]},
  {id:"Sbnwn3ODrkU",c:"birth",t:"Βοήθεια σε τοκετό προβατίνας — τα βασικά",ch:"Shropshire Farm Vets",l:"en",g:["smallrum"],kw:["τοκετ","δυστοκ","γέννα"]},
  {id:"VI4aTgt8q2s",c:"birth",t:"Ορθές πρακτικές χορήγησης πρωτογάλακτος στα νεογέννητα αρνιά",ch:"Innovation and Impact Hub",l:"el",g:["smallrum"],kw:["πρωτόγαλ","νεογέν","τοκετ"]},
  {id:"XQfSWLBIegw",c:"birth",t:"Τεχνητός θηλασμός & επιτυχημένη ανάπτυξη αρνιών",ch:"Innovation and Impact Hub",l:"el",g:["smallrum"],kw:["θηλασ","απογαλ","τεχνητ"]},
  {id:"P7PUU1eLZIQ",c:"birth",t:"Τάισμα αρνιών/κατσικιών με οισοφαγικό σωλήνα",ch:"Purdue Extension",l:"en",g:["smallrum"],kw:["πρωτόγαλ","οισοφαγ","νεογέν"]},
  {id:"t7LfOyU6BSA",c:"birth",t:"Κοπή ουράς αρνιών με ελαστικό δακτύλιο (καλή πρακτική)",ch:"Animal Health Australia",l:"en",g:["smallrum"],kw:["ευνουχ","ουρ","δακτύλ"]},
  // Αναπαραγωγή
  {id:"gVdqsXCYKBM",c:"repro",t:"Διαχείριση αιγοπροβάτων την εποχή του ζευγαρώματος",ch:"Τμήμα Γεωργίας Κύπρου",l:"el",g:["smallrum"],kw:["οχεία","flushing","κριαρ","τράγ"]},
  {id:"uBctCa7nLnw",c:"repro",t:"Συγχρονισμός προβάτων για σπερματέγχυση",ch:"MANTIS Farm management",l:"el",g:["smallrum"],kw:["συγχρον","σπόγγ","οχεία","οίστρ"]},
  {id:"h69GQPQXXBE",c:"repro",t:"Τεχνητή σπερματέγχυση προβάτου",ch:"MANTIS Farm management",l:"el",g:["smallrum"],kw:["σπερματέγχ"]},
  {id:"stvnGYcKz60",c:"repro",t:"Τεχνητή σπερματέγχυση βοοειδών",ch:"SUNUP TV (Oklahoma State)",l:"en",g:["cattle"],kw:["σπερματέγχ","οίστρ"]},
  {id:"VZFTmPlzuWo",c:"repro",t:"Υπερηχογράφημα κυοφορίας προβάτων",ch:"Texas A&M Sheep and Goats",l:"en",g:["smallrum"],kw:["κυοφορ","διάγνωση","υπέρηχ"]},
  {id:"u15UbhJtsKA",c:"repro",t:"Πώς φοράμε το σαμάρι σημαδέματος στο κριάρι",ch:"NETTEX",l:"en",g:["smallrum"],kw:["οχεία","κριαρ","σημάδ"]},
  // Διατροφή & χορτονομή
  {id:"nphZ2P1yivs",c:"feed",t:"Ολικό σιτηρέσιο (TMR) σε πρόβατα Ασσάφ",ch:"Pimenas",l:"el",g:["smallrum"],kw:["σιτηρέσ","tmr","ζωοτροφ","διατροφ"]},
  {id:"WNYU34eUu24",c:"feed",t:"Αναμικτήρες TMR: σύγκριση τύπων",ch:"KUHN",l:"en",g:["cattle","smallrum"],kw:["σιτηρέσ","tmr","ζωοτροφ"]},
  {id:"v4zHpdszJiI",c:"feed",t:"Ενσίρωση καλαμποκιού σε σάκο",ch:"MANTIS Farm management",l:"el",g:["cattle","smallrum"],kw:["ενσίρωμα","ενσίρωση"]},
  {id:"JkXm6RNtOsg",c:"feed",t:"Συγκομιδή τριφυλλιού: κόψιμο, γύρισμα, δέσιμο",ch:"Xristos Katsoulas",l:"el",g:["cattle","smallrum","equine"],kw:["χορτονομ","σανός","τριφύλλ"]},
  // Χειρισμός & περίφραξη
  {id:"J3ed7U5SRrA",c:"handle",t:"Εγκαταστάσεις & χειρισμός μικρού κοπαδιού προβάτων",ch:"OSU Extension",l:"en",g:["smallrum"],kw:["χειρισμ","διαλογ"]},
  {id:"BWGksusrdHs",c:"handle",t:"Εκτίμηση βάρους βοοειδών με μετροταινία",ch:"Purdue Extension",l:"en",g:["cattle"],kw:["βάρος","ζύγ"]},
  {id:"uTimrjgDa80",c:"handle",t:"Ηλεκτρική περίφραξη — πώς να την κάνουμε",ch:"Το Κανάλι του Γιάννη",l:"el",g:["all"],kw:["περίφραξ","βοσκ"]},
  {id:"hVmqE0tcV1Y",c:"handle",t:"Εντολές ποιμενικού σκύλου εξηγημένες",ch:"Seanthesheepman",l:"en",g:["dogs","smallrum"],kw:["σκύλ","βοσκ"]},
  // Πουλερικά
  {id:"7Zxl3jJjGlQ",c:"poultry",t:"Πώς να μεγαλώσετε κότες",ch:"Wikifarmer",l:"el",g:["poultry"],kw:["κοτέτσ","ωοτοκ","αυγ","φωτισμ"]},
  {id:"IRTf__2M7qg",c:"poultry",t:"Εκκόλαψη: πώς βγαίνει το κοτοπουλάκι στην κλωσσομηχανή",ch:"Farma Jim Cott",l:"el",g:["poultry"],kw:["επώαση","εκκόλαψ"]},
  {id:"LLdKVwSfcpc",c:"poultry",t:"Ωοσκόπηση αυγών",ch:"Farma Jim Cott",l:"el",g:["poultry"],kw:["ωοσκόπ","επώαση"]},
  {id:"NmvExuW2cM8",c:"poultry",t:"Θερμοκρασία κλωσσομητέρας & συμπεριφορά νεοσσών",ch:"Poulin Grain",l:"en",g:["poultry"],kw:["κλωσσομ","νεοσσ","θερμοκρασία θαλάμου"]},
  // Μελισσοκομία
  {id:"iF4yDHvj2eU",c:"bees",t:"Επιθεώρηση κυψέλης, αφεσμού & παραφυάδας",ch:"Μέλι Λεωνίδας",l:"el",g:["bees"],kw:["κυψέλ","σμηνουργ","παραφυάδ"]},
  {id:"cJZ1wc6Zwh0",c:"bees",t:"Σωστή τεχνική επιθεώρησης κυψέλης",ch:"UF Honey Bee Lab",l:"en",g:["bees"],kw:["κυψέλ","σμηνουργ"]},
  {id:"b8quxrkazSU",c:"bees",t:"Τρύγος μελιού στη Σίφνο",ch:"KAIPOUTHEOS.GR",l:"el",g:["bees"],kw:["τρύγ","μέλι"]},
  {id:"1iqfW_0EHVw",c:"bees",t:"Ξεκαπάκωμα κηρήθρας με ζεστό μαχαίρι",ch:"MahakoBees",l:"en",g:["bees"],kw:["τρύγ","ξεκαπάκ"]},
  {id:"3iQmbGNRO1w",c:"bees",t:"Θεραπεία βαρρόα με ενστάλαξη οξαλικού οξέος",ch:"To Kofini",l:"el",g:["bees"],kw:["βαρρόα","οξαλικ"]},
  {id:"k95CrnTSTCY",c:"bees",t:"Μέτρηση βαρρόα με πλύση αλκοόλης",ch:"University of Guelph",l:"en",g:["bees"],kw:["βαρρόα"]},
  // Εκτροφή ειδών
  {id:"-Gw-tScsU0U",c:"species",t:"Πώς γίνεται η εκτροφή σαλιγκαριών στην Ελλάδα",ch:"24h Online",l:"el",g:["snails"],kw:["σαλιγκ","πάρκ"]},
  {id:"UAIQszb7llU",c:"species",t:"Εκτροφή σαλιγκαριών",ch:"bioprasino.gr",l:"el",g:["snails"],kw:["σαλιγκ"]},
  {id:"12l15vLo_gk",c:"species",t:"Ιχθυοκαλλιέργεια πέστροφας — Άγκιστρο Σερρών",ch:"AGKISTRO ONLINE",l:"el",g:["fish"],kw:["πέστροφ","δεξαμεν"]},
  {id:"EUdUOF-Elm8",c:"species",t:"Πώς λειτουργεί μια σύγχρονη μονάδα πέστροφας",ch:"Aquaculture Tribe",l:"en",g:["fish"],kw:["πέστροφ","οξυγόν"]},
  {id:"XpHBWzhw5ec",c:"species",t:"Από τον μεταξοσκώληκα στο μετάξι — σηροτροφία στο Σουφλί",ch:"Smart Crochet",l:"el",g:["insects"],kw:["μεταξοσκ","κουκούλ"]},
  {id:"SFmwujBWBj4",c:"species",t:"Πώς εκτρέφουμε μεταξοσκώληκες",ch:"The More You Grow",l:"en",g:["insects"],kw:["μεταξοσκ"]},
  {id:"SbzedftrQJw",c:"species",t:"Μονάδα μαύρης στρατιωτικής μύγας (BSF)",ch:"Gardening Australia",l:"en",g:["insects"],kw:["bsf","έντομ","υπόστρωμ"]},
  {id:"GZU8Z5zlbZk",c:"species",t:"3 βασικά πράγματα στην εκτροφή κουνελιών",ch:"Φάρμα «Η Ράχη»",l:"el",g:["rabbit"],kw:["κουνέλ"]},
  {id:"MHdWsMdVMDA",c:"species",t:"Συζήτηση για τη χοιροτροφία",ch:"Σχολή Κρέατος",l:"el",g:["pig"],kw:["χοιρ"]},
  {id:"O4l0S0-1O4Y",c:"species",t:"Ελληνικός Ποιμενικός Σκύλος",ch:"Billy's Traffic TV (ΑΓΡΟweek)",l:"el",g:["dogs"],kw:["σκύλ","ποιμενικ"]},
  {id:"c7or0y2towI",c:"species",t:"Σκύλοι φύλακες προστατεύουν το κοπάδι από λύκους",ch:"BBC Earth",l:"en",g:["dogs","smallrum"],kw:["σκύλ","θηρευτ"]},
  {id:"3mWlTTDUHYY",c:"species",t:"Πώς να εκτρέψετε φασιανούς",ch:"Rambo Outfitters",l:"en",g:["poultry"],kw:["φασιαν"]},
  {id:"WuBEcjQ_2tk",c:"species",t:"Περιστέρια κρεατοπαραγωγής (πιτσούνια)",ch:"Sarah Chrisman",l:"en",g:["poultry"],kw:["περιστ","πιτσούν"]},
  {id:"e4vtz6dJR4U",c:"species",t:"Εκτροφή στρουθοκαμήλων — επίσκεψη σε φάρμα",ch:"Iowa PBS",l:"en",g:["poultry"],kw:["στρουθοκ"]},
  {id:"1T4QHdB8LK4",c:"species",t:"Μεγάλη μονάδα ελαφοτροφίας",ch:"Deer Farming Channel",l:"en",g:["game"],kw:["ελάφ","βαρβατίλ"]}
];
