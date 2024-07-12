document.addEventListener("DOMContentLoaded", () => {
    const grid = [
        ['H', 'A', 'P', 'P', 'Y', '', '', '', '', ''],
        ['A', '', '', '', 'I', '', '', '', '', ''],
        ['P', '', '', '', 'G', '', '', '', '', ''],
        ['P', '', '', '', 'H', '', '', '', '', ''],
        ['Y', 'I', 'G', 'H', 'T', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '']
    ];

    const acrossHints = [
        { number: 1, hint: "Feeling or showing pleasure or contentment" },
    ];

    const downHints = [
        { number: 2, hint: "A day of the week (abbr.)" },
    ];

    async function fetchLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');
            const data = await response.json();
            const leaderboardList = document.getElementById("leaderboard");
            leaderboardList.innerHTML = '';
            data.forEach(name => {
                const li = document.createElement("li");
                li.innerText = name;
                leaderboardList.appendChild(li);
            });
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    }

    async function addToLeaderboard(name) {
        try {
            const response = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            if (response.ok) {
                fetchLeaderboard();
            } else {
                console.error("Error adding to leaderboard");
            }
        } catch (error) {
            console.error("Error adding to leaderboard:", error);
        }
    }

    function createGrid() {
        const crossword = document.getElementById("crossword");

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");

                if (grid[i][j] !== '') {
                    const input = document.createElement("input");
                    input.setAttribute("maxlength", "1");
                    cell.appendChild(input);
                }

                crossword.appendChild(cell);
            }
        }
    }

    function addClueNumbers() {
        const cells = document.querySelectorAll(".cell");

        // Across clue numbers
        acrossHints.forEach(clue => {
            const row = Math.floor(clue.number / 10);
            const col = clue.number % 10 - 1;
            const cell = cells[row * 10 + col];
            const clueNumber = document.createElement("span");
            clueNumber.classList.add("clue-number");
            clueNumber.innerText = clue.number;
            cell.appendChild(clueNumber);
        });

        // Down clue numbers
        downHints.forEach(clue => {
            const row = Math.floor(clue.number / 10);
            const col = clue.number % 10 - 1;
            const cell = cells[row * 10 + col];
            const clueNumber = document.createElement("span");
            clueNumber.classList.add("clue-number");
            clueNumber.innerText = clue.number;
            cell.appendChild(clueNumber);
        });
    }

    function addHints() {
        const acrossList = document.getElementById("across-hints");
        const downList = document.getElementById("down-hints");

        acrossHints.forEach(clue => {
            const li = document.createElement("li");
            li.innerText = `${clue.number}. ${clue.hint}`;
            acrossList.appendChild(li);
        });

        downHints.forEach(clue => {
            const li = document.createElement("li");
            li.innerText = `${clue.number}. ${clue.hint}`;
            downList.appendChild(li);
        });
    }

    function checkAnswers() {
        const cells = document.querySelectorAll(".cell");
        let correct = true;

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] !== '') {
                    const input = cells[i * 10 + j].querySelector("input");
                    if (input.value.toUpperCase() !== grid[i][j]) {
                        correct = false;
                        break;
                    }
                }
            }
        }

        return correct;
    }

    document.getElementById("submit-btn").addEventListener("click", () => {
        const result = document.getElementById("result");
        if (checkAnswers()) {
            const name = prompt("Congratulations! Enter your name for the leaderboard:");
            if (name) {
                addToLeaderboard(name);
            }
            result.innerText = "Correct! Well done!";
            result.style.color = "green";
        } else {
            result.innerText = "Some answers are incorrect. Please try again.";
            result.style.color = "red";
        }
    });

    createGrid();
    addClueNumbers();
    addHints();
    fetchLeaderboard();
});

