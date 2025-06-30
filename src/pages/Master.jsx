import React, { useState } from 'react';
import './Master.css';

const App = () => {
  const [_bonusActive, setBonusActive] = useState(false);
  const [credit, setCredit] = useState(100);
  const [withdraw, setWithdraw] = useState(0);
  const [bets, setBets] = useState(Array(8).fill(0));
  const [freePlays, setFreePlays] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [outerStop, setOuterStop] = useState(null);
  const [innerStop, setInnerStop] = useState(null);
  const [selectorStop, setSelectorStop] = useState(null);
  const [freePlayReward, setFreePlayReward] = useState(null);
  const [highlightCell, setHighlightCell] = useState(null);

  const gridValues = [
    [35, 40, 500, 1000, 45, 50],
    [30, 35, 200, 250, 40, 45],
    [25, 30, 150, 200, 35, 40],
    [15, 20, 50, 100, 25, 30],
    [10, 15, 40, 50, 20, 25],
  ];

  const getRandomIndex = () => Math.floor(Math.random() * 8);
  const getRandomGrid = () => [Math.floor(Math.random() * 5), Math.floor(Math.random() * 6)];
  const getOppositeIndex = (index) => (index + 4) % 8;
  const getAdjacentIndices = (index) => [(index + 1) % 8, (index + 7) % 8];

  const handleBet = (index) => {
    setBets((prev) => {
      const updated = [...prev];
      updated[index] = prev[index] >= 20 ? 0 : prev[index] + 1;
      return updated;
    });
  };

  const handleTake = () => {
    if (withdraw > 0) {
      setCredit((prev) => prev + withdraw);
      setWithdraw(0);
    }
  };

  const handleOut = () => {
    setCredit(0);
  };

  const handleStart = () => {
    const totalBet = bets.reduce((sum, val) => sum + val, 0);
    if (freePlays === 0 && (credit === 0 || totalBet > credit)) return;

    if (freePlays > 0) {
      setFreePlays((prev) => prev - 1);
    } else {
      setCredit((prev) => prev - totalBet);
    }

    setOuterStop(null);
    setInnerStop(null);
    setSelectorStop(null);
    setFreePlayReward(null);

    let outerIndex = 0;
    const outerInterval = setInterval(() => {
      setOuterStop(outerIndex % 8);
      outerIndex++;
    }, 100);

    setTimeout(() => {
      clearInterval(outerInterval);
      const finalOuter = getRandomIndex();
      setOuterStop(finalOuter);

      let innerIndex = 0;
      const innerInterval = setInterval(() => {
        setInnerStop(innerIndex % 8);
        innerIndex++;
      }, 100);

      setTimeout(() => {
        clearInterval(innerInterval);
        const finalInner = getRandomIndex();
        setInnerStop(finalInner);

        let selectorIndex = 0;
        const selectorInterval = setInterval(() => {
          setSelectorStop(selectorIndex % 8);
          selectorIndex++;
        }, 100);

        setTimeout(() => {
          clearInterval(selectorInterval);
          const finalSelector = getRandomIndex();
          setSelectorStop(finalSelector);

          const [gridRow, gridCol] = getRandomGrid();
          const rewardMultiplier = gridValues[gridRow][gridCol];
          setHighlightCell({ row: gridRow, col: gridCol });

          const winningIndices = [
            finalInner,
            ...getAdjacentIndices(finalInner),
            getOppositeIndex(finalInner),
          ];
          const isWin = finalOuter === finalInner || winningIndices.includes(finalOuter);
          const betAmount = bets[finalOuter] || 0;

          if (finalOuter === finalInner && finalInner === finalSelector) {
            const bonusPlays = Math.floor(Math.random() * 15) + 1;
            setFreePlays((prev) => prev + bonusPlays);
            setFreePlayReward(bonusPlays);
          }

          if (isWin && betAmount > 0) {
            const reward = betAmount * rewardMultiplier;
            setWithdraw((prev) => prev + reward);
            setWinStreak((prev) => prev + 1);
            if (winStreak + 1 >= 5) setBonusActive(true);
          } else {
            setWinStreak(0);
            setBonusActive(false);
          }

          setPlayCount((prev) => prev + 1);
          if (playCount + 1 >= 50) {
            setFreePlays((prev) => prev + Math.floor(Math.random() * 15) + 1);
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const _isOnlyInRowCol = (rowIdx, colIdx, value) => {
    const inRow = gridValues[rowIdx].some((v, i) => v === value && i !== colIdx);
    const inCol = gridValues.some((row, i) => row[colIdx] === value && i !== rowIdx);
    return !inRow && !inCol;
  };

  const totalBet = bets.reduce((sum, val) => sum + val, 0);
  const buttonsDisabled = credit === 0 && withdraw === 0 && freePlays === 0;

  return (
    <div className="game-container">
      <header className="header-section">
        <div className="digital mega">MEGA FREE PLAY: {playCount >= 50 ? 'YES' : '000'}</div>
        <div className="title">MASTER</div>
        <div className="digital bonus">SPECIAL BONUS: {winStreak >= 5 ? 'YES' : '00000'}</div>
      </header>

      <div className="grid-values">
        {gridValues.map((row, rowIndex) => (
          <div className="grid-row" key={rowIndex}>
            {row.map((val, colIndex) => (
              <div
                key={colIndex}
                className={`grid-cell ${
                  highlightCell &&
                  highlightCell.row === rowIndex &&
                  highlightCell.col === colIndex
                    ? 'grid-highlight blink'
                    : ''
                }`}
              >
                {val}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="credit-withdraw">
        <div className="credit-panel">
          <div className={`digital ${freePlays > 0 ? 'credit-dimmed' : ''}`}>
            CREDIT: {credit}
          </div>
          <button onClick={handleOut} disabled={buttonsDisabled}>OUT</button>
        </div>
        <div className="withdraw-panel">
          <div className="digital">WITHDRAW: {withdraw}</div>
          <button onClick={handleTake} disabled={withdraw === 0}>TAKE</button>
        </div>
      </div>

      <div className="game-area">
        <div className="left-panel">
          <div className="freeplay-display">
            <div className="digital block">{freePlayReward !== null ? 'FREE PLAY' : '00'}</div>
            <div className="box-label">FREE PLAY</div>
          </div>
        </div>

        <div className="selector-lights">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className={`selector-digit ${selectorStop === idx ? 'active' : ''}`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        <div className="circle-area">
          <div className="outer-circle">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className={`circle-number ${outerStop === idx ? 'active' : ''}`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          <div className="inner-circle">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className={`circle-number ${innerStop === idx ? 'active' : ''}`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bet-section">
        {bets.map((count, index) => (
          <div key={index} className="bet-box">
            <div className="digital bet-label">{index + 1}</div>
            <button
              onClick={() => handleBet(index)}
              className="bet-button"
              disabled={buttonsDisabled}
            >
              {count}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        className="start-btn"
        disabled={totalBet === 0 || buttonsDisabled}
      >
        START
      </button>
    </div>
  );
};

export default App;
