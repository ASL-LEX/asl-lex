sigma_data = {
  nodes:
  [
    {
      id: "n0",
      label: "A node",
      x: 0,
      y: 0,
      size: 2,
      color: "#77bdee",
      eventsEnabled: false
    },
    {
      id: "n1",
      label: "Another node",
      x: 3,
      y: 1,
      size: 2
    },
    {
      id: "n2",
      label: "And a last one",
      x: 1,
      y: 3,
      size: 2
    }
  ],
  edges: [
    {
      id: "e0",
      source: "n0",
      target: "n1"
    },
    {
      id: "e1",
      source: "n1",
      target: "n2"
    },
    {
      id: "e2",
      source: "n2",
      target: "n0"
    }
  ]
}

