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
 * @returns {boolean}
 */
function solve(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail, output) {
    console.log("column constraints - head: " + JSON.stringify(colConstraintsHead));
    console.log("row constraints - head: " + JSON.stringify(rowConstraintsHead));
    console.log("column constraints - tail: " + JSON.stringify(colConstraintsTail));
    console.log("row constraints - tail: " + JSON.stringify(rowConstraintsTail));
    const constraints = new Constraints(colConstraintsHead, rowConstraintsHead, colConstraintsTail, rowConstraintsTail);
    let state = [
        Array(6).fill(""),
        Array(6).fill(""),
        Array(6).fill(""),
        Array(6).fill(""),
        Array(6).fill(""),
        Array(6).fill(""),
    ];
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
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            output[r][c] = valids[r][c].join();
        }
    }
    return true;
}

/**
 * @param {string[][]} state
 * @param {Constraints} constraints
 */
function isInvalidState(state, constraints) {
    // at max one of each letter in each rows
    for (let r = 0; r < 6; r++) {
        let found = [];
        for (let c = 0; c < 6; c++) {
            if (state[r][c] != '') {
                if (found.includes(state[r][c])) {
                    return true;
                }
                found.push(state[r][c]);
            }
        }
    }

    // at max one of each letter in each columns
    for (let c = 0; c < 6; c++) {
        let found = [];
        for (let r = 0; r < 6; r++) {
            if (state[r][c] != '') {
                if (found.includes(state[r][c])) {
                    return true;
                }
                found.push(state[r][c]);
            }
        }
    }

    // rowConstraintsHead
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (state[r][c] != '' && state[r][c] != constraints.rowConstraintsHead[r]) {
                return true;
            }
        }
    }
    // rowConstraintsTail
    for (let r = 6; r >= 0; r--) {
        for (let c = 0; c < 6; c++) {
            if (state[r][c] != '' && state[r][c] != constraints.rowConstraintsTail[r]) {
                return true;
            }
        }
    }

    // colConstraintsHead
    for (let c = 0; c < 6; c++) {
        for (let r = 0; r < 6; r++) {
            if (state[r][c] != '' && state[r][c] != constraints.colConstraintsHead[c]) {
                return true;
            }
        }
    }
    // colConstraintsTail
    for (let c = 6; c >= 0; c--) {
        for (let r = 0; r < 6; r++) {
            if (state[r][c] != '' && state[r][c] != constraints.colConstraintsTail[c]) {
                return true;
            }
        }
    }
}
