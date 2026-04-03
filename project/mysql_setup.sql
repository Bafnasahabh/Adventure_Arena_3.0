-- Adventure Arena 3.0 - MySQL Setup Script

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

INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team1', NULL, 'code1', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team2', NULL, 'code2', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team3', NULL, 'code3', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team4', NULL, 'code4', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team5', NULL, 'code5', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team6', NULL, 'code6', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team7', NULL, 'code7', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team8', NULL, 'code8', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team9', NULL, 'code9', true);
INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team10', NULL, 'code10', true);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_start', 'Team1', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team1', 1, 'No heat, yet it makes things beat; No leg yet it makes flow meet….\n Through iron veins the river run, pushed by gaints you never see run!!', '', 'FM pumps');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_clue_1', 'Team1', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team1', 2, 'No book I read, no word I write; Yet convey message day and night…..\n No leaves no bird upon my crown, yet I send voices all around!!', '', 'Tower');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_clue_2', 'Team1', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team1', 3, 'Not an earthquake, yet things move; where the structure learn its hidden grove….\n doors may open, nothing loud; yet forces gather like a crowd!!', '', 'Structural Dynamics Lab');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_clue_3', 'Team1', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team1', 4, 'I don’t speak, yet I revel the hidden dust you cannot see….\n not a human still I care; I quietly college air!!!', '', 'Dust sampler');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_clue_4', 'Team1', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team1', 5, 'Not front where people meet, but where dust and silence greet; \n broken stones beneath your files rest in stacks discreet.', '', 'Workshop Behind tiles');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_clue_5', 'Team1', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team1', 6, 'Hari ghas ne mujhe ghera, Bijali se hai mera nata gehara….\n swad ke baaye dundho baitha hu kaha, Khazana milega yaha!!!', '', 'Canteen left depo box');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team1_clue_6', 'Team1', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_start', 'Team2', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team2', 1, 'Books whisper behind, yet I stand ahead where every journey begins instead ….\n To her left I hide, engines rest I store the blues what quenches the quest..', '', 'Darshan Cycle');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_clue_1', 'Team2', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team2', 2, 'Not a garden , not a wild; Not a place where footsteps piled \n Behind the thinkers of gears and chains, I am visible to those who work Iin plains.', '', 'Mech Building Back Trees');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_clue_2', 'Team2', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team2', 3, 'A line of sentinels; Blue and snow, I hold some greens and help them grow….\n A place to pause to breath, to stay where minds resets before their way', '', 'Blue Sentinels');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_clue_3', 'Team2', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team2', 4, 'Where books stand tall in silent rows, A moving room beside it goes but I guard the steps that hide from sight half sleep in metal light', '', 'Lift Library');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_clue_4', 'Team2', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team2', 5, 'Rukte hai log, khatam hoti chinta har ek sawal ka jawab yehi pe hai milta ….\n bhid Aksar nahi hoti yaha, Apki agli paheli bethi hai vaha!!', '', 'Waiting area office');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_clue_5', 'Team2', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team2', 6, 'No river here, yet water runs; No boat here, yet journey’s done….\n Where flow is studied fast or slow, A silent place where water go!!', '', 'FM workshop');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team2_clue_6', 'Team2', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_start', 'Team3', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team3', 1, 'Jaha khamoshi khabar ban jati hai, aur pal tasveron mai bas jati hai....\n No eyes I have yet all I see, find me I’m hiding quietly.', '', 'Media Cell');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_clue_1', 'Team3', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team3', 2, 'Silent giants lie with hollow hearts, Strength is judged before it starts….\n I do not breath, Yet I endure under pressure, I stay pure!!', '', 'Concrete Testing');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_clue_2', 'Team3', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team3', 3, 'Behind silent books where knowledge sleeps, beside wheels that whisper secret girls keep….\n Where duty pauses in hidden nest, find me where the unseen take their rest.', '', 'Behind Library Darshan Kurchi');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_clue_3', 'Team3', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team3', 4, 'Not a classroom, yet lessons bloom; In whispers gossips and spicy fumes….\n Chairs remember stories untold, where breaks feel warmer than gold', '', 'Canteen');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_clue_4', 'Team3', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team3', 5, 'I grow in clusters, tall yet thin; A forest whisper tucked within….\n No chairs I hold, no bed I lay, yet many pause with me each day', '', 'Bamboo');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_clue_5', 'Team3', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team3', 6, 'Engines sleep where future builders roam, besides a wall that stands silent like a dome….\n Beyond its back crowd may scream, As ball hits the sky in a grassy dream!!', '', 'Unknown');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team3_clue_6', 'Team3', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_start', 'Team4', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team4', 1, 'I hold years you left behind, In files where memories confined;\n No sunlight writes, No echoes stay ; Yet I remember every day!!!', '', 'Record Room');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_clue_1', 'Team4', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team4', 2, 'Three silent mouths in a tiled embross where iron minds and builders trace from building dreams to machines that rare source of life presents in chore', '', 'Unknown');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_clue_2', 'Team4', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team4', 3, 'A yellow whisper points the way where engineer minds are shaped each day; \n  Four wheels rest where scholars roam, Bet from beasts and walls of stone.', '', 'Unknown');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_clue_3', 'Team4', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team4', 4, 'No lungs no life, yet air I press: A silent force in loud distress….\n I trap the air and make it tight; Bend breeze with forceful might', '', 'Unknown');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_clue_4', 'Team4', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team4', 5, 'No crowds I keep, yet all must pass through narrow veins of stone ahead….\n Before decisions inked in rooms ahead, My quit floor feel what’s unsaid.', '', 'General Office Front');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_clue_5', 'Team4', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team4', 6, 'Faces pass but truth I see, A card decides your destiny….\n Step ahead if you belong; else my pause will prove you wrong !!', '', 'Watchmen Room');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team4_clue_6', 'Team4', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_start', 'Team5', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team5', 1, 'Na mein manzil, Na koi rasta hu; Jo mujh se guzre uske liye safalta ki dastan hu….\n Sapne sabke alag, Par mai sabhko jodhta hu; Sabh ke liye kismat ke darwaje kholta hu!!', '', 'Main Gate side');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_clue_1', 'Team5', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team5', 2, 'Aawaji ka ghar hu, Par mera koi swar nahi.... \n Bheed samete baitha hu, Par mera koi dar nahi….\n Kabhi    taali, Kabhi khamoshi mujhme gunjti rahe, Jaha chehare bohot hai magar ek sa koi nahi bataon me kon !!', '', 'Seminar Hall');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_clue_2', 'Team5', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team5', 3, 'One ends journey with a stare, one begins them everywhere….\n Books, tools and hunger’s call, choose your turn or lose it all.', '', 'Outbarel Guide map Near canteen');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_clue_3', 'Team5', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team5', 4, 'Behind silent shutters where no voices stay; \n A hidden pulse keeps night from swallowing day; \n Still as stone; but never dead\n Where does the campus draw its thread?', '', 'Power House Main Generator Near main gate');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_clue_4', 'Team5', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team5', 5, 'I don’t sell food, but I feed your soul; With games and muscle as my goal…. \n Feast on left, Study on right; I bring you strength day and light.', '', 'Gymkhana');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_clue_5', 'Team5', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team5', 6, 'Two twins I wear, yet none may pass; I guard the hum of iron and grass….\n Forever closed through paths seam near, where silent work breathes out of ear.', '', 'W - W');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team5_clue_6', 'Team5', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_start', 'Team6', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team6', 1, 'Where silence clicks and cursor blink; where more is stored than eyes can think….\n A red witness sleeps on side; Waiting for the heat the day decide.', '', 'Project IT');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_clue_1', 'Team6', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team6', 2, 'Concrete watches, Glass repeats dust below forgets the rain it meets….\n In the barren court where life seems', '', 'Civil Building side of seminar hall glass');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_clue_2', 'Team6', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team6', 3, 'No clock yet I curve like time , No fortess yet walk align….\n Rectangles store but never see, Guarding codes and circulatory', '', 'Main Building gol parking');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_clue_3', 'Team6', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team6', 4, 'A mouth that opens once a day to the left stones speak to the right gears stay focused its getting really hot', '', 'Mech-Civil building shutter');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_clue_4', 'Team6', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team6', 5, '', '', 'Main building girls boys’ toilet');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_clue_5', 'Team6', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team6', 6, '', '', 'Front of main gate selfie mirror');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team6_clue_6', 'Team6', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_start', 'Team7', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team7', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_clue_1', 'Team7', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team7', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_clue_2', 'Team7', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team7', 3, 'X marks the spot! Where the ship''''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_clue_3', 'Team7', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team7', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_clue_4', 'Team7', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team7', 5, 'Almost there! To the crow''''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_clue_5', 'Team7', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team7', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''''s Desk');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team7_clue_6', 'Team7', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_start', 'Team8', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team8', 1, 'Before mind ignite and circuits a wake; There lies a pause no motion can take.... 
Feathers descends where no fire ignites; To sip from a mirror that forgets its fight.', '', 'Main Fountain');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_clue_1', 'Team8', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team8', 2, 'I speak in three tongues; Yet i have no mouth...
One tells you how to behave,
One reminds you who you are, 
One remembers those who ruled before.', '', 'Preamble Civil/Mech');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_clue_2', 'Team8', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team8', 3, 'One serves the soil without demand; One shapes the world with coded hand.... /n Under one roof they wait unseen; Duty and data where both convene.', '', 'NSS AND COMP SOCIETY OF INDIA');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_clue_3', 'Team8', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team8', 4, 'Mein behta nahi fir bhi badal jata hu; dabav padhte hi sambhal jata hu…. /n Imarat ki Kismat mujhse hai judi; batao mein hu konsi kadi?', '', 'Geotech engg. Lab');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_clue_4', 'Team8', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team8', 5, 'Through narrow panes; the light bends thin…. /n Secrets brew in racks within; measured drops decide the fate stability is periodically a debate.', '', 'Chem Lab');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_clue_5', 'Team8', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team8', 6, 'Na kitab puri, na kahani saaf; boj, dabaav or bhar ki hoti hai baat…./n Jo jhuke nahi, Soch ka kamal, Konse darwaje ke piche chupa ye sawal?', '', 'Heavy Structure Lab');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team8_clue_6', 'Team8', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_start', 'Team9', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team9', 1, 'Jaha shor mai swaad apni duniya basate hai; Vahi sanaato mein koi jeevan sajata hai …. 
Safed dewaron ke piche hariyali ki chav, Ek Neela sa raja rakhe jeevan ka gaao.', '', 'Canteen Front Blue Taki');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_clue_1', 'Team9', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team9', 2, 'Across the void they sync they flow; Guess the place where networks grow….
A puzzle of pieces dar and wide; Each unaware of other’s side.', '', 'Distribution system');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_clue_2', 'Team9', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team9', 3, 'Rang asmaan ke jameen se jude; 
Leharon ka gyan pr khudh stir khade....
Jaha rukna hi behna hai or behna hi kho jana .', '', 'FM workshop Back patra');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_clue_3', 'Team9', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team9', 4, 'Close to fall that never descends; Near Something that’s viscous but never bends….
What you except will not be true; The answer hides where green meets view.', '', 'Side Fountain');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_clue_4', 'Team9', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team9', 5, 'Not a road yet journey begins; Not a Mountain yet heights are won….
Steel whispers beside me softly to shed remember every thread', '', 'Civil Mech Staircase');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_clue_5', 'Team9', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team9', 6, 'No forests here, yet nests are made; In cores where the light fade, /nAbove lawn’s unending green; Towards right of techs where future is seen!!', '', 'Kabutar Nests');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team9_clue_6', 'Team9', 6);

INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_start', 'Team10', 0);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team10', 1, 'It doesn’t speak, yet plays it part Where two ‘H’s and a ‘O’ gets pure and out….
Close to where brief joys appear, and calm surrounds it year to year.', '', 'Main Purification near canteen');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_clue_1', 'Team10', 1);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team10', 2, 'No window, wide No open sky, yet energy is passing by….
Not just beams and columns here another system works sincere.', '', 'Civil Staircase bottom');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_clue_2', 'Team10', 2);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team10', 3, 'On cool tiled thrones we laughed and stay, while time between the bells slips away…. 
Aawaz Kho jaye  Jis Dehliz par, wahi Milte Hain Hazaro Safar.', '', 'WIT Xerox Centre');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_clue_3', 'Team10', 3);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team10', 4, 'Bethane ko lage jaha pr dar, Safed rang de ye apka saar....
Kunki upper hai uske kabutaron ka vishram ghar.', '', 'Mech parking');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_clue_4', 'Team10', 4);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team10', 5, 'I do not write; yet I create….
Your words reborn at rapid rate, 
Near Green Whisper and shaded ground; Endless duplicates here are Found….', '', 'Xerox Centre');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_clue_5', 'Team10', 5);
INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), 'Team10', 6, 'Where names meet fate before the door; Silent lifts whisper “there is more” ….
Circuit guards what lies inside; While future waits just outside.', '', 'Unknown');
INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), 'Team10_clue_6', 'Team10', 6);

