class Stack {
    constructor() {
        this.items = [];
    }

    // Push operation
    push(element) {
        this.items.push(element);
    }

    // Pop operation
    pop() {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items.pop();
    }

    // Peek operation
    peek() {
        if (this.isEmpty()) {
            return "Stack is empty";
        }
        return this.items[this.items.length - 1];
    }

    // isEmpty operation
    isEmpty() {
        return this.items.length === 0;
    }

    // Size operation
    size() {
        return this.items.length;
    }

    // Print the stack 
    print() {
        console.log(this.items);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Constraints {
    /**
     * @param {string[]} colConstraintsHead 
     * @param {string[]} rowConstraintsHead 
     * @param {string[]} colConstraintsTail 
     * @param {string[]} rowConstraintsTail 
     */
    constructor(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail) {
        const removeDots = (letter) => letter == "..." ? "" : letter;
        this.colConstraintsHead = colConstraintsHead.map(removeDots); 
        this.rowConstraintsHead = rowConstraintsHead.map(removeDots); 
        this.colConstraintsTail = colConstraintsTail.map(removeDots); 
        this.rowConstraintsTail = rowConstraintsTail.map(removeDots); 
    }
}

/**
 * @param {string[]} colConstraintsHead 
 * @param {string[]} rowConstraintsHead 
 * @param {string[]} colConstraintsTail 
 * @param {string[]} rowConstraintsTail 
 * @param {string[][]} output 
 * @param {() => Promise} onIteration
 * @returns {boolean}
 */
async function solve(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail, output, onIteration) {
    console.log("column constraints - head: " + JSON.stringify(colConstraintsHead));
    console.log("row constraints - head: " + JSON.stringify(rowConstraintsHead));
    console.log("column constraints - tail: " + JSON.stringify(colConstraintsTail));
    console.log("row constraints - tail: " + JSON.stringify(rowConstraintsTail));
    const constraints = new Constraints(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail);
    // let state = [
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    //     Array(6).fill(""),
    // ];
    let state = output;
    // initial valids
    /** @type {string[][][]} */
    let valids = [];
    for (let r = 0; r < 6; r++) {
        valids.push([]);
        for (let c = 0; c < 6; c++) {
            valids[r].push(["A", "B", "C", "D", "X"]);

            if (constraints.colConstraintsHead[c] != "") {
                if (r == 0) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsHead[c] || letter == "X");
                } else if (r >= 3) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsHead[c]);
                }
            }
            // console.log("valids 1 ", r, c, valids[r][c].length)

            if (constraints.colConstraintsTail[c] != "") {
                if (r == 5) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.colConstraintsTail[c] || letter == "X");
                } else if (r < 3) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.colConstraintsTail[c]);
                }
            }
            // console.log("valids 2 ", r, c, valids[r][c].length)

            if (constraints.rowConstraintsHead[r] != "") {
                if (c == 0) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsHead[r] || letter == "X");
                } else if (c >= 3) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsHead[r]);
                }
            }
            // console.log("valids 3 ", r, c, valids[r][c].length)

            if (constraints.rowConstraintsTail[r] != "") {
                if (c == 5) {
                    valids[r][c] = valids[r][c].filter(letter => letter == constraints.rowConstraintsTail[r] || letter == "X");
                } else if (c < 3) {
                    valids[r][c] = valids[r][c].filter(letter => letter != constraints.rowConstraintsTail[r]);
                }
            }
            // console.log("valids 4 ", r, c, valids[r][c].length)

            if (valids[r][c].length <= 1) {
                console.log("invalid constraint: ", r, c);
                return false; // invalid constraint
            }
        }
    }
    // for (let r = 0; r < 6; r++) {
    //     for (let c = 0; c < 6; c++) {
    //         output[r][c] = valids[r][c].join();
    //     }
    // }


    function findMinValid() {
        let minValid = Number.MAX_VALUE;
        let found = null;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '') {
                    continue;
                }
                if (valids[r][c].length < minValid) {
                    minValid = valids[r][c].length;
                    found = [r, c];
                }
            }
        }
        if (minValid == 0) {
            return null;
        }
        return found;
    }

    function isInvalidState() {
        // at max one of each letter in each rows
        for (let r = 0; r < 6; r++) {
            let found = [];
            let spaceCount = 0;
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '') {
                    if (state[r][c] == 'X') {
                        if (spaceCount == 2) {
                            console.log('three spaces in a row:', r, c);
                            return true;
                        }
                        spaceCount++;
                    } else if (found.includes(state[r][c])) {
                        console.log('duplicate in row:', r, c);
                        return true;
                    }
                    found.push(state[r][c]);
                }
            }
        }
    
        // at max one of each letter in each columns
        for (let c = 0; c < 6; c++) {
            let found = [];
            let spaceCount = 0;
            for (let r = 0; r < 6; r++) {
                if (state[r][c] != '') {
                    if (state[r][c] == 'X') {
                        if (spaceCount == 2) {
                            console.log('three spaces in a column:', r, c);
                            return true;
                        }
                        spaceCount++;
                    } else if (found.includes(state[r][c])) {
                        console.log('duplicate in column:', r, c);
                        return true;
                    }
                    found.push(state[r][c]);
                }
            }
        }
    
        // rowConstraintsHead
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.rowConstraintsHead[r]) {
                    console.log('rowConstraintsHead:', r, c);
                    return true;
                }
            }
        }
        // rowConstraintsTail
        for (let r = 6; r >= 0; r--) {
            for (let c = 0; c < 6; c++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.rowConstraintsTail[r]) {
                    console.log('rowConstraintsTail:', r, c);
                    return true;
                }
            }
        }
    
        // colConstraintsHead
        for (let c = 0; c < 6; c++) {
            for (let r = 0; r < 6; r++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.colConstraintsHead[c]) {
                    console.log('colConstraintsHead:', r, c);
                    return true;
                }
            }
        }
        // colConstraintsTail
        for (let c = 6; c >= 0; c--) {
            for (let r = 0; r < 6; r++) {
                if (state[r][c] != '' && state[r][c] != 'X' && state[r][c] != constraints.colConstraintsTail[c]) {
                    console.log('colConstraintsTail:', r, c);
                    return true;
                }
            }
        }

        console.log("VALID!!!");
        return false;
    }

    /**
     * @param {number} r
     * @param {number} c
     * @param {string} letter
     */
    function setLetter(r, c, letter) {
        state[r][c] = letter;
        let skipRow = true;
        let skipCol = true;
        if (letter == 'X') {
            for (let col = 0; col < 6; col++) {
                if (col == c) continue;
                if (state[r][col] == 'X') {
                    skipRow = false;
                    break;
                }
            }
            for (let row = 0; row < 6; row++) {
                if (row == r) continue;
                if (state[row][c] == 'X') {
                    skipCol = false;
                    break;
                }
            }
        } else {
            skipRow = false;
            skipCol = false;
        }
        if (!skipCol) {
            for (let row = 0; row < 6; row++) {
                if (row == r) continue;
                valids[row][c] = valids[row][c].filter(l => l != letter);
                if (letter == colConstraintsHead[c] && row < r) {
                    valids[row][c] = valids[row][c].filter(l => l != 'X');
                }
                if (letter == colConstraintsTail[c] && row > r) {
                    valids[row][c] = valids[row][c].filter(l => l != 'X');
                }
            }
        }

        if (!skipRow) {
            for (let col = 0; col < 6; col++) {
                if (col == c) continue;
                valids[r][col] = valids[r][col].filter(l => l != letter);
                if (letter == rowConstraintsHead[r] && col < c) {
                    valids[r][col] = valids[r][col].filter(l => l != 'X');
                }
                if (letter == rowConstraintsHead[r] && col > c) {
                    valids[r][col] = valids[r][col].filter(l => l != 'X');
                }
            }
        }

    }

    /**
     * @param {number} r
     * @param {number} c
     * @param {string} letter
     */
    function unsetLetter(r, c, letter) {
        state[r][c] = '';
        for (let row = 0; row < 6; row++) {
            if (row == r) continue;
            if (letter == 'X') {
                if (valids[row][c].includes('X')) continue;
            }
            valids[row][c].push(letter);
        }
        for (let col = 0; col < 6; col++) {
            if (col == c) continue;
            if (letter == 'X') {
                if (valids[r][col].includes('X')) continue;
            }
            valids[r][col].push(letter);
        }
    }

    /**
     * @param {number} depth
     */
    async function backtrack(depth) {
        console.log('depth:', depth)
        await onIteration();
        let next = findMinValid();
        if (next === null) {
            console.log("no more valid next");
            return depth == 36;
        }
        let [r, c] = next;
        for (let letter of valids[r][c]) {
            setLetter(r, c, letter);
            if (!(await backtrack(depth + 1))) {
                console.log("back tracking!");
                unsetLetter(r, c, letter);
                await onIteration();
            } else {
                console.log("valid!");
                return true;
            }
        }
        return false;
    }

    if (await backtrack(0)) {
        // for (let r = 0; r < 6; r++) {
        //     for (let c = 0; c < 6; c++) {
        //         output[r][c] = state[r][c];
        //     }
        // }
        console.log('backtrack success:')
        return true;
    } else {
        console.log('backtrack failed:')
        return false;
    }
}

