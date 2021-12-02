//import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Graph from './graph';

test('renders no input without crashing', () => {
  // Mock alert
  window.alert = jest.fn(() => {});
  const { getByRole } = render(<Graph data={[]}/>);

  const button = getByRole('button', {name: ""});
  expect(button).toBeInTheDocument();

  expect(window.alert).toHaveBeenCalled();
  window.alert.mockClear();
  userEvent.click(button);
  expect(window.alert).toHaveBeenCalled();
  window.alert.mockClear();
  userEvent.click(button);
  expect(window.alert).toHaveBeenCalled();
  window.alert.mockClear();
  userEvent.click(button);
  expect(window.alert).toHaveBeenCalled();
});

test('renders input without crashing', () => {
  const { getByRole, getByTestId } = render(<Graph data={
    [
      {timestamp: '11-28-2021T11:11:11', score: 1}, 
      {timestamp: '11-28-2021T11:11:11', score: -1},
      {timestamp: '11-27-2021T11:11:11', score: -1},
      {timestamp: '11-27-2021T11:11:11', score: 1},
    ]}/>);
  expect(window.alert).not.toHaveBeenCalled();
  
  const button = getByRole('button', {name: ""});
  expect(button).toBeInTheDocument();

  // Check that the button cycles through all 3 graphs
  expect(getByTestId('oneLine')).toBeInTheDocument();
  userEvent.click(button);
  expect(getByTestId('histogram')).toBeInTheDocument();
  userEvent.click(button);
  expect(getByTestId('twoLine')).toBeInTheDocument();
  userEvent.click(button);
  expect(getByTestId('oneLine')).toBeInTheDocument();
});
