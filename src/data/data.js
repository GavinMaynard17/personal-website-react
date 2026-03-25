export const skills = [
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-plain.svg',
        name: 'C#'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg',
        name: 'Java'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg',
        name: 'Javascript'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-plain.svg',
        name: 'Svelte'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg',
        name: 'Python'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-plain.svg',
        name: 'Kotlin'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg',
        name: 'HTML'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg',
        name: 'CSS'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
        name: 'MySQL'
    },

    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-plain.svg',
        name: 'SQLite'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-plain.svg',
        name: '.NET'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        name: 'React'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg',
        name: 'Electron'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-plain.svg',
        name: '.NET Core'
    },
    {
        image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
        name: 'Django'
    },
    {
        image: '',
        name: 'XML'
    },
    {
        image: '',
        name: 'XAML'
    }
    // {
    //     image: '',
    //     name: ''
    // },

]

export const projects = [
    {
        key: 0,
        title: 'Personal Website',
        description: '\tThis project is what you are looking at now! I have always wanted a website that was mine, and that I was proud of. This project is me fulfilling that desire. As of right now, the current state of this website is to act as my portfolio, giving anyone who comes across it knowledge on who I am and what I can do. There are still some kinks I need to work out, but the current state has the ability to look at all of my projects, the skills associated with them, the ability to filter projects by skill, and simply provides a little information about me. The last thing I want to fix before I work on new features is the contact page. \n\n\tThis project also gives me an outlet to test my skills, I am always looking to add more features to showcase what I can do. So feel free to check back into this website sometime in the future. There just might be something new.',
        image: '/website.PNG',
        skills: ['Javascript', 'CSS', 'React'],
        link: 'https://github.com/GavinMaynard17/personal-website-react'
    },
    {
        key: 1,
        title: 'Overlay Manager (ALPHA)',
        description: '\tThis is a project I used to introduce myself to WPF .NET applications. The goal of this project was to provide aid to WKU Esports for their livestream production quality. What it does is that it provides an overlay for the broadcasters to use on stream providing valuable information about the occurring match. Depending on the game they play, the overlay will be different in order to fit the in game UI better. The information provided by the overlay includes team names, the team logos, the series length (either best of 1, 3, 5, or 7), and the current series score of each team. While the match is running, the user is also able to control the series score accordingly, which will update automatically. This is an application I intend to someday give a huge overhaul, adding many more features in the process. So for now, this is the "Alpha version"',
        image: '/logo.png',
        skills: ['C#', '.NET', 'XAML', 'CSS'],
        link: 'https://github.com/GavinMaynard17/OverlayManagerALPHA'
    },
    {
        key: 2,
        title: 'Overlay Manager (senior project)',
        description: '\tThis is the predecessor to the Overlay Manager (ALPHA) project. In my senior year, I had a class where we were tasked with creating a project with a team. The project could be anything, and this is the idea we landed on. Rather than using WPF .NET, we used ElectronJS and Svelte, since at the time, those were closer to what we knew. With this being the predecessor, we opted to only focus on one game, which was the game I played, Rocket League. While this project was missing the other games, it actually had features that the WPF version does not have. For example, since we were using Svelte/Javascript, we were able to easily utilize WebSockets to grab the in game data, allowing the Overlay to contain much more information, as well as allowing us to not rely on the in game UI during a game; it was all custom. Another feature we had was the ability to store user statistics from their games. Since we were able to get game data, we set up a server that would control a local database, allowing a user to add/remove players to the database. Then, once a match was over, the user could sort through the data and add it to a player in the database. These are some of the features I would like to add to the WPF version of this project once I get around to it',
        image: '/logo.png',
        skills: ['Svelte', 'Javascript', 'Electron', 'CSS', 'SQLite'],
        link: 'https://github.com/GavinMaynard17/senior-project-final'
    },
    {
        key: 3,
        title: 'Esports Database App',
        description: `\tThis was a class project for a mobile app development class. The idea was that it would be integrated with the Electron version of the Overlay Manger app to allow the broadcaster to look at a player's data on their phone without having to navigate to it through the computer. Or for a player to check out their own stats. Unfortunately I never got started on the integration process, though, as both projects just used local databases. I would say I would only really need to put the database on a cloud service and allow them to both access it. But since these two projects were class projects, I just did what I could to get a decent product done.`,
        image: '/logo.png',
        skills: ['Kotlin', 'XML', 'SQLite'],
        link: ''
    },
    {
        key: 4,
        title: 'Fintech Django Project',
        description: '\tThis was a class project to introduce us to a framework. Specifically, the Django framework. We were tasked with creating a financial website, allowing users to store their financial information such as their investments, their savings, etc. There are not many features to this, and it is in no way pollished. But, it taught me alot about how frameworks work, which is the information that I eventually used to help me form this website!',
        image: '/logo.png',
        skills: ['Python', 'Django', 'HTML', 'CSS', 'SQLite'],
        link: ''
    },
    {
        key: 5,
        title: 'Networking Jeopardy Game',
        description: `\tThis project was a Jeopardy inspired game that would take place in a user terminal. This was another class project, the goal of this class was to learn networking. More specifically, how to use sockets. Up to 4 clients could connect to the server and take turns choosing questions and attempting to answer. If you got the answer correct, you would receive the points. If you got the answer wrong, though, you would loose all of your points. So you had to be careful what questions to choose. You could also play it strategically and rack up some points, and then skip your turn in order to not risk it. My favorite feature is there was one category called "Test Your Luck" which was essentially 6 answers, all the same, and you had to guess which one. This is there for a user's last ditch effort to gain points and win the game. For the lower point values, there is a higher chance to get the correct answer, and the higher up in points you go, the less likely you are to get it correct. Just a fun little addition.`,
        image: '/logo.png',
        skills: ['Java'],
        link: ''
    },
    // {
    //     title: '',
    //     description: '',
    //     image: '',
    //     skills: [],
    //     link: ''
    // }
]

export const apps = [
    {
        key: 0,
        name: 'Bracket Buddy',
        image: '/bracketBuddy.png',
        link: 'bracket-buddy',
        description: 'Simple bracket tool to help you find your favorite thing!',
        progress: 'In development'
    },
    {
        key: 1,
        name: 'Simple Weather',
        image: '/logo.png',
        link: 'simple-weather',
        description: "Simple weather app, showing you the weather in Gavin's hometown!",
        progress: 'Planned'
    },
    {
        key: 2,
        name: 'Password Pal',
        image: '/logo.png',
        link: 'password-pal',
        description: 'A tool to help you generate a nice, safe password. No matter the requirements!',
        progress: 'Planned'
    },
    {
        key: 3,
        name: 'Rocket League Comparison',
        image: '/logo.png',
        link: 'rl-comparision',
        description: 'Compare your Rocket League stats to mine to find out who the better player is!',
        progress: 'Planned'
    },
    // {
    //     key: ,
    //     name: '',
    //     link: '',
    //     description: '',
    //     progress: ''
    // },
]

export const images = [
    '/me.JPG',
    '/grad.JPG',
    '/esportscopy.png'
];

export const participantFrom = [
    {
        participant1From: 3,
        participant2From: 2
    },//1
    {
        participant1From: 5,
        participant2From: 4
    },//2
    {
        participant1From: 7,
        participant2From: 6
    },//3
    {
        participant1From: 9,
        participant2From: 8
    },//4
    {
        participant1From: 11,
        participant2From: 10
    },//5
    {
        participant1From: 13,
        participant2From: 12
    },//6
    {
        participant1From: 15,
        participant2From: 14
    },//7
    {
        participant1From: 17,
        participant2From: 16
    },//8
    {
        participant1From: 19,
        participant2From: 18
    },//9
    {
        participant1From: 21,
        participant2From: 20
    },//10
    {
        participant1From: 23,
        participant2From: 22
    },//11
    {
        participant1From: 25,
        participant2From: 24
    },//12
    {
        participant1From: 27,
        participant2From: 26
    },//13
    {
        participant1From: 29,
        participant2From: 28
    },//14
    {
        participant1From: 31,
        participant2From: 30
    },//15
]