import './App.css';
import Player from './player.jsx';
import { useState, useRef, useEffect } from 'react';
import Turn from './turn.jsx';
import Button from './Button.jsx';
import Algorithms from './Algorithms.jsx';
import { greedyAlgorithm, thresholdAlgorithm, getValue, getChange, normalizeCoinCounts, isEmpty } from './algorithms.js';

/** @param {'pennies'|'nickels'|'dimes'|'quarters'} key */
function coinQuantityLabel(key, count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const singular = { pennies: 'penny', nickels: 'nickel', dimes: 'dime', quarters: 'quarter' };
  const plural = { pennies: 'pennies', nickels: 'nickels', dimes: 'dimes', quarters: 'quarters' };
  const word = n === 1 ? singular[key] : plural[key];
  return `${n} ${word}`;
}

function readChange(dict) {
  if (dict === "nothing") return dict;
  const order = ["quarters", "dimes", "nickels", "pennies"];
  const parts = [];
  for (const key of order) {
    const n = Math.max(0, Math.floor(Number(dict[key]) || 0));
    if (n > 0) parts.push(coinQuantityLabel(key, n));
  }
  const size = parts.length;
  if (size === 0) return "nothing";
  let text = "";
  for (let i = 0; i < size; i++) {
    text += parts[i];
    switch (i) {
      case size - 1:
        break;
      case size - 2:
        text += ", and ";
        break;
      default:
        text += ", ";
        break;
    }
  }
  return text;
}

function getChoices(playerCoins, currentTableCoins) {
  const choices = [];

  if (playerCoins.pennies > 0) {
    choices.push({
      label: "• put a penny in and take out nothing",
      choiceValue: 0
    });
  }
  if (playerCoins.nickels > 0) {
    choices.push({
      label: `• put a nickel in and take out ${readChange(getChange("nickel", currentTableCoins))}`,
      choiceValue: 1
    });
  }
  if (playerCoins.dimes > 0) {
    choices.push({
      label: `• put a dime in and take out ${readChange(getChange("dime", currentTableCoins))}`,
      choiceValue: 2
    });
  }
  if (playerCoins.quarters > 0) {
    choices.push({
      label: `• put a quarter in and take out ${readChange(getChange("quarter", currentTableCoins))}`,
      choiceValue: 3
    });
  }

  return choices;
}

function Pennywise() {
  const [gameState, setGameState] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [humanCoins, setHumanCoins] = useState({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 });
  const [computerCoins, setComputerCoins] = useState({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 });
  const [tableCoins, setTableCoins] = useState({ pennies: 0, nickels: 0, dimes: 0, quarters: 0 });
  const [logMessages, setLogMessages] = useState([]);
  const currentChoices = getChoices(humanCoins, tableCoins);
  const logRef = useRef(null);
  const computerTimer = useRef(null);
  useEffect(() => () => clearTimeout(computerTimer.current), []);

  function restart() {
    clearTimeout(computerTimer.current);
    setGameState("start");
    setHumanCoins({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 });
    setComputerCoins({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 });
    setTableCoins({ pennies: 0, nickels: 0, dimes: 0, quarters: 0 });
    setLogMessages([]);
  }
  /** `'greedy' | 'threshold' | null` — string id so the delayed computer turn never uses a stale function reference. */
  const [algorithmId, setAlgorithmId] = useState(null);
  const [description, setDescription] = useState("");

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logMessages]);


  function add(text) {
    setLogMessages(prev => [...prev, text]);
  }

  function take(choice, startCoins, currentTableCoins = tableCoins) {
    let endCoins = JSON.parse(JSON.stringify(startCoins)); // deep copy
    let newTableCoins = normalizeCoinCounts(currentTableCoins);

    const coinTypes = ["pennies", "nickels", "dimes", "quarters"];
    const coinNames = ["penny", "nickel", "dime", "quarter"];

    const coinType = coinTypes[choice];
    const coinName = coinNames[choice];

    // Validate that we have the coin to spend
    if (!endCoins[coinType] || endCoins[coinType] <= 0) {
      console.error(`Cannot spend ${coinName} - player has ${endCoins[coinType]} ${coinType}`);
      return { coins: endCoins, tableCoins: newTableCoins };
    }

    const change = getChange(coinName, newTableCoins); // get once and reuse

    // Spend the coin
    endCoins[coinType]--;
    newTableCoins[coinType]++; // ✅ properly add paid coin to table

    // If change is possible, adjust inventories
    if (change !== "nothing") {
      endCoins = incCoins(change, endCoins, true);     // add to player
      newTableCoins = incCoins(change, newTableCoins, false); // remove from table
    }

    return { coins: endCoins, tableCoins: newTableCoins };
  }

  function incCoins(change, coins, add) {
    const newCoins = { ...coins };
    const keys = Object.keys(change);
    const values = Object.values(change);
    const size = keys.length;
    for (let i = 0; i < size; i++) {
      const key = keys[i];
      const value = values[i];
      if (add) {
        newCoins[key] = (newCoins[key] || 0) + value;
      } else {
        newCoins[key] = Math.max(0, (newCoins[key] || 0) - value);
      }
    }
    return newCoins;
  }

  function handleChoice(choice) {
    if (gameState !== "humanTurn") return;
    // Update human coins with current table state
    const result = take(choice.choiceValue, humanCoins, tableCoins);
    setHumanCoins(result.coins);
    setTableCoins(result.tableCoins);

    // Log what the human player did
    add(`You ${choice.label}`);

    add(`Computer total value: ${getValue(computerCoins)}¢`);
    add(`Your total: ${getValue(result.coins)}¢`);

    if (isEmpty(result.coins)) return;

    // Switch to computer turn
    setGameState("computerTurn");

    // Snapshots avoid stale React state after the delay (same moment as the UI the user saw).
    const snapshotTable = { ...result.tableCoins };
    const snapshotHuman = structuredClone(result.coins);
    const snapshotComputer = structuredClone(computerCoins);
    const snapshotAlgorithmId = algorithmId ?? "greedy";

    computerTimer.current = setTimeout(() => {
      computerTurn(snapshotTable, snapshotAlgorithmId, snapshotComputer, snapshotHuman);
    }, 1000);
  }

  function computerTurn(currentTableCoins, algorithmIdSnapshot, computerSnapshot, humanSnapshot) {
    let newComputerCoins = normalizeCoinCounts({ ...computerSnapshot });
    let newTableCoins = normalizeCoinCounts({ ...currentTableCoins });

    const coinNameToChoice = { penny: 0, nickel: 1, dime: 2, quarter: 3 };
    const pick =
      algorithmIdSnapshot === "threshold" ? thresholdAlgorithm : greedyAlgorithm;
    const coinName = pick(newComputerCoins, newTableCoins) || "penny";
    const choiceIndex = coinNameToChoice[coinName] ?? 0;
    const tableBeforeMove = { ...newTableCoins };
    let result = take(choiceIndex, newComputerCoins, newTableCoins);
    newComputerCoins = result.coins;
    newTableCoins = result.tableCoins;
    add(`Computer will put a ${coinName} in and take out ${readChange(getChange(coinName, tableBeforeMove))}.`);

    setComputerCoins(newComputerCoins);
    setTableCoins(newTableCoins);
    add(`Computer total value: ${getValue(newComputerCoins)}¢`);
    add(`Your total: ${getValue(humanSnapshot)}¢`);

    // Switch back to human turn with updated table coins
    setGameState("humanTurn");
    // Use the updated coins directly instead of relying on state
  }

  if (gameState === "start") {
    return (
      <div>
        <form onSubmit={(event) => event.preventDefault()}>
          <h1>Pennywise</h1>
  
          <input
            aria-label="Your name"
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
  
          <h3>Select Computer Algorithm:</h3>
  
          <label>
            <input
              type="radio"
              name="algo"
              value="greedy"
              checked={algorithmId === "greedy"}
              onChange={() => {setAlgorithmId("greedy"); setDescription("The greedy algorithm is a simple algorithm that always chooses the best option available at each step.");}}
            />
            Greedy Algorithm
          </label>
  
          <br />
  
          <label>
            <input
              type="radio"
              name="algo"
              value="threshold"
              checked={algorithmId === "threshold"}
              onChange={() => {setAlgorithmId("threshold"); setDescription("The threshold algorithm is a more complicated algorithm that uses a sequence of thresholds to decide on the best coin.");}}
            />
            Threshold Algorithm
          </label>
  
          <br /><br />
  
          <Button
            onClick={() => {
              const name = playerName.trim();
  
              setPlayerName(name || "You");
              setGameState("humanTurn");
              setLogMessages([]);
  
              setHumanCoins({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 });
              setComputerCoins({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 });
              setTableCoins({ pennies: 0, nickels: 0, dimes: 0, quarters: 0 });
            }}
            disabled={!algorithmId}
          >
            Start
          </Button>
        </form>
      </div>
    );
  }

  // Check for game over conditions
  if (isEmpty(computerCoins)) {
    return (
      <div>
        <h1>You win!</h1>
  
        <h3>Your remaining coins:</h3>
        <Player name={playerName} coins={humanCoins} />
  
        <Button onClick={restart}>
          Restart
        </Button>
      </div>
    );
  }
  

  if (isEmpty(humanCoins)) {
    return (
      <div>
        <h1>You lose!</h1>
  
        <h3>Computer’s remaining coins:</h3>
        <Player name="Computer" coins={computerCoins} />
  
        <Button onClick={restart}>
          Restart
        </Button>
      </div>
    );
  }
  

  return (
    <div className="game-container">
      <div className="stats-section">
        <div className="players">
          <Player name={playerName} coins={humanCoins}></Player>
          <Player className="table" name="Table" coins={tableCoins}></Player>
          <Player name="Computer" coins={computerCoins}></Player>
        </div>
        <Turn turn={gameState}></Turn>
        <Algorithms algorithmId={algorithmId} description={description}></Algorithms>
      </div>
      <div className="log-section">
        <div id="log" ref={logRef}>
          {logMessages.map((message, index) => (
            <p key={index} >{message}</p>
          ))}
          <div id="buttons">
            {gameState === "humanTurn" && currentChoices.map((choice, index) => (
              <Button key={index} onClick={() => handleChoice(choice)}>
                {choice.label}
              </Button>
            ))}
            <Button id="restart" onClick={restart}>Restart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pennywise;