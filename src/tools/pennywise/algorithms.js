/** Safe nonnegative integer counts for pennies/nickels/dimes/quarters. */
export function normalizeCoinCounts(bag) {
  const b = bag != null && typeof bag === "object" ? bag : {};
  return {
    pennies: Math.max(0, Math.floor(Number(b.pennies) || 0)),
    nickels: Math.max(0, Math.floor(Number(b.nickels) || 0)),
    dimes: Math.max(0, Math.floor(Number(b.dimes) || 0)),
    quarters: Math.max(0, Math.floor(Number(b.quarters) || 0)),
  };
}

/** Table minus coins taken out (per denomination), floored at 0. */
function subtractCoinCounts(table, taken) {
  const t = normalizeCoinCounts(table);
  const u = normalizeCoinCounts(taken);
  return {
    pennies: Math.max(0, t.pennies - u.pennies),
    nickels: Math.max(0, t.nickels - u.nickels),
    dimes: Math.max(0, t.dimes - u.dimes),
    quarters: Math.max(0, t.quarters - u.quarters),
  };
}

export function getChange(coin, currentTableCoins) {
    let change = {};
    let value = 0;

    if (coin === "penny") return "nothing";

    // Determine coin value
    if (coin === "nickel") value = 5;
    else if (coin === "dime") value = 10;
    else if (coin === "quarter") value = 25;

    // Start with empty change and greedy pick from table
    let remaining = value - 1; // Must be strictly less than the coin value
    const tempTable = normalizeCoinCounts(currentTableCoins);

    // Take from largest to smallest to maximize value under limit
    if (tempTable.dimes > 0) {
      let take = Math.min(tempTable.dimes, Math.floor(remaining / 10));
      if (take > 0) {
        change.dimes = take;
        remaining -= 10 * take;
      }
    }
    if (tempTable.nickels > 0) {
      let take = Math.min(tempTable.nickels, Math.floor(remaining / 5));
      if (take > 0) {
        change.nickels = take;
        remaining -= 5 * take;
      }
    }
    if (tempTable.pennies > 0) {
      let take = Math.min(tempTable.pennies, remaining);
      if (take > 0) {
        change.pennies = take;
        remaining -= take;
      }
    }

    // Prefer smaller denominations in the change when the table still has the coins to do so:
    // 1 dime → 2 nickels; 1 nickel → 5 pennies. Pool = table after removing greedy change.
    let pool = subtractCoinCounts(tempTable, change);
    while ((change.dimes || 0) > 0 && pool.nickels >= 2) {
      change.dimes = (change.dimes || 0) - 1;
      pool.dimes += 1;
      pool.nickels -= 2;
      change.nickels = (change.nickels || 0) + 2;
    }
    while ((change.nickels || 0) > 0 && pool.pennies >= 5) {
      change.nickels = (change.nickels || 0) - 1;
      pool.nickels += 1;
      pool.pennies -= 5;
      change.pennies = (change.pennies || 0) + 5;
    }

    const totalChange = getValue(change);
    if (totalChange === 0 || totalChange >= value) return "nothing";

    return change;
  }

  export function getValue(coins) {
    if (coins == null || typeof coins !== "object" || Array.isArray(coins)) {
      return 0;
    }
    const p = Math.max(0, Math.floor(Number(coins.pennies) || 0));
    const n = Math.max(0, Math.floor(Number(coins.nickels) || 0));
    const d = Math.max(0, Math.floor(Number(coins.dimes) || 0));
    const q = Math.max(0, Math.floor(Number(coins.quarters) || 0));
    return p + 5 * n + 10 * d + 25 * q;
  }

  /** Cent value of change from the table if you play `coin` (0 if none). */
  export function getChangeValue(coin, tableCoins) {
    if (tableCoins == null || typeof tableCoins !== "object") return 0;
    const ch = getChange(coin, tableCoins);
    if (ch === "nothing" || ch == null) return 0;
    return getValue(ch);
  }

export function greedyAlgorithm(myCoins, tableCoins) {
        let bestCoin = null;
        // Must start below any real gain (e.g. playing a penny is −1). Using −1
        // made `gain > bestValue` false for −1 vs −1, so no move was chosen and we
        // incorrectly defaulted to "penny" even with zero pennies.
        let bestValue = -Infinity;
        if (typeof myCoins !== 'object' || typeof tableCoins !== 'object') {
            return "penny";
        }
      
        const options = [
          { name: "penny", key: "pennies", value: 1 },
          { name: "nickel", key: "nickels", value: 5 },
          { name: "dime", key: "dimes", value: 10 },
          { name: "quarter", key: "quarters", value: 25 }
        ];
      
        for (let option of options) {
          if (myCoins[option.key] > 0) {
            const rawChange = getChange(option.name, tableCoins);
            const gain =
              rawChange === "nothing"
                ? -option.value
                : getValue(rawChange) - option.value;

            if (gain > bestValue) {
              bestValue = gain;
              bestCoin = option.name;
            }
          }
        }
      
        if (bestCoin !== null) return bestCoin;
        for (const option of options) {
          if (myCoins[option.key] > 0) return option.name;
        }
        return "penny";
      }

export function thresholdAlgorithm(myCoins, tableCoins) {
    if (typeof myCoins !== "object" || typeof tableCoins !== "object") {
      return "penny";
    }

    const purse = normalizeCoinCounts(myCoins);
    const pennies = purse.pennies;
    const nickels = purse.nickels;
    const dimes = purse.dimes;
    const quarters = purse.quarters;

    const table = normalizeCoinCounts(tableCoins);
    const vQ = getChangeValue("quarter", table);
    const vD = getChangeValue("dime", table);

    // High thresholds first (original intent).
    if (vQ > 20 && quarters > 0) return "quarter";
    if (vD > 5 && dimes > 0) return "dime";
    // Any legal nickel change (e.g. 1¢ on table) beats dumping a penny.
    if (nickels > 0 && getChange("nickel", table) !== "nothing") return "nickel";

    if (pennies > 0) return "penny";

    // No pennies left: lower thresholds, then any legal larger coin.
    if (vQ > 15 && quarters > 0) return "quarter";
    if (vD > 0 && dimes > 0) return "dime";
    if (nickels > 0) return "nickel";
    if (quarters > 0) return "quarter";
    if (dimes > 0) return "dime";
    return "penny";
}


export function isEmpty(coins) {
    return (
        coins.pennies === 0 &&
        coins.nickels === 0 &&
        coins.dimes === 0 &&
        coins.quarters === 0
    );
}

