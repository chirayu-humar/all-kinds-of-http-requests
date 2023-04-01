const express = require("express");
const sqlite3 = require("./node_modules/sqlite3");
const path = require("path");
const { open } = require("sqlite");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "/cricketTeam.db");
let db = null;

const makingTheConnection = async function () {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`server running of port 3000`);
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

makingTheConnection();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//first api
app.get("/players/", async (req, res) => {
  const bringAllPlayers = `SELECT * FROM cricket_team;`;
  let playersList = await db.all(bringAllPlayers);
  const newPlayersList = [];
  for (let each of playersList) {
    let temp = convertDbObjectToResponseObject(each);
    newPlayersList.push(temp);
  }
  res.send(newPlayersList);
});

//second api
app.post("/players/", async (req, res) => {
  const newPlayer = req.body;
  const { playerName, jerseyNumber, role } = newPlayer;
  const addPlayerQuery = `INSERT INTO cricket_team( player_name, jersey_number, role)
VALUES
( '${playerName}', ${jerseyNumber}, '${role}');`;

  await db.run(addPlayerQuery);
  res.send("Player Added to Team");
});

//third api
app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = request.params;
  const bringSpecificPlayer = `SELECT * FROM cricket_team WHERE
     player_id = ${playerId} limit 1;`;
  let specificPlayer = await db.get(bringSpecificPlayer);
  let temp = convertDbObjectToResponseObject(specificPlayer);
  res.send(temp);
});

//fourth api
app.put("/players/:playerId/", async (req, res) => {
  const changedPlayer = req.body;
  const { playerId } = req.params;
  const { playerName, jerseyNumber, role } = changedPlayer;
  const sqlQuery = `UPDATE cricket_team
     SET player_name = '${playerName}', jersey_number = '${jerseyNumber}', role = '${role}'
     WHERE player_id = ${playerId};`;
  await db.run(sqlQuery);
  res.send("Player Details Updated");
});

//fifth api
app.delete("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const query = `DELETE FROM cricket_team
WHERE player_id = ${playerId};`;
  await db.run(query);
  res.send("Player Removed");
});

module.exports = app;
