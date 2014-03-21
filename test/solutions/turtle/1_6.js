module.exports = {
  app: "turtle",
  levelFile: "levels",
  levelId: "1_6",
  tests: [
    {
      description: "Top solve: 3x {Forward 100, Right 120}, 4x {Left 90, Forward 100}",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="controls_repeat"><title name="TIMES">3</title><statement name="DO"><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">120</title></block></next></block></statement><next><block type="controls_repeat"><title name="TIMES">4</title><statement name="DO"><block type="draw_turn_by_constant_restricted"><title name="DIR">turnLeft</title><title name="VALUE">90</title><next><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title></block></next></block></statement></block></next></block></xml>'
    },
    {
      description: "Top failure: 3x {Forward, Right 120}",
      expected: {
        result: false,
        testResult: 2
      },
      missingBlocks: [],
      xml: '<xml><block type="controls_repeat"><title name="TIMES">3</title><statement name="DO"><block type="draw_move_by_constant"><title name="DIR">moveForward</title><title name="VALUE">100</title><next><block type="draw_turn_by_constant_restricted"><title name="DIR">turnRight</title><title name="VALUE">120</title></block></next></block></statement></block></xml>'
    }

  ]
};