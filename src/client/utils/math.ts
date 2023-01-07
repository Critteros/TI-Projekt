export const k_combinations = <T>(items: T[], k: number): T[][] => {
  let i, j, combs, head, tailcombs;

  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > items.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k == items.length) {
    return [items];
  }

  // There is N 1-sized subsets in a N-sized set.
  if (k == 1) {
    combs = [];
    for (i = 0; i < items.length; i++) {
      combs.push([items[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < items.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = items.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = k_combinations(items.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
};

export const calculateDistance = <T extends { x: number; y: number }>(
  first: T,
  second: T,
): number => {
  const differenceX = first.x - second.x;
  const differenceY = first.y - second.y;
  return Math.sqrt(differenceX * differenceX + differenceY * differenceY);
};
