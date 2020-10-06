## TO RUN:
### 0. npm install
### 1. nodemon server
### 2. In a second terminal: npm start (should open a tab in your default browser to localhost:3000)

The real game is played with 5-10 players. There is a CharacterGameVariants.json file where variants for the game are specified. I do not know the best variants for each amount of players and have not played with more than 5 people online yet (explaining why there are no variants passed 5). I have testing variants for 1-4 people. 

I recommend having a game running in your main browser and also opening an incognito tab (since it uses separate cookies) and navigating to localhost:3000. Each separate session can login with different credentials and then a two player game can be simulated. After a game is complete, you can click the reset button (visible on hover) in the bottom right corner to kick players out of the game and back to the lobby screen.

I was able to play online for about two hours with five people, talking over discord, playing the game quite close to how it would go in person (barring you cannot see facial expressions). One bug was encountered very early (when 3 people were testing and waiting for others) and fixed. Once 5 people were playing, numerous games were played without issue. One problem is that the application is not user-friendly to people who have not played the game before. After a game or two, people play-testing did not have problems navigating and using the UI.

The main idea of the game is players are assigned characters (either good or evil) and go on quests. Good wins by having three successful quests. Evil wins by having three failed quests, 5 failed team votes, or they kill Merlin. A lot of the game is done outside the UI (talking through discord) and discussing who is going on the quests, why they should or shouldn't be allowed to go, and players deducing which roles other players are.

## Flow of the Application / How to Play
You can login or create a new account from the entry point.
Once logged in to an account, there is a lobby screen (currently only one lobby) where players can join
a lobby. The first person to join is the lobby leader and can start the game once all players in the lobby
have readied up.

Once the game starts, there are multiple different phases which take place on each round of the game until a winner
is determined. The first phase has a Quest Leader (outlined with a dashed yellow border) selects players to go on
the quest (quests in a normal game variant go from left to right). Once the quest leader has selected the appropriate 
amount of players and confirmed their choice, all players in the game then either approve or reject the quest participants.

Once all players have made their choice to approve or reject the selected quest players, all players see how each other voted.

If the result is a rejection of the selected quest players, the amount of failed votes is incremented. If there is not 5 failed votes, a new quest leader is promoted who then selects players to approve/reject for the same quest.

If the result is an approval, the selected players go on the quest and each player must vote success/fail (Only evil/bad guys have the option to vote fail).

After all players on the quest vote success or fail, the results are shown to all players so they can see the result of the quest. Only how the players voted is shown, not how each player voted. This is important because if two evil players are on a quest and there are two fails shown, you know two of the players on the quest are evil.

## TODOs
0. Allow the lobby leader to select preset game variants, or even select which characters to include in the game
1. Make new-user friendly (for people who have not played the game)
2. Allow different game variants (quest selection, lady in the water)
3. Show the history of previous rounds (who was the quest leader, who were the players selected, how did the players vote approve/reject)
