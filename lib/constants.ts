
export type EventType = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    type: "Online" | "Offline";
    audience: "Everyone" | "Developers" | "Designers";
};

export const events: EventType[] = [
    {
        id: "1",
        title: "Web Development Workshop",
        description:
            "Join our hands-on workshop to learn the latest in web development.",
        date: "2024-08-15",
        time: "10:00 AM",
        location: "Online",
        image: "/images/event1.png",
        type: "Online",
        audience: "Developers",
    },
    {
        id: "2",
        title: "Design Thinking Conference",
        description:
            "A conference for designers to explore new ideas and techniques.",
        date: "2024-09-10",
        time: "9:00 AM",
        location: "New York, NY",
        image: "/images/event2.png",
        type: "Offline",
        audience: "Designers",
    },
    {
        id: "3",
        title: "Introduction to React Native",
        description: "Learn how to build mobile apps with React Native.",
        date: "2024-09-20",
        time: "1:00 PM",
        location: "Online",
        image: "/images/event3.png",
        type: "Online",
        audience: "Developers",
    },
    {
        id: "4",
        title: "Data Science Summit",
        description:
            "An event for data scientists to discuss the latest trends and research.",
        date: "2024-10-05",
        time: "11:00 AM",
        location: "San Francisco, CA",
        image: "/images/event4.png",
        type: "Offline",
        audience: "Developers",
    },
    {
        id: "5",
        title: "UI/UX Design Meetup",
        description: "A casual meetup for designers to network and share their work.",
        date: "2024-10-18",
        time: "6:00 PM",
        location: "Online",
        image: "/images/event5.png",
        type: "Online",
        audience: "Designers",
    },
    {
        id: "6",
        title: "Tech Conference 2024",
        description:
            "The biggest tech conference of the year, covering a wide range of topics.",
        date: "2024-11-12",
        time: "8:00 AM",
        location: "Austin, TX",
        image: "/images/event6.png",
        type: "Offline",
        audience: "Everyone",
    },
    {
        id: "7",
        title: "Design Thinking Conference",
        description:
            "A conference for designers to explore new ideas and techniques.",
        date: "2024-09-10",
        time: "9:00 AM",
        location: "New York, NY",
        image: "/images/event2.png",
        type: "Offline",
        audience: "Designers",
    },
    {
        id: "8",
        title: "Introduction to React Native",
        description: "Learn how to build mobile apps with React Native.",
        date: "2024-09-20",
        time: "1:00 PM",
        location: "Online",
        image: "/images/event3.png",
        type: "Online",
        audience: "Developers",
    },
];
