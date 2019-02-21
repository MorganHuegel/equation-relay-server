const GameSession = require('../models/gameSession');

function createTeamListUnderFour(playerList){
  return [
    {
      teamName: 'TEAM 1',
      players: playerList
    }
  ];
}



function createTeamListFive(playerList){
  let shuffledPlayers = [];

  for (let i = playerList.length - 1; i >= 0; i--) {
    const randIndex = Math.floor(Math.random() * playerList.length);
    shuffledPlayers.push(playerList.splice(randIndex, 1)[0]);
  }

  let teamList = [
    {
      teamName: 'TEAM 1', // <--- TO-DO Randomly generate this
      players: shuffledPlayers.splice(0, 2)
    },
    {
      teamName: 'TEAM 2',
      players: shuffledPlayers.splice(0, 3)
    }
  ];

  return teamList;
}


function createTeamOverFive (playerList) {
  let shuffledPlayers = [];

  for (let i = playerList.length - 1; i >= 0; i--) {
    const randIndex = Math.floor(Math.random() * playerList.length);
    shuffledPlayers.push(playerList.splice(randIndex, 1)[0]);
  }

  const numOfTeams = Math.ceil(shuffledPlayers.length / 4);
  let teamsOfThree = 0;

  if (shuffledPlayers.length % 4 === 1) {
    teamsOfThree = 3;
  } else if (shuffledPlayers.length % 4 === 2) {
    teamsOfThree = 2;
  } else if (shuffledPlayers.length % 4 === 3) {
    teamsOfThree = 1;
  }

  //Set Teams of 3 fist
  let teamList = [];
  for (let i = 0; i < teamsOfThree; i++) {
    let players = shuffledPlayers.splice(0, 3);
    teamList = [...teamList, {
      teamName: `TEAM OF THREE ${i + 1}`,
      players: players
    }];
  }

  //Rest are Teams of 4
  for (let j = 0; j < numOfTeams - teamsOfThree; j++) {
    let players = shuffledPlayers.splice(0, 4);
    teamList = [...teamList, {
      teamName: `TEAM OF FOUR ${j + 1}`,
      players: players
    }];
  }

  return teamList;
}



exports.shuffleTeamsEvent = function(socket, sessionCode){
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      if (!gameData) {
        socket.nsp.to(socket.id).emit('error', 'Could not start game');
      } else {
        const playerList = [...gameData.playerList];
        let teamList;
        
        if (playerList.length === 0) {
          const err = new Error('Cannot start game with 0 players.');
          return Promise.reject(err);
        } else if (playerList.length <= 4) {
          teamList = createTeamListUnderFour(playerList);
        } else if (playerList.length === 5) {
          teamList = createTeamListFive(playerList);
        } else {
          teamList = createTeamOverFive(playerList);
        }
        
        return GameSession.findOneAndUpdate({sessionCode}, {$set: {teamList}}, {new: true});
      }
    })
    .then(newGameSession => {
      socket.nsp.to(sessionCode).emit('shuffleTeams', newGameSession);
    })
    .catch(err => {
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};
