import os

sql = """-- Adventure Arena 3.0 - MySQL Setup Script

CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  team_name VARCHAR(100),
  access_code VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clues (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  clue_text TEXT NOT NULL,
  hint_text TEXT,
  location_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, sequence_number)
);

CREATE TABLE IF NOT EXISTS qr_codes (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  qr_data VARCHAR(100) UNIQUE NOT NULL,
  team_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_progress (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  current_clue_number INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  total_penalty_minutes INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hint_usage (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  clue_number INT NOT NULL,
  penalty_minutes INT NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scan_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  qr_data VARCHAR(100) NOT NULL,
  was_correct BOOLEAN DEFAULT FALSE,
  error_type VARCHAR(100),
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEX idx_clues_team_id ON clues(team_id);
-- CREATE INDEX idx_qr_codes_team_id ON qr_codes(team_id);
-- CREATE INDEX idx_team_progress_team_id ON team_progress(team_id);
-- CREATE INDEX idx_hint_usage_team_id ON hint_usage(team_id);
-- CREATE INDEX idx_scan_logs_team_id ON scan_logs(team_id);

DELETE FROM scan_logs;
DELETE FROM team_progress;
DELETE FROM qr_codes;
DELETE FROM clues;
DELETE FROM teams;

"""

teams: list[str] = []
for i in range(1, 11):
    teams.append(f"INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team{i}', NULL, 'code{i}', true);")
sql += "\n".join(teams) + "\n\n"

clues = [
    (1, "Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.", "Think about where drinks or cups are kept.", "Beverage Station"),
    (2, "Follow the sea breeze! To the place where the crew gathers to exchange tales.", "Look for a common gathering area or lounge.", "Common Lounge"),
    (3, "X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.", "A bookshelf or a cabinet where documents are kept.", "Library/Bookshelf"),
    (4, "Beware the sirens! Seek the shiny reflection that looks back at you.", "A mirror in the hallway or restroom.", "Mirror Area"),
    (5, "Almost there! To the crow''s nest, where you can see the whole deck.", "The highest point in the room or a balcony.", "Balcony or Upper Level"),
    (6, "The final treasure awaits! Where the captain rests his head after a long voyage.", "Look in the main office or the most comfortable chair.", "Captain''s Desk")
]

specific_team_clues = {
    1: [
        (1, "No heat, yet it makes things beat; No leg yet it makes flow meet\u2026.\\n Through iron veins the river run, pushed by gaints you never see run!!", "", "FM pumps"),
        (2, "No book I read, no word I write; Yet convey message day and night\u2026..\\n No leaves no bird upon my crown, yet I send voices all around!!", "", "Tower"),
        (3, "Not an earthquake, yet things move; where the structure learn its hidden grove\u2026.\\n doors may open, nothing loud; yet forces gather like a crowd!!", "", "Structural Dynamics Lab"),
        (4, "I don\u2019t speak, yet I revel the hidden dust you cannot see\u2026.\\n not a human still I care; I quietly college air!!!", "", "Dust sampler"),
        (5, "Not front where people meet, but where dust and silence greet; \\n broken stones beneath your files rest in stacks discreet.", "", "Workshop Behind tiles"),
        (6, "Hari ghas ne mujhe ghera, Bijali se hai mera nata gehara\u2026.\\n swad ke baaye dundho baitha hu kaha, Khazana milega yaha!!!", "", "Canteen left depo box"),
    ],
    2: [
        (1, "Books whisper behind, yet I stand ahead where every journey begins instead \u2026.\\n To her left I hide, engines rest I store the blues what quenches the quest..", "", "Darshan Cycle"),
        (2, "Not a garden , not a wild; Not a place where footsteps piled \\n Behind the thinkers of gears and chains, I am visible to those who work Iin plains.", "", "Mech Building Back Trees"),
        (3, "A line of sentinels; Blue and snow, I hold some greens and help them grow\u2026.\\n A place to pause to breath, to stay where minds resets before their way", "", "Blue Sentinels"),
        (4, "Where books stand tall in silent rows, A moving room beside it goes but I guard the steps that hide from sight half sleep in metal light", "", "Lift Library"),
        (5, "Rukte hai log, khatam hoti chinta har ek sawal ka jawab yehi pe hai milta \u2026.\\n bhid Aksar nahi hoti yaha, Apki agli paheli bethi hai vaha!!", "", "Waiting area office"),
        (6, "No river here, yet water runs; No boat here, yet journey\u2019s done\u2026.\\n Where flow is studied fast or slow, A silent place where water go!!", "", "FM workshop"),
    ],
    3: [
        (1, "Jaha khamoshi khabar ban jati hai, aur pal tasveron mai bas jati hai....\\n No eyes I have yet all I see, find me I\u2019m hiding quietly.", "", "Media Cell"),
        (2, "Silent giants lie with hollow hearts, Strength is judged before it starts\u2026.\\n I do not breath, Yet I endure under pressure, I stay pure!!", "", "Concrete Testing"),
        (3, "Behind silent books where knowledge sleeps, beside wheels that whisper secret girls keep\u2026.\\n Where duty pauses in hidden nest, find me where the unseen take their rest.", "", "Behind Library Darshan Kurchi"),
        (4, "Not a classroom, yet lessons bloom; In whispers gossips and spicy fumes\u2026.\\n Chairs remember stories untold, where breaks feel warmer than gold", "", "Canteen"),
        (5, "I grow in clusters, tall yet thin; A forest whisper tucked within\u2026.\\n No chairs I hold, no bed I lay, yet many pause with me each day", "", "Bamboo"),
        (6, "Engines sleep where future builders roam, besides a wall that stands silent like a dome\u2026.\\n Beyond its back crowd may scream, As ball hits the sky in a grassy dream!!", "", "Unknown"),
    ],
    4: [
        (1, "I hold years you left behind, In files where memories confined;\\n No sunlight writes, No echoes stay ; Yet I remember every day!!!", "", "Record Room"),
        (2, "Three silent mouths in a tiled embross where iron minds and builders trace from building dreams to machines that rare source of life presents in chore", "", "Unknown"),
        (3, "A yellow whisper points the way where engineer minds are shaped each day; \\n  Four wheels rest where scholars roam, Bet from beasts and walls of stone.", "", "Unknown"),
        (4, "No lungs no life, yet air I press: A silent force in loud distress\u2026.\\n I trap the air and make it tight; Bend breeze with forceful might", "", "Unknown"),
        (5, "No crowds I keep, yet all must pass through narrow veins of stone ahead\u2026.\\n Before decisions inked in rooms ahead, My quit floor feel what\u2019s unsaid.", "", "General Office Front"),
        (6, "Faces pass but truth I see, A card decides your destiny\u2026.\\n Step ahead if you belong; else my pause will prove you wrong !!", "", "Watchmen Room"),
    ],
    5: [
        (1, "Na mein manzil, Na koi rasta hu; Jo mujh se guzre uske liye safalta ki dastan hu\u2026.\\n Sapne sabke alag, Par mai sabhko jodhta hu; Sabh ke liye kismat ke darwaje kholta hu!!", "", "Main Gate side"),
        (2, "Aawaji ka ghar hu, Par mera koi swar nahi.... \\n Bheed samete baitha hu, Par mera koi dar nahi\u2026.\\n Kabhi    taali, Kabhi khamoshi mujhme gunjti rahe, Jaha chehare bohot hai magar ek sa koi nahi bataon me kon !!", "", "Seminar Hall"),
        (3, "One ends journey with a stare, one begins them everywhere\u2026.\\n Books, tools and hunger\u2019s call, choose your turn or lose it all.", "", "Outbarel Guide map Near canteen"),
        (4, "Behind silent shutters where no voices stay; \\n A hidden pulse keeps night from swallowing day; \\n Still as stone; but never dead\\n Where does the campus draw its thread?", "", "Power House Main Generator Near main gate"),
        (5, "I don\u2019t sell food, but I feed your soul; With games and muscle as my goal\u2026. \\n Feast on left, Study on right; I bring you strength day and light.", "", "Gymkhana"),
        (6, "Two twins I wear, yet none may pass; I guard the hum of iron and grass\u2026.\\n Forever closed through paths seam near, where silent work breathes out of ear.", "", "W - W"),
    ],
    6: [
        (1, "Where silence clicks and cursor blink; where more is stored than eyes can think\u2026.\\n A red witness sleeps on side; Waiting for the heat the day decide.", "", "Project IT"),
        (2, "Concrete watches, Glass repeats dust below forgets the rain it meets\u2026.\\n In the barren court where life seems", "", "Civil Building side of seminar hall glass"),
        (3, "No clock yet I curve like time , No fortess yet walk align\u2026.\\n Rectangles store but never see, Guarding codes and circulatory", "", "Main Building gol parking"),
        (4, "A mouth that opens once a day to the left stones speak to the right gears stay focused its getting really hot", "", "Mech-Civil building shutter"),
        (5, "", "", "Main building girls boys\u2019 toilet"),
        (6, "", "", "Front of main gate selfie mirror"),
    ],
    8: [
        (1, "Before mind ignite and circuits a wake; There lies a pause no motion can take.... \nFeathers descends where no fire ignites; To sip from a mirror that forgets its fight.", "", "Main Fountain"),
        (2, "I speak in three tongues; Yet i have no mouth...\nOne tells you how to behave,\nOne reminds you who you are, \nOne remembers those who ruled before.", "", "Preamble Civil/Mech"),
        (3, "One serves the soil without demand; One shapes the world with coded hand.... /n Under one roof they wait unseen; Duty and data where both convene.", "", "NSS AND COMP SOCIETY OF INDIA"),
        (4, "Mein behta nahi fir bhi badal jata hu; dabav padhte hi sambhal jata hu\u2026. /n Imarat ki Kismat mujhse hai judi; batao mein hu konsi kadi?", "", "Geotech engg. Lab"),
        (5, "Through narrow panes; the light bends thin\u2026. /n Secrets brew in racks within; measured drops decide the fate stability is periodically a debate.", "", "Chem Lab"),
        (6, "Na kitab puri, na kahani saaf; boj, dabaav or bhar ki hoti hai baat\u2026./n Jo jhuke nahi, Soch ka kamal, Konse darwaje ke piche chupa ye sawal?", "", "Heavy Structure Lab"),
    ],
    9: [
        (1, "Jaha shor mai swaad apni duniya basate hai; Vahi sanaato mein koi jeevan sajata hai \u2026. \nSafed dewaron ke piche hariyali ki chav, Ek Neela sa raja rakhe jeevan ka gaao.", "", "Canteen Front Blue Taki"),
        (2, "Across the void they sync they flow; Guess the place where networks grow\u2026.\nA puzzle of pieces dar and wide; Each unaware of other\u2019s side.", "", "Distribution system"),
        (3, "Rang asmaan ke jameen se jude; \nLeharon ka gyan pr khudh stir khade....\nJaha rukna hi behna hai or behna hi kho jana .", "", "FM workshop Back patra"),
        (4, "Close to fall that never descends; Near Something that\u2019s viscous but never bends\u2026.\nWhat you except will not be true; The answer hides where green meets view.", "", "Side Fountain"),
        (5, "Not a road yet journey begins; Not a Mountain yet heights are won\u2026.\nSteel whispers beside me softly to shed remember every thread", "", "Civil Mech Staircase"),
        (6, "No forests here, yet nests are made; In cores where the light fade, /nAbove lawn\u2019s unending green; Towards right of techs where future is seen!!", "", "Kabutar Nests"),
    ],
    10: [
        (1, "It doesn\u2019t speak, yet plays it part Where two \u2018H\u2019s and a \u2018O\u2019 gets pure and out\u2026.\nClose to where brief joys appear, and calm surrounds it year to year.", "", "Main Purification near canteen"),
        (2, "No window, wide No open sky, yet energy is passing by\u2026.\nNot just beams and columns here another system works sincere.", "", "Civil Staircase bottom"),
        (3, "On cool tiled thrones we laughed and stay, while time between the bells slips away\u2026. \nAawaz Kho jaye  Jis Dehliz par, wahi Milte Hain Hazaro Safar.", "", "WIT Xerox Centre"),
        (4, "Bethane ko lage jaha pr dar, Safed rang de ye apka saar....\nKunki upper hai uske kabutaron ka vishram ghar.", "", "Mech parking"),
        (5, "I do not write; yet I create\u2026.\nYour words reborn at rapid rate, \nNear Green Whisper and shaded ground; Endless duplicates here are Found\u2026.", "", "Xerox Centre"),
        (6, "Where names meet fate before the door; Silent lifts whisper \u201cthere is more\u201d \u2026.\nCircuit guards what lies inside; While future waits just outside.", "", "Unknown"),
    ],
}

for i in range(1, 11):
    t = f"Team{i}"
    # QR Start
    sql += f"INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), '{t}_start', '{t}', 0);\n"
    
    team_clues_to_use = specific_team_clues.get(i, clues)
    
    for c in team_clues_to_use:
        # Escape single quotes in text fields
        clue_text = c[1].replace("'", "''")
        hint_text = c[2].replace("'", "''")
        loc_desc = c[3].replace("'", "''")
        sql += f"INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), '{t}', {c[0]}, '{clue_text}', '{hint_text}', '{loc_desc}');\n"
        sql += f"INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), '{t}_clue_{c[0]}', '{t}', {c[0]});\n"
    sql += "\n"

with open('mysql_setup.sql', 'w', encoding='utf-8') as f:
    f.write(sql)
