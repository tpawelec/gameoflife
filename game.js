const resolutionDOM = document.querySelector("#resolutionId");
const btnStart = document.querySelector("#btnStart");
const btnStop = document.querySelector("#btnStop");
const btnReset = document.querySelector("#btnReset");

let cells;                                      // array for cells
let resolution = parseInt(resolutionDOM.value); // resolution - how many cells will be in column/row
let cellSize;                                   // cellSize calculated based on resolution
let running = false;                            // boolean for flag if life is running

cellSize = 800 / resolution;

cells = new Array(resolution * resolution);     // create array and fill it with zeroes
for (let i = 0; i < cells.length; i++) {
    cells[i] = 0;
}

/*
    Event handler for range input. After changing resolution canvas is redrawn
*/
resolutionDOM.oninput = function () {
    resolution = parseInt(this.value);
    cellSize = 800 / resolution;
    cells = new Array(resolution * resolution);
    for (let i = 0; i < cells.length; i++) {
        cells[i] = 0;
    }
    redraw();
}

/*
    SETUP FUNCTION

    Create canvas (fixed size 800x800).

    Create event handlers for reset, start and stop button.
    Key function in handlers is frameRate.
*/
function setup() {
    createCanvas(800, 800);

    btnReset.addEventListener("click", () => {
        for (let i = 0; i < cells.length; i++) {
            cells[i] = 0;
        }
        running = false;
        frameRate();
    });

    btnStart.addEventListener("click", () => {
        running = true;
        frameRate(10);
    });

    btnStop.addEventListener("click", () => {
        running = false;
        frameRate();
    })


}

function draw() {
    background(0);

    /*
        Draw board filled with rectangles. If cell is alive (1) fill rectangle with black. If not (0) fill with white.
    */
    for (let i = 0; i < cells.length; i++) {
        let x = i % resolution;
        let y = Math.floor(i / resolution);
        if (cells[i] == 0) {
            fill(255);
            stroke(0);
            rect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        } else {
            fill(0);
            stroke(0);
            rect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
    }

    /*
        Setting up live cells

        1. Check if cursor is within canvas.
        2. Check if mouse is pressed
        3. Calculate previous and current (x,y) coordinates of cursor.
        4. If previous coordinates are different from current (cursor is on top of another cell)
        5. Mark cell as alive (if previos state was dead) or dead (if precios state was alive)

        Formula [xCoordinate + resolution * yCoordinate] is for calculate index of element in 1D array represented as 2D array.
    */
    if ((mouseX >= 0 && mouseX <= width) && (mouseY >= 0 && mouseY <= height)) {

        if (mouseIsPressed) {

            let pxCoordinate = Math.floor(pmouseX / cellSize);
            let pyCoordinate = Math.floor(pmouseY / cellSize);
            let xCoordinate = Math.floor(mouseX / cellSize);
            let yCoordinate = Math.floor(mouseY / cellSize);
            if ((pxCoordinate != xCoordinate) || (pyCoordinate != yCoordinate)) {
                if (cells[xCoordinate + resolution * yCoordinate] === 0) {
                    cells[xCoordinate + resolution * yCoordinate] = 1;
                } else {
                    cells[xCoordinate + resolution * yCoordinate] = 0;
                }
            }
        }
    }

    /*
        If flag runnins is set (true) (Start button has been pressed) - run life.
    */
    if (running) {
        runLife();
    }


}

/*
    function runLife() and countNeighbors()

    1. Create temporary array for next generation of cells
    2. Calculate (x,y) coordinate based on 1D array index
    3. Count neighbors
        Add up 9 cells: 1 up,left corner of current cell
                        1 up of current cell
                        1 up,right corner of current cell
                        etc
        Subtract current cell from sum.
    4. Apply Conway game of life rules.


*/
function runLife() {

    let nextGen = new Array(resolution * resolution);

    for (let i = 0; i < cells.length; i++) {
        let x = i % resolution;
        let y = Math.floor(i / resolution);

        let neighbors = countNeighbors(cells, x, y);
        if (cells[i] == 0 && neighbors == 3) {
            nextGen[i] = 1;
        } else if ((cells[i] == 1 && neighbors < 2) || (cells[i] == 1 && neighbors > 3)) {
            nextGen[i] = 0;
        } else {
            nextGen[i] = cells[i];
        }
    }

    cells = nextGen;
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + resolution) % resolution;
            let row = (y + j + resolution) % resolution;
            sum += grid[col + resolution * row];
        }
    }
    sum -= grid[x + resolution * y];
    return sum;
}