module.exports = {
  app: "maze",
  levelFile: "karelLevels",
  levelId: "1_6",
  tests: [
    {
      description: "Top Solve: If Pile { Remove1, Forward }",
      expected: {
        result: true,
        testResult: 100,
      },
      missingBlocks: [],
      xml: '<xml><block type="maze_untilBlockedOrNotClear"><title name="DIR">pilePresent</title><statement name="DO"><block type="maze_dig"><next><block type="maze_moveForward"></block></next></block></statement></block></xml>'
    }
  ]
};
