const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startMenu() {
  console.clear();
  console.log("[1] Play game");
  console.log("[2] Rules");
  console.log("[3] Quit");

  rl.question("Choose an option: ", (input) => {
    if (input === "1") {
      gameMenu();
    } else if (input === "2") {
      console.log("2");
      printRules();
    } else if (input === "3") {
      console.log("3");
      rl.close();
    } else {
      startMenu();
    };
  });
};

function printRules() {
  console.clear();
  console.log("Mastermind rules:");
  console.log("Your jobb is to guess the 4 color code, You have 10 tries.");
  console.log("The colors that the code could be made up with are: Red, Green, Blue, Yellow, Orange and Pink. The same color can occur more than once.");
  console.log("The Simplified Typing mode let's you input one-letter abriviations instead e.g: R. G, B, Y, O, P.");
  rl.question("Would you like to go back to the menu? (Yes or No) ", (input) => {
    if (input.toLowerCase() == "yes") {
      startMenu();
    } else {
      console.clear();
      printRules();
    };
  });
};

function gameMenu() {
  console.clear();
  console.log("[1] Normal");
  console.log("[2] Simple Typing (More info in rules)");
  console.log("[3] Go back");
  
  rl.question("Choose input: ", (gameMenuChoice) => {
    if (gameMenuChoice== "1") {
      main();
    } else if (gameMenuChoice == "2") {
      mainST();
    } else if (gameMenuChoice == "3") {
      startMenu();
    } else {
      console.log("Invalid choice, please enter a valid number");
      gameMenu();
    }
  });
}

function generateCorrectCode() {
  // Generates the random 4-color code out of the 6 colors in the "colors" list
  let colors = ["RED", "GREEN", "BLUE", "YELLOW", "ORANGE", "PINK"];
  
  // Function to pick a random color
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  let color1 = getRandomColor();
  let color2 = getRandomColor();
  let color3 = getRandomColor();
  let color4 = getRandomColor();
  
  let correctCode = [color1, color2, color3, color4];
  console.log(`Correct code: ${correctCode.join(", ")}`); // (For debugging)
  return correctCode;
}

async function codeGuess() {
  return new Promise((resolve) => {
    rl.question("Enter your guess, the possible colors are: (Red, Green, Blue, Yellow, Orange and Pink). Please use spaces in between your 4 colors: ", (userGuess) => {
      let guess = userGuess.toUpperCase().split(" ");
      resolve(guess);
    });
  });
}

function checkGuess(guess, correctCode) {
  // First checks if the color is the right color *and* in the right position, if not, checks if its in the code at all.
  console.log(guess);
  for (let i = 0; i < 4; i++) {
    if (guess[i] === correctCode[i]) {
      console.log(`${guess[i]} is in the code and in the correct position ${i + 1}`);
    } else if (correctCode.includes(guess[i])) {
      console.log(`${guess[i]} is in the code but not in the correct position ${i + 1}`);
    } else {
      console.log(`The color ${guess[i]} is not in the code`);
    }  
  }
}

function checkWin(guess, correctCode) {
  if (typeof guess === 'string') {
    guess = guess.split(" "); // Assumes space-separated values like "r y g p"
  }
  if (typeof correctCode === 'string') {
    correctCode = correctCode.split(" "); // Assumes space-separated values
  }
  
  const colorToCode = {
    "YELLOW": "y",
    "RED": "r",
    "GREEN": "g",
    "PINK": "p",
    "BLUE": "b",
    "ORANGE": "o"
  };

  // Function to convert either full color names or one-letter codes to one-letter codes
  const convertToCode = color => colorToCode[color.toUpperCase()] || color.toLowerCase();

  // Convert both the guess and correctCode arrays to one-letter codes
  const guessCodes = guess.map(color => convertToCode(color));
  const correctCodes = correctCode.map(color => convertToCode(color));

  console.log(guessCodes, correctCodes);   // Debugging output

  const win = guessCodes.length === correctCodes.length && guessCodes.every((value, index) => value === correctCodes[index]);

  return win;
}

async function codeGuessST() { // Simplified Typing
  let colorDict = {
    "R": "RED",
    "G": "GREEN",
    "B": "BLUE",
    "Y": "YELLOW",
    "O": "ORANGE",
    "P": "PINK"
  }

  // Gets the user's guess with one-letter abbreviations
  return new Promise((resolve) => {
    rl.question("Enter your guess, using one-letter abbreviations (e.g., 'R G B Y O P'): ", (userGuess) => {
      let guess = userGuess.split(" ").map(letter => colorDict[letter.toUpperCase()] || letter.toUpperCase());
      console.log(guess);
      resolve(guess);
    });
  });
}

function checkGuessST(guess, correctCode) { // Simplified Typing
  // First checks if the color is the right color *and* in the right position, if not, checks if it's in the code at all.
  console.log("checking guess", guess)
  for (let i = 0; i < 4; i++) {
    if (guess[i] == correctCode[i]) {
      console.log(`${guess[i]} is in the code and in the correct position ${i + 1}`);
    } else if (correctCode.includes(guess[i])) {
      console.log(`${guess[i]} is in the code but not in the correct position ${i + 1}`);
    } else {
      console.log(`The color ${guess[i]} is not in the code`);    
    }
  }
}

async function main() {
  // Runs the main game
  let tries = 0
  let playing = true
  let correct = generateCorrectCode() 
  while (playing) {
    tries += 1;
    let guess = await codeGuess()
    let winCondition = checkWin(guess, correct);
    console.clear();
    if (winCondition) {
      console.clear();
      console.log(`Your guess was ${guess}`);
      console.log(`You won! It took ${tries} tries`);
      playing = false;
      rl.close();
    } else {
      checkGuess(guess, correct);
    };
    if (tries === 10) {
      console.log(`You lost! It has been 10 tries and you have not guessed the code. The code is ${correct} your last guess was ${guess}`);
    };
  };
};

async function mainST() { // Simplified Typing
  // Runs the main game
  let tries = 0
  let playing = true
  let correct = generateCorrectCode() 
  while (playing) {
    tries += 1;
    let guess = await codeGuessST();
    let winCondition = checkWin(guess, correct);
    console.clear();
    if (winCondition) {
      console.clear();
      console.log(`Your guess was ${guess}`);
      console.log(`You won! It took ${tries} tries`);
      playing = false;
      rl.close();
    } else {
      checkGuessST(guess, correct);
    };
    if (tries === 10) {
      console.log(`You lost! It has been 10 tries and you have not guessed the code. The code is ${correct} your last guess was ${guess}`);
    };
  };
};

startMenu()