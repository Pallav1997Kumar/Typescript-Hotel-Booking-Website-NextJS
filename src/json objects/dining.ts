//Kolkata taj

import { Dining } from "@/interface/Dining Interface/hotelDiningInterface";

const dining: Dining[] = [
    {
        diningAreaTitle: "Cal 27",
        diningPath: "cal-27-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "The ‘Best All Day Dining Restaurant of Kolkata’ has the perfect combination of food and ambience.",
        diningDescription: "Cal 27 Taj Bengal is famous for its lavish Sunday brunches with champagne, global menu and relaxed poolside ambience. The best all-day-dining restaurant in Kolkata specialises in Italian cuisine with a wine list to match. We are the perfect place whether for a quick snack or a leisurely meal.",
        cuisine: ["Multi-cuisine"],
        timing: [
            {
                foodCategory: "breakfast",
                foodTiming: "7:00hrs - 9:30hrs",
                foodSlotTime: ["7:00hrs-7:40hrs", "7:40hrs-8:20hrs", "8:20hrs-9:00hrs", "9:00hrs-9:30hrs"]
            },
            {
                foodCategory: "lunch",
                foodTiming: "12:30hrs - 15:30hrs",
                foodSlotTime: ["12:30hrs-13:30hrs", "13:30hrs-14:30hrs", "14:30hrs-15:30hrs"]
            },
            {
                foodCategory: "dinner",
                foodTiming: "19:30hrs - 23:30hrs",
                foodSlotTime: ["19:30hrs-20:30hrs", "20:30hrs-21:30hrs", "21:30hrs-22:30hrs", "22:30hrs-23:30hrs"]
            }
        ],
        photo: "/Dining/cal-27.jpeg"
    },
    {
        diningAreaTitle: "Sonargaon",
        diningPath: "sonargaon-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "Celebrate the rich diversity and full flavours of Indian cuisine at this spectacular restaurant.",
        diningDescription: "The ‘zamindari’ or landlord culinary culture of India bears influences of the Raj, Islamic cuisine and the effects of Partition. Our fine-dining restaurant at Taj Bengal, Sonargaon brings the best of this cuisine to Kolkata. Cobbled floors, mud walls, show kitchen and lilting traditional music help you experience true Indian cuisine and hospitality.",
        cuisine: ["Bengali", "North-West India", "Punjabi"],
        timing: [
            {
                foodCategory: "breakfast",
                foodTiming: "7:00hrs - 9:30hrs",
                foodSlotTime: ["7:00hrs-7:40hrs", "7:40hrs-8:20hrs", "8:20hrs-9:00hrs", "9:00hrs-9:30hrs"]
            },
            {
                foodCategory: "lunch",
                foodTiming: "12:30hrs - 15:30hrs",
                foodSlotTime: ["12:30hrs-13:30hrs", "13:30hrs-14:30hrs", "14:30hrs-15:30hrs"]
            },
            {
                foodCategory: "dinner",
                foodTiming: "19:30hrs - 23:30hrs",
                foodSlotTime: ["19:30hrs-20:30hrs", "20:30hrs-21:30hrs", "21:30hrs-22:30hrs", "22:30hrs-23:30hrs"]
            }
        ],
        photo: "/Dining/Sonargaon.jpeg"
    },
    {
        diningAreaTitle: "Chinoiserie",
        diningPath: "chinoiserie-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "We invite you to explore the authentic flavours of Sichuan and Canton at this fine-dining Chinese restaurant.",
        diningDescription: "The legendary Chinoiserie at Taj Bengal is the best Chinese fine-dining restaurant in Kolkata, with a delectable spread of dishes from Sichuan and Canton. The subtle flavours and aesthetic Oriental décor, including a grand pagoda, make for memorable meals every time.",
        cuisine: ["Chinese"],
        timing: [
            {
                foodCategory: "breakfast",
                foodTiming: "7:00hrs - 9:30hrs",
                foodSlotTime: ["7:00hrs-7:40hrs", "7:40hrs-8:20hrs", "8:20hrs-9:00hrs", "9:00hrs-9:30hrs"]
            },
            {
                foodCategory: "lunch",
                foodTiming: "12:30hrs - 15:30hrs",
                foodSlotTime: ["12:30hrs-13:30hrs", "13:30hrs-14:30hrs", "14:30hrs-15:30hrs"]
            },
            {
                foodCategory: "dinner",
                foodTiming: "19:30hrs - 23:30hrs",
                foodSlotTime: ["19:30hrs-20:30hrs", "20:30hrs-21:30hrs", "21:30hrs-22:30hrs", "22:30hrs-23:30hrs"]
            }
        ],
        photo: "/Dining/Chinoiserie.jpeg"
    },
    {
        diningAreaTitle: "Souk",
        diningPath: "souk-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "A range of Mediterranean and Middle Eastern culinary delights awaits you at this award-winning restaurant.",
        diningDescription: "Souk at Taj Bengal is famous for delectable Mediterranean and Middle Eastern fare. True to its name, it offers a medley of flavours from Moroccan, Greek, Turkish, Egyptian and Arabic cuisines. With contemporary décor and a theatrical kitchen, and the romantic Casablanca and the Chef Studio for special occasions, the restaurant is a treat for all your senses",
        cuisine: ["Mediterranean", "Middle Eastern"],
        timing: [
            {
                foodCategory: "dinner",
                foodTiming: "19:30hrs - 23:30hrs",
                foodSlotTime: ["19:30hrs-20:30hrs", "20:30hrs-21:30hrs", "21:30hrs-22:30hrs", "22:30hrs-23:30hrs"]
            }
        ],
        photo: "/Dining/Souk.jpeg"
    },
    {
        diningAreaTitle: "The Junction",
        diningPath: "the-junction-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "This railway-themed bar has a live band and offers the finest collection of liquor and liqueurs for true connoisseurs.",
        diningDescription: "Let your hair down at The Junction, the unique and ambient railway-themed bar at Taj Bengal. Raise a toast to the good times with some of the world's finest cocktails, wines and spirits. From exceptional single malts to smooth liqueurs, our collection here is designed to appeal to connoisseurs.",
        cuisine: ["Finger food"],
        timing: [
            {
                foodCategory: "dinner",
                foodTiming: "18:00hrs - 01:00hrs",
                foodSlotTime: ["18:00hrs-19:00hrs", "19:00hrs-20:00hrs", "20:00hrs-21:00hrs", "21:00hrs-22:00hrs", "22:00hrs-23:00hrs", "23:00hrs-24:00hrs", "0:00hrs-01:00hrs"]
            }
        ],
        photo: "/Dining/The Junction.jpeg"
    },
    {
        diningAreaTitle: "Grill By The Pool",
        diningPath: "grill-by-the-pool-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "Enjoy our scrumptious grills and cuts accompanied by soft music in a romantic setting by the pool.",
        diningDescription: "Grill by the Pool at Taj Bengal comes alive between November and February, when you enjoy the freshest seafood and meats grilled to perfection, and served with accoutrements beside our tranquil blue pool. Live music adds to the elegant ambience of this intimate and romantic space.",
        cuisine: ["Grill", "Barbeque"],
        timing: [
            {
                foodCategory: "dinner",
                foodTiming: "19:30hrs - 23:30hrs",
                foodSlotTime: ["19:30hrs-20:30hrs", "20:30hrs-21:30hrs", "21:30hrs-22:30hrs", "22:30hrs-23:30hrs"]
            }
        ],
        photo: "/Dining/Grill By The Pool.jpeg"
    },
    {
        diningAreaTitle: "The Promenade Lounge",
        diningPath: "the-promenade-lounge-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "In addition to the light fare at the lounge, you enjoy artworks by young city artists who sometimes paint live.",
        diningDescription: "The Promenade Lounge, adorned with fine artworks of promising young artists, offers a fine collection of teas, coffees, sandwiches and entrées. Enjoy the famous English High Tea while watching, if lucky, a visiting artist at work. Unwind to live classical music with cognacs and chocolates later in the day.",
        cuisine: ["Finger food"],
        timing: [
            {
                foodCategory: "general",
                foodTiming: "8:00hrs - 22:00hrs",
                foodSlotTime: ["8:00hrs - 9:00hrs", "9:00hrs - 10:00hrs", "10:00hrs - 11:00hrs", "11:00hrs - 12:00hrs", "12:00hrs - 13:00hrs", "13:00hrs - 14:00hrs", "14:00hrs - 15:00hrs", "15:00hrs - 16:00hrs", "16:00hrs - 17:00hrs", "17:00hrs - 18:00hrs", "18:00hrs - 19:00hrs", "19:00hrs - 20:00hrs", "20:00hrs - 21:00hrs", "21:00hrs - 22:00hrs"]
            }
        ],
        photo: "/Dining/The Promenade Lounge.jpeg"
    },
    {
        diningAreaTitle: "La Patisserie And Deli",
        diningPath: "La-patisserie-and-deli-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "La Patisserie serves a selection of fresh pastries and breads as well as customised desserts if ordered in advance.",
        diningDescription: "La Patisserie and Deli at Taj Bengal offers a wide spread of pastries and breads, along with unique delicatessen products from the world over. The bakery is the city’s go-to for customised cakes, bakes and desserts to match your celebrations.",
        cuisine: ["Bakery & Delicatessen"],
        timing: [
            {
                foodCategory: "general",
                foodTiming: "8:00hrs - 22:00hrs",
                foodSlotTime: ["8:00hrs - 9:00hrs", "9:00hrs - 10:00hrs", "10:00hrs - 11:00hrs", "11:00hrs - 12:00hrs", "12:00hrs - 13:00hrs", "13:00hrs - 14:00hrs", "14:00hrs - 15:00hrs", "15:00hrs - 16:00hrs", "16:00hrs - 17:00hrs", "17:00hrs - 18:00hrs", "18:00hrs - 19:00hrs", "19:00hrs - 20:00hrs", "20:00hrs - 21:00hrs", "21:00hrs - 22:00hrs"]
            }
        ],
        photo: "/Dining/La Patisserie And Deli.jpeg"
    },
    {
        diningAreaTitle: "The Chambers",
        diningPath: "the-chambers-restaurant",
        contactNo: "+91-33-66123939",
        shortDescription: "This exclusive club reserved for members and hotel residents above 21 has a fine Western menu.",
        diningDescription: "With spectacular views of the Kolkata skyline, The Chambers at Taj Bengal is one of Kolkata’s best fine-dining experiences, serving refined Continental and European cuisine. Enjoy the restful ambience and dramatic views of this exclusive club reserved for members and hotel residents above 21.",
        cuisine: ["European", "Continental"],
        timing: [
            {
                foodCategory: "breakfast",
                foodTiming: "7:00hrs - 9:30hrs",
                foodSlotTime: ["7:00hrs-7:40hrs", "7:40hrs-8:20hrs", "8:20hrs-9:00hrs", "9:00hrs-9:30hrs"]
            },
            {
                foodCategory: "lunch",
                foodTiming: "12:30hrs - 15:30hrs",
                foodSlotTime: ["12:30hrs-13:30hrs", "13:30hrs-14:30hrs", "14:30hrs-15:30hrs"]
            },
            {
                foodCategory: "dinner",
                foodTiming: "19:30hrs - 23:30hrs",
                foodSlotTime: ["19:30hrs-20:30hrs", "20:30hrs-21:30hrs", "21:30hrs-22:30hrs", "22:30hrs-23:30hrs"]
            }
        ],
        photo: "/Dining/The Chambers.jpeg"
    },
];

export default dining;