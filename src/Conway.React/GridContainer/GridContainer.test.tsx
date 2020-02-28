
import React from 'react'

import { render, fireEvent, act } from '@testing-library/react';

import GridContainer from './GridContainer';

import { IStateGenerator } from '../../Conway.Core/Conway';

test('Grid snapshots', () =>
{
    const horizontal = render
        (<GridContainer initialGrid={horizontalState}
                        nextState={_ => []}
                        updateFrequency={0} />)
        .container;

    expect(horizontal.firstChild).toMatchSnapshot();

    const vertical = render
        (<GridContainer initialGrid={verticalState}
                        nextState={_ => []}
                        updateFrequency={0} />)
        .container;

    expect(vertical.firstChild).toMatchSnapshot();
});

test('Clicking on cell toggles alive state', () =>
{
    const { getByTestId } = render
        (<GridContainer initialGrid={horizontalState}
                        nextState={_ => []}
                        updateFrequency={0} />);

    const cell = getByTestId('1-1');

    const aliveBackground = cell.style.backgroundColor;

    fireEvent.click(cell);

    let toggledBackground = cell.style.backgroundColor;

    expect(toggledBackground).not.toBe(aliveBackground);

    fireEvent.click(cell);

    toggledBackground = cell.style.backgroundColor;

    expect(toggledBackground).toBe(aliveBackground);
});

test('Clicking Next advances next Conway state', () =>
{
    const mockNextState: jest.MockedFunction<IStateGenerator> = jest.fn();

    mockNextState.mockReturnValue(verticalState);

    let { getByText, asFragment } = render
        (<GridContainer initialGrid={horizontalState}
                        nextState={mockNextState}
                        updateFrequency={0} />);

    const nextButton = getByText('Next');

    fireEvent.click(nextButton);

    expect(mockNextState).toHaveBeenCalledTimes(1);

    const secondRenderHtml = asFragment().firstElementChild?.outerHTML;

    expect(secondRenderHtml).toEqual(getGridHtml(verticalState));
});

test('Clicking Play button toggles button text', () =>
{
    const { queryByText } = render
        (<GridContainer initialGrid={horizontalState}
                        nextState={_ => []}
                        updateFrequency={0} />);

    const button = queryByText('Play') as HTMLButtonElement;

    fireEvent.click(button);

    expect(queryByText('Pause')).not.toBeNull();

    fireEvent.click(button);

    expect(queryByText('Play')).not.toBeNull();
});

test('Play updates state with correct frequency', () =>
{
    jest.useFakeTimers();

    const mockNextState: jest.MockedFunction<IStateGenerator> = jest.fn();

    mockNextState.mockReturnValue([]);

    const { getByText } = render
        (<GridContainer initialGrid={[]}
                        nextState={mockNextState}
                        updateFrequency={3} />);

    expect(mockNextState).not.toBeCalled();

    act(() =>
    {
        fireEvent.click(getByText('Play'));

        jest.advanceTimersByTime(16);
    });

    expect(mockNextState).toHaveBeenCalledTimes(5);
});

test('Clicking Pause stops periodic updates', () =>
{
    jest.useFakeTimers();

    const mockNextState: jest.MockedFunction<IStateGenerator> = jest.fn();

    mockNextState.mockReturnValue([]);

    const { getByText } = render
        (<GridContainer initialGrid={[]}
                        nextState={mockNextState}
                        updateFrequency={3} />);

    expect(mockNextState).not.toBeCalled();

    act(() =>
    {
        fireEvent.click(getByText('Play'));

        jest.advanceTimersByTime(10);

        fireEvent.click(getByText('Pause'));

        jest.advanceTimersByTime(6);
    });

    expect(mockNextState).toHaveBeenCalledTimes(3);
});

function getGridHtml(state: Readonly2D<boolean>)
{
    return render
        (<GridContainer initialGrid={state}
                        nextState={_ => []}
                        updateFrequency={0} />)
        .asFragment()
        .firstElementChild?.outerHTML;
}

const horizontalState = To2DBoolean([[ 0, 0, 0 ],
                                     [ 1, 1, 1 ],
                                     [ 0, 0, 0 ]]);

const verticalState = To2DBoolean([[ 0, 1, 0 ],
                                   [ 0, 1, 0 ],
                                   [ 0, 1, 0 ]]);

function To2DBoolean(input: number[][]): boolean[][]
{
    return input.map(x => x.map(y => y === 1));
}

type Readonly2D<T> = ReadonlyArray<ReadonlyArray<T>>;