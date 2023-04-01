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

//first api
app.get("/players/", async (req, res) => {
  console.log("first api called!!");
  const bringAllPlayers = `SELECT * FROM cricket_team;`;
  const playersList = await db.all(bringAllPlayers);
  console.log(playersList);
  res.send(playersList);
});

//second api
app.post("/players/", async (req, res) => {
  const newPlayer = req.body;
  const { player_name, jersey_number, role } = newPlayer;
  const addPlayerQuery = `INSERT INTO cricket_team( player_name, jersey_number, role)
VALUES
( '${player_name}', ${jersey_number}, '${role}');`;

  await db.run(addPlayerQuery);
  res.send("Player Added to Team");
});

//third api
app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = request.params;
  const bringSpecificPlayer = `SELECT * FROM cricket_team WHERE
     player_id = ${playerId};`;
  const specificPlayer = await db.get(bringSpecificPlayer);
  res.send(specificPlayer);
});

//fourth api
app.put("/players/:playerId/", async (req, res) => {
  const changedPlayer = req.body;
  const { playerId } = req.params;
  const { player_name, jersey_number, role } = changedPlayer;
  const sqlQuery = `UPDATE cricket_team
     SET player_name = '${player_name}', jersey_number = '${jersey_number}', role = '${role}'
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
