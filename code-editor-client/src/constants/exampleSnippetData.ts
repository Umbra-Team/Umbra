export interface ExampleSnippet {
  id: number,
  title: string,
  code: string,
  language: string,
}

export const examples: ExampleSnippet[] = [
  {
    id: 1,
    title: "Welcome",
    code: `console.log("Welcome to Umbra, ye olde real-time collaborative code sharing app")`,
    language: "js",
  },
  {
    id: 2,
    title: "Coin Change",
    code: `package main

import (
  "sort"
  "fmt"
)

func change(amount int, coins []int) int {
  sort.Ints(coins)
  dp := make([][]int, amount+1)

  zeroRow := make([]int, len(coins))
  for i := 0; i < len(coins); i++ {
    zeroRow[i] = 1
  }
  dp[0] = zeroRow

  var i int
  for i = 1; i <= amount; i++ {
    thisRow := make([]int, len(coins))
    for ci, cd := range coins {
      if ci >= 1 {
        thisRow[ci] = thisRow[ci-1]
      }
      if i >= cd {
        thisRow[ci] += dp[i-cd][ci]
      }
    }
    dp[i] = thisRow
  }

  return dp[amount][len(coins)-1]
}

func main() {
  fmt.Println(change(5, []int{1, 2, 5}))
}`, 
    language: "go",
  },
  {
    id: 3,
    title: "Two Sum",
    code:
`def twoSum(numbers: list[int], target: int) -> list[int]:
  for i, n in enumerate(numbers):
    complement = target - n
    if complement in numbers[i+1:]:
        return [i+1, numbers.index(complement, i+1) + 1]

print(twoSum([2, 7, 11, 15], 9))`,
    language: "py",
  },
]

