import fs from 'fs';
import path from 'path';

const defaultClues = [
    { seq: 1, clue: "Look carefully! Where the captain keeps his beverages...", loc: "Beverage Station" },
    { seq: 2, clue: "Follow the sea breeze! To the place where the crew gathers...", loc: "Common Lounge" },
    { seq: 3, clue: "X marks the spot! Where the ship's logs are safely stored...", loc: "Library/Bookshelf" },
    { seq: 4, clue: "Beware the sirens! Seek the shiny reflection that looks back at you.", loc: "Mirror Area" },
    { seq: 5, clue: "Almost there! To the crow's nest, where you can see the whole deck.", loc: "Balcony or Upper Level" },
    { seq: 6, clue: "The final treasure awaits! Where the captain rests his head...", loc: "Captain's Desk" }
];

const specificTeamClues = {
    1: [
        { seq: 1, clue: "No heat, yet it makes things beat; No leg yet it makes flow meet\u2026.\\n Through iron veins the river run, pushed by gaints you never see run!!", loc: "FM pumps" },
        { seq: 2, clue: "No book I read, no word I write; Yet convey message day and night\u2026..\\n No leaves no bird upon my crown, yet I send voices all around!!", loc: "Tower" },
        { seq: 3, clue: "Not an earthquake, yet things move; where the structure learn its hidden grove\u2026.\\n doors may open, nothing loud; yet forces gather like a crowd!!", loc: "Structural Dynamics Lab" },
        { seq: 4, clue: "I don\u2019t speak, yet I revel the hidden dust you cannot see\u2026.\\n not a human still I care; I quietly college air!!!", loc: "Dust sampler" },
        { seq: 5, clue: "Not front where people meet, but where dust and silence greet; \\n broken stones beneath your files rest in stacks discreet.", loc: "Workshop Behind tiles" },
        { seq: 6, clue: "Hari ghas ne mujhe ghera, Bijali se hai mera nata gehara\u2026.\\n swad ke baaye dundho baitha hu kaha, Khazana milega yaha!!!", loc: "Canteen left depo box" },
    ],
    2: [
        { seq: 1, clue: "Books whisper behind, yet I stand ahead where every journey begins instead \u2026.\\n To her left I hide, engines rest I store the blues what quenches the quest..", loc: "Darshan Cycle" },
        { seq: 2, clue: "Not a garden , not a wild; Not a place where footsteps piled \\n Behind the thinkers of gears and chains, I am visible to those who work Iin plains.", loc: "Mech Building Back Trees" },
        { seq: 3, clue: "A line of sentinels; Blue and snow, I hold some greens and help them grow\u2026.\\n A place to pause to breath, to stay where minds resets before their way", loc: "Blue Sentinels" },
        { seq: 4, clue: "Where books stand tall in silent rows, A moving room beside it goes but I guard the steps that hide from sight half sleep in metal light", loc: "Lift Library" },
        { seq: 5, clue: "Rukte hai log, khatam hoti chinta har ek sawal ka jawab yehi pe hai milta \u2026.\\n bhid Aksar nahi hoti yaha, Apki agli paheli bethi hai vaha!!", loc: "Waiting area office" },
        { seq: 6, clue: "No river here, yet water runs; No boat here, yet journey\u2019s done\u2026.\\n Where flow is studied fast or slow, A silent place where water go!!", loc: "FM workshop" },
    ],
    3: [
        { seq: 1, clue: "Jaha khamoshi khabar ban jati hai, aur pal tasveron mai bas jati hai....\\n No eyes I have yet all I see, find me I\u2019m hiding quietly.", loc: "Media Cell" },
        { seq: 2, clue: "Silent giants lie with hollow hearts, Strength is judged before it starts\u2026.\\n I do not breath, Yet I endure under pressure, I stay pure!!", loc: "Concrete Testing" },
        { seq: 3, clue: "Behind silent books where knowledge sleeps, beside wheels that whisper secret girls keep\u2026.\\n Where duty pauses in hidden nest, find me where the unseen take their rest.", loc: "Behind Library Darshan Kurchi" },
        { seq: 4, clue: "Not a classroom, yet lessons bloom; In whispers gossips and spicy fumes\u2026.\\n Chairs remember stories untold, where breaks feel warmer than gold", loc: "Canteen" },
        { seq: 5, clue: "I grow in clusters, tall yet thin; A forest whisper tucked within\u2026.\\n No chairs I hold, no bed I lay, yet many pause with me each day", loc: "Bamboo" },
        { seq: 6, clue: "Engines sleep where future builders roam, besides a wall that stands silent like a dome\u2026.\\n Beyond its back crowd may scream, As ball hits the sky in a grassy dream!!", loc: "Unknown" },
    ],
    4: [
        { seq: 1, clue: "I hold years you left behind, In files where memories confined;\\n No sunlight writes, No echoes stay ; Yet I remember every day!!!", loc: "Record Room" },
        { seq: 2, clue: "Three silent mouths in a tiled embross where iron minds and builders trace from building dreams to machines that rare source of life presents in chore", loc: "Unknown" },
        { seq: 3, clue: "A yellow whisper points the way where engineer minds are shaped each day; \\n  Four wheels rest where scholars roam, Bet from beasts and walls of stone.", loc: "Unknown" },
        { seq: 4, clue: "No lungs no life, yet air I press: A silent force in loud distress\u2026.\\n I trap the air and make it tight; Bend breeze with forceful might", loc: "Unknown" },
        { seq: 5, clue: "No crowds I keep, yet all must pass through narrow veins of stone ahead\u2026.\\n Before decisions inked in rooms ahead, My quit floor feel what\u2019s unsaid.", loc: "General Office Front" },
        { seq: 6, clue: "Faces pass but truth I see, A card decides your destiny\u2026.\\n Step ahead if you belong; else my pause will prove you wrong !!", loc: "Watchmen Room" },
    ],
    5: [
        { seq: 1, clue: "Na mein manzil, Na koi rasta hu; Jo mujh se guzre uske liye safalta ki dastan hu\u2026.\\n Sapne sabke alag, Par mai sabhko jodhta hu; Sabh ke liye kismat ke darwaje kholta hu!!", loc: "Main Gate side" },
        { seq: 2, clue: "Aawaji ka ghar hu, Par mera koi swar nahi.... \\n Bheed samete baitha hu, Par mera koi dar nahi\u2026.\\n Kabhi    taali, Kabhi khamoshi mujhme gunjti rahe, Jaha chehare bohot hai magar ek sa koi nahi bataon me kon !!", loc: "Seminar Hall" },
        { seq: 3, clue: "One ends journey with a stare, one begins them everywhere\u2026.\\n Books, tools and hunger\u2019s call, choose your turn or lose it all.", loc: "Outbarel Guide map Near canteen" },
        { seq: 4, clue: "Behind silent shutters where no voices stay; \\n A hidden pulse keeps night from swallowing day; \\n Still as stone; but never dead\\n Where does the campus draw its thread?", loc: "Power House Main Generator Near main gate" },
        { seq: 5, clue: "I don\u2019t sell food, but I feed your soul; With games and muscle as my goal\u2026. \\n Feast on left, Study on right; I bring you strength day and light.", loc: "Gymkhana" },
        { seq: 6, clue: "Two twins I wear, yet none may pass; I guard the hum of iron and grass\u2026.\\n Forever closed through paths seam near, where silent work breathes out of ear.", loc: "W - W" },
    ],
    6: [
        { seq: 1, clue: "Where silence clicks and cursor blink; where more is stored than eyes can think\u2026.\\n A red witness sleeps on side; Waiting for the heat the day decide.", loc: "Project IT" },
        { seq: 2, clue: "Concrete watches, Glass repeats dust below forgets the rain it meets\u2026.\\n In the barren court where life seems", loc: "Civil Building side of seminar hall glass" },
        { seq: 3, clue: "No clock yet I curve like time , No fortess yet walk align\u2026.\\n Rectangles store but never see, Guarding codes and circulatory", loc: "Main Building gol parking" },
        { seq: 4, clue: "A mouth that opens once a day to the left stones speak to the right gears stay focused its getting really hot", loc: "Mech-Civil building shutter" },
        { seq: 5, clue: "", loc: "Main building girls boys\u2019 toilet" },
        { seq: 6, clue: "", loc: "Front of main gate selfie mirror" },
    ],
    8: [
        { seq: 1, clue: "Before mind ignite and circuits a wake; There lies a pause no motion can take.... \nFeathers descends where no fire ignites; To sip from a mirror that forgets its fight.", loc: "Main Fountain" },
        { seq: 2, clue: "I speak in three tongues; Yet i have no mouth...\nOne tells you how to behave,\nOne reminds you who you are, \nOne remembers those who ruled before.", loc: "Preamble Civil/Mech" },
        { seq: 3, clue: "One serves the soil without demand; One shapes the world with coded hand.... /n Under one roof they wait unseen; Duty and data where both convene.", loc: "NSS AND COMP SOCIETY OF INDIA" },
        { seq: 4, clue: "Mein behta nahi fir bhi badal jata hu; dabav padhte hi sambhal jata hu\u2026. /n Imarat ki Kismat mujhse hai judi; batao mein hu konsi kadi?", loc: "Geotech engg. Lab" },
        { seq: 5, clue: "Through narrow panes; the light bends thin\u2026. /n Secrets brew in racks within; measured drops decide the fate stability is periodically a debate.", loc: "Chem Lab" },
        { seq: 6, clue: "Na kitab puri, na kahani saaf; boj, dabaav or bhar ki hoti hai baat\u2026./n Jo jhuke nahi, Soch ka kamal, Konse darwaje ke piche chupa ye sawal?", loc: "Heavy Structure Lab" },
    ],
    9: [
        { seq: 1, clue: "Jaha shor mai swaad apni duniya basate hai; Vahi sanaato mein koi jeevan sajata hai \u2026. \nSafed dewaron ke piche hariyali ki chav, Ek Neela sa raja rakhe jeevan ka gaao.", loc: "Canteen Front Blue Taki" },
        { seq: 2, clue: "Across the void they sync they flow; Guess the place where networks grow\u2026.\nA puzzle of pieces dar and wide; Each unaware of other\u2019s side.", loc: "Distribution system" },
        { seq: 3, clue: "Rang asmaan ke jameen se jude; \nLeharon ka gyan pr khudh stir khade....\nJaha rukna hi behna hai or behna hi kho jana .", loc: "FM workshop Back patra" },
        { seq: 4, clue: "Close to fall that never descends; Near Something that\u2019s viscous but never bends\u2026.\nWhat you except will not be true; The answer hides where green meets view.", loc: "Side Fountain" },
        { seq: 5, clue: "Not a road yet journey begins; Not a Mountain yet heights are won\u2026.\nSteel whispers beside me softly to shed remember every thread", loc: "Civil Mech Staircase" },
        { seq: 6, clue: "No forests here, yet nests are made; In cores where the light fade, /nAbove lawn\u2019s unending green; Towards right of techs where future is seen!!", loc: "Kabutar Nests" },
    ],
    10: [
        { seq: 1, clue: "It doesn\u2019t speak, yet plays it part Where two \u2018H\u2019s and a \u2018O\u2019 gets pure and out\u2026.\nClose to where brief joys appear, and calm surrounds it year to year.", loc: "Main Purification near canteen" },
        { seq: 2, clue: "No window, wide No open sky, yet energy is passing by\u2026.\nNot just beams and columns here another system works sincere.", loc: "Civil Staircase bottom" },
        { seq: 3, clue: "On cool tiled thrones we laughed and stay, while time between the bells slips away\u2026. \nAawaz Kho jaye  Jis Dehliz par, wahi Milte Hain Hazaro Safar.", loc: "WIT Xerox Centre" },
        { seq: 4, clue: "Bethane ko lage jaha pr dar, Safed rang de ye apka saar....\nKunki upper hai uske kabutaron ka vishram ghar.", loc: "Mech parking" },
        { seq: 5, clue: "I do not write; yet I create\u2026.\nYour words reborn at rapid rate, \nNear Green Whisper and shaded ground; Endless duplicates here are Found\u2026.", loc: "Xerox Centre" },
        { seq: 6, clue: "Where names meet fate before the door; Silent lifts whisper \u201cthere is more\u201d \u2026.\nCircuit guards what lies inside; While future waits just outside.", loc: "Unknown" },
    ],
};

const data = [];
for (let i = 1; i <= 10; i++) {
    const activeClues = specificTeamClues[i] || defaultClues;
    const teamClues = activeClues.map(c => ({
        sequence_number: c.seq,
        clue_text: c.clue,
        hint_text: "", // hints are handled via physical handout now
        location_description: c.loc
    }));
    data.push({
        team_id: `Team${i}`,
        clues: teamClues
    });
}

fs.writeFileSync(path.join(process.cwd(), 'clues_data.json'), JSON.stringify(data, null, 2));
console.log('Successfully generated full clues_data.json');
