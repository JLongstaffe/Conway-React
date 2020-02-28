
import React from 'react';

import './App.css';

import GridContainer from './GridContainer/GridContainer';

import * as Conway from '../Conway.Core/Conway';

const [height, width] = [25, 25];

const initialGrid = randomInitialGrid(height, width);

const App = () => <GridContainer initialGrid={initialGrid}
                                 nextState={Conway.NextState}
                                 updateFrequency={300} />;

function randomInitialGrid(height: number, width: number)
{
    const randomBool = () => { return Math.random() < 0.5 ? true : false; }

    let initialGrid: boolean[][] =
        new Array(height).fill(new Array(width).fill(false));

    initialGrid = initialGrid.map(row => row.map(_ => randomBool()));

    return initialGrid;
}

export default App;
