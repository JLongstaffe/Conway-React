
import React, { FunctionComponent } from 'react';

import './Grid.css';

const Grid: FunctionComponent<IGridProperties> = ({ grid, setGrid }) =>
{
    const setCell = (cell: Cell) => setGrid(withCell(grid, cell));

    const rows = grid.map((row, y) =>
        <tr key={y}>
            { row.map((_, x) =>
                <Cell key={`${x}-${y}`}
                      isAlive={ grid[y][x] }
                      setAlive={ (isAlive) => setCell({ x, y, isAlive }) }
                      coords={[x, y]} />) }
        </tr>)

    return <table><tbody>{ rows }</tbody></table>;
}

const Cell: FunctionComponent<ICellProperties> = ({ isAlive, setAlive, coords } ) =>
{
    const toggleAlive = () => setAlive(!isAlive);

    const [x, y] = coords;

    return <td className={isAlive ? "alive" : ""}
               onClick={toggleAlive}
               data-testid={`${x}-${y}`}>&nbsp;</td>
}

function withCell(grid: Readonly2D<boolean>, cell: Cell): Readonly2D<boolean>
{
    return grid.map
        ((row, y) => row.map
            ((_, x) => x === cell.x && y === cell.y
                     ? cell.isAlive
                     : grid[y][x]));
}

interface IGridProperties
{
    grid: Readonly2D<boolean>;

    setGrid: (grid: Readonly2D<boolean>) => void;
}

interface ICellProperties
{
    isAlive: boolean;

    setAlive: (alive: boolean) => void;

    coords: [number, number]
}

type Cell = { x: number, y: number, isAlive: boolean };

type Readonly2D<T> = ReadonlyArray<ReadonlyArray<T>>;

export default Grid;
