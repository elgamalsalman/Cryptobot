# Cryptobot

A bot that trades crypto-currencies for you.

## Strategies

The crypto market is very volatile, and therefore the fluctuations in the prices of the crypto-currencies can be used to create profit by buying currencies in bear markets and selling in bull markets.

It would be nearly impossible to create a bot that can predict the future changes of the price of a certain coin due to the numerous factors that take part in determining its price.

### Modified RSI Strategy

This strategy will use the RSI indicator in order to perform trades, it will buy when the RSI dips below 45 and sell when it rises above 55, this is instead of the common 30-70 boundaries in order to increase the number of trades. The other modification is that the bot won't buy or sell right after the RSI cross a boundary, it will wait for an inversion in the slope of the RSI in order to maximize gains.

### Stable Coin Strategy

To implement this strategy I am looking for a coin that has a fairly stable average but with fluctuations that exceed the 0.5% everyday. I am currently thinking of using TRIBE or USDC.