let gameStatus = [
    {
        id: 0,
        players: [
            {
                name: "",
                side: "",
                x: 0,
                y: 0,
                alive: true,
                modeWarrior: false,
                sphereGrabbed: false,
                king: false,
            }
        ],
        demonTeam: {
            kills: 0,
            containersFilled: 0,
        },
        angelTeam: {
            kills: 0,
            containersFilled: 0,
        },
        map: "",
    }
]

let rooms = [
    {
        id: 1,
        name: "Hello World",
        host: "",
        players: [],
        angelTeam: [],
        demonTeam: [],
        gameStarted: false,
        settings: {
            "map": "forest"
        },
        messages: [{sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "jesus", message: "hello Jesus", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        ]
    }
];