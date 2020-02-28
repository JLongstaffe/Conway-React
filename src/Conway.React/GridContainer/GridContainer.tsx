
import React, { FunctionComponent, useState } from 'react';

import useInterval from '../useInterval';

import Grid from './Grid/Grid';

const GridContainer: FunctionComponent<IGridProperties> =
    ({ initialGrid, nextState, updateFrequency }) =>
{
    const [grid, setGrid] = useState(initialGrid);

    const onNext = () => setGrid(nextState(grid));

    const [playing, setPlaying] = useInterval(onNext, updateFrequency);

    const togglePlay = () => setPlaying(!playing);

    return <>
             <Grid grid={grid} setGrid={setGrid} />

             <button onClick={onNext}>Next</button>
             <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>
           </>;
}

interface IGridProperties
{
    initialGrid: Readonly2D<boolean>;

    nextState: (state: Readonly2D<boolean>) => Readonly2D<boolean>;

    updateFrequency: number;
}

type Readonly2D<T> = ReadonlyArray<ReadonlyArray<T>>;

export default GridContainer;
