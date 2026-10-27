import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getChange, getValue, greedyAlgorithm, thresholdAlgorithm, isEmpty } from './algorithms.js'

const keys = ['pennies', 'nickels', 'dimes', 'quarters']
const coins = ['penny', 'nickel', 'dime', 'quarter']
const values = [1, 5, 10, 25]
const initial = () => ({ pennies: 4, nickels: 3, dimes: 2, quarters: 1 })

test('change is available on the table and strictly below the spent coin value', () => {
  for (let pennies = 0; pennies <= 8; pennies++) {
    for (let nickels = 0; nickels <= 6; nickels++) {
      for (let dimes = 0; dimes <= 4; dimes++) {
        const table = { pennies, nickels, dimes, quarters: 2 }
        coins.forEach((coin, index) => {
          const change = getChange(coin, table)
          assert.ok(getValue(change) < values[index])
          if (change !== 'nothing') keys.forEach(key => assert.ok((change[key] || 0) <= table[key]))
        })
      }
    }
  }
})

for (const opponent of [greedyAlgorithm, thresholdAlgorithm]) {
  test(`${opponent.name} chooses legal moves and completes a game with conserved coins`, () => {
    const players = [initial(), initial()]
    const table = { pennies: 0, nickels: 0, dimes: 0, quarters: 0 }
    let turn = 0
    while (!players.some(isEmpty)) {
      assert.ok(turn < 128, 'each move must reduce the players’ combined value')
      const player = players[turn % 2]
      const coin = (turn % 2 ? opponent : greedyAlgorithm)(player, table)
      const key = keys[coins.indexOf(coin)]
      assert.ok(player[key] > 0)
      const change = getChange(coin, table)
      player[key]--
      table[key]++
      if (change !== 'nothing') {
        for (const [kind, count] of Object.entries(change)) {
          player[kind] += count
          table[kind] -= count
          assert.ok(table[kind] >= 0)
        }
      }
      keys.forEach(kind => assert.equal(players[0][kind] + players[1][kind] + table[kind], initial()[kind] * 2))
      turn++
    }
  })
}
