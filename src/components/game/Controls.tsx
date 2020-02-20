import React from 'react';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import store from '../../redux/store';
import { initGame, resetScore, automateMove } from '../../redux/actions';

interface ControlProps {
  score?: number;
  iteration?: number;
  runningScore?: number;
  
}

const useStyles = makeStyles((theme: Theme) => ({
  score: {
    color: '#dd0',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(1)
  },
  automateButton: {
    marginTop: theme.spacing(4)
  }
}));

const Controls: React.FC<ControlProps> = ({ score, iteration, runningScore }): JSX.Element => {

  const styles = useStyles({});

  const handleNewGame = (): void => {
    store.dispatch(initGame());
  };

  const handleResetScore = (): void => {
    store.dispatch(resetScore());
  };

  const move100Times = (): void => {
    store.dispatch(automateMove(100))
  }

  return (
    <>
      <div className={styles.score}>
        <Typography variant="body1">
          <b>Score:</b>
          {' '}
          {score || 0}
        </Typography>
        <Typography variant="body1">
          <b>Total Score:</b>
          {' '}
          {runningScore || 0}
        </Typography>
        <Typography variant="body1">
          <b>Iteration:</b>
          {' '}
          {iteration || 1}
        </Typography>
      </div>

      <Button onClick={handleNewGame} className={styles.button} fullWidth color="primary" variant="contained">New Game</Button>
      <Button onClick={handleResetScore} className={styles.button} fullWidth variant="contained">Reset Score</Button>
      <Button onClick={move100Times} fullWidth className={styles.automateButton} variant="outlined">Move x100</Button>
    </>
  );
};

export default Controls;