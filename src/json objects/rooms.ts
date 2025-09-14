//Oberio delhi

import { Room } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


const rooms: Room[] = [

    {
        path: "deluxe-rooms",
        title: "Deluxe Rooms",
        intro: "The perfect choice for business or leisure travellers.",
        description: "Brightly lit, tastefully decorated and comfortably furnished. Deluxe Rooms feature a large picture window that allows abundant natural light to drift in during the day. Lutyens’ style furnishings sit alongside the hotel’s Tree of Life leitmotif, while a king size or twin beds take centre stage.",
        bedType: "King or twin",
        totalRoomSize: "36 square metres",
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "49 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries",
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels"],
        },
        photos: ["/Room Photo/Deluxe Room/Deluxe Room 1.webp", 
                "/Room Photo/Deluxe Room/Deluxe Room Bathroom.webp",
                "/Room Photo/Deluxe Room/3D-Deluxe-Room-with-Bathroom.webp"]
    },
    
    {
        path: "luxury-rooms",
        title: "Luxury Rooms",
        intro: "Elevated for even better views.",
        description: "Situated on the higher floors of our hotel, with a large picture frame window, a mirrored wall and a frosted glass bathroom. Take a break from working at the oak desk to stretch out on the king or twin beds, relax in the armchair or soak in the bathtub.",
        bedType: "King/Twin",
        totalRoomSize: "39 square metres",
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries",
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Television"]
        },
        photos: ["/Room Photo/Luxury Room/Luxury room 1.webp",
                "/Room Photo/Luxury Room/luxury-room-bathroom.webp",
                "/Room Photo/Luxury Room/3D-Luxury-Rooms-with-Bathroom.webp"]
    },
    
    {
        path: "premier-rooms",
        title: "Premier Rooms",
        intro: "Sophisticated design features and beautiful views.",
        description: "Clean lines, a striking colour palette dotted with monochrome touches and Lutyens' inspired furnishings. Premier Rooms are stylish, spacious and imbibe sophistication. From the king size bed and the Italian marble bathroom to the oak writing desk and 24 hour services, these rooms are the ideal choice for business or leisure travellers to the city. A stay in our Premier Room includes daily breakfast and one way airport transfer.",
        bedType: "King Size",
        totalRoomSize: "55 square metres",
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries",
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Mirror Television"]
        },
        photos: ["/Room Photo/Premier Rooms/Premier Room 1.webp",
                "/Room Photo/Premier Rooms/Premier Room Bathroom.webp",
                "/Room Photo/Premier Rooms/3D-Premier-Room-with-Bathroom.webp"]
    },
    
    {
        path: "premier-plus-rooms",
        title: "Premier Plus Rooms",
        intro: "With complimentary access to the Residents’ Lounge.",
        description: "These spacious rooms have been carefully designed with your comfort and convenience in mind. Stretch out on your king size bed, catch up on work at your oak writing desk or call for in room dining and enjoy hand crafted delicacies beside wonderful views. Premier Plus Rooms have the added benefit of complimentary access to the exclusive Residents’ Lounge. A stay in our Premier Plus Room includes daily breakfast and two way airport transfer.",
        bedType: "King Size",
        totalRoomSize: "60 square metres", 
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries", "Twin vanity counter", 
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Mirror Television"]
        },
        photos: ["/Room Photo/Premier Plus Rooms/Premier Plus 1.webp",
                "/Room Photo/Premier Plus Rooms/Premier Plus Bathroom.webp",
                "/Room Photo/Premier Plus Rooms/3D-Premier-Plus-Room-with-Bathroom.webp"]      
    },
    
    {
        path: "oberoi-suites",
        title: "Oberoi Suites",
        intro: "Spacious accommodation with an optional interconnecting room.",
        description: "These beautifully appointed suites make fine use of their generous space. Each features a grand master bedroom, a living area and an optional interconnecting Premier Plus room.  Enjoy a 24 hour butler service and in room dining, Oberoi E'nhance automated room technology and more.",
        bedType: "King Size",
        totalRoomSize: "100 square metres", 
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries", "Twin vanity counter", 
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Mirror Television"]
        },
        photos: ["/Room Photo/The Oberoi Suites/The Oberoi Suite1.webp",
                "/Room Photo/The Oberoi Suites/The Oberoi Suite 2.webp",
                "/Room Photo/The Oberoi Suites/The Oberoi Suite Bathroom.webp",
                "/Room Photo/The Oberoi Suites/3D-Oberoi-Suite-with-Bathroom.webp"]        
    },
    
    {
        path: "deluxe-suites",
        title: "Deluxe Suites",
        intro: "Designed with your utmost comfort in mind.",
        description: "Our thoughtfully planned Deluxe Suites include a living area with a powder room, a balcony, a pantry, a king size bed and an Italian marble bathroom. Lutyen’s style furnishings provide an added touch of grace to a suite where every convenience has been considered, from a 24 hour butler service, in room dining, return airport transfers to the very best technology supplied with our compliments.",
        bedType: "King Size",
        totalRoomSize: "140 square metres", 
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries", "Twin vanity counter", 
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Mirror Television"]
        },
        photos: ["/Room Photo/Deluxe Suites/Deluxe Suite 1.webp",
                "/Room Photo/Deluxe Suites/Deluxe Suite 2.webp",
                "/Room Photo/Deluxe Suites/Deluxe Suite Bathroom.webp",
                "/Room Photo/Deluxe Suites/3D-Deluxe-Suite-with-Bathroom.webp"]       
    },
    
    {
        path: "luxury-suites",
        title: "Luxury Suites",
        intro: "Themed with an Oberoi signature.",
        description: "Luxury abounds in these suites. From the living room and attached powder room, to the master bedroom with its ensuite Italian marble bathroom, the grand dining room and the pantry. For your convenience, there is a 24 hour butler service, 24 hour in room dining and Oberoi E'nhance technology. A number of Luxury Suites also have Victorian or Art Deco theme.",
        bedType: "King Size",
        totalRoomSize: "170 square metres", 
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries", "Twin vanity counter", 
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Mirror Television"]
        },
        photos: ["/Room Photo/Luxury Suites/Luxury Suite 1.webp",
                "/Room Photo/Luxury Suites/Luxury Suite 2.webp",
                "/Room Photo/Luxury Suites/Luxury Suite Bathroom.webp",
                "/Room Photo/Luxury Suites/3D-Luxury-Suite01-with-Bathroom.webp"]     
    },
    
    {
        path: "kohinoor-suites",
        title: "Kohinoor Suites",
        intro: "The jewel in the crown of The Oberoi.",
        description: "No detail has been spared in this lavish and exceptional suite. From the master bedroom with its private sitting area, teak furniture, separate study, therapy room and a personal gym, to the authentic touches of classic Indian fabrics and silk, and all the high tech amenities one could ask for. There are truly few suites anywhere quite like the Kohinoor.",
        bedType: "King Size",
        totalRoomSize: "360 square metres", 
        amenities: {
            room: ["24 hour butler service", "Air conditioning, with temperature control units fitted in the room",
                   "Blackout roller blinds", "12 inch pillow top mattress", "Hypoallergenic goose down pillows and duvets",
                   "Pillow menu features a range to suit every sensitivity, body shape and personal preference", 
                   "Fire rated and sound insulated single leaf room doors with door camera for security and comfort",
                   "Triple glazed thermal insulated windows", "24 hour in room dining", "Fully stocked personal bar",
                   "Selection of daily newspapers", "Next day laundry service", "Nespresso coffee machine", "Tea and Coffee making facilities"],
            technology: ["Electronic safe for valuables", "Complimentary high speed Internet for up to four devices", "Dual telephone lines",
                        "55 inch FHD television", "Wide range of national and international news, sports and film channels",
                        "Integrated lighting system", "Bluetooth enabled speaker system", "Radio alarm clock with iPod connectivity", "Air-conditioning",
                        " iPad interface to control room lights, blinds, air-conditioning, television channels, movies on demand, in room dining and much more"],
            bathroom: ["High pressure shower with multiple settings", "Full length enamel bathtub", "Separate shower & toilet cubicle" , "Toiletries", "Twin vanity counter", 
                       "Self lit magnifying shaving mirrors", "220 volt shaver sockets", "Hair dryer", "100% cotton bathrobes and towels", "Mirror Television"]
        },
        photos: ["/Room Photo/Kohinoor Suite/14_Kohinoor_Living area1.webp",
                "/Room Photo/Kohinoor Suite/15_Kohinoor_Living area2.webp",
                "/Room Photo/Kohinoor Suite/16_Kohinoor SUite_Bedroom.webp",
                "/Room Photo/Kohinoor Suite/17_Kohinoor SUite_Bathroom.webp",
                "/Room Photo/Kohinoor Suite/3D-Kohinoor-Suite-with-Bathroom.webp"]       
    }
];

export default rooms;