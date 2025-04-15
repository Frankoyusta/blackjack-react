const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;
  
    for (const card of hand) {
      if (card.value === 'A') {
        aces += 1;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }
  
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
  
    return value;
  };
  
  const determineWinner = (players) => {
    const results = players.map(player => {
      const handValue = calculateHandValue(player.hand);
      return { ...player, handValue };
    });
  
    const winners = results.filter(player => player.handValue <= 21);
    const maxValue = Math.max(...winners.map(player => player.handValue));
  
    return winners.filter(player => player.handValue === maxValue);
  };
  
  export { calculateHandValue, determineWinner };