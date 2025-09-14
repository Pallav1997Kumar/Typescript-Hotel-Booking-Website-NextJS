import { RoomBookingPrice } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


const roomBookingPrice: RoomBookingPrice[] = [
    {
        title: "Deluxe Rooms",
        totalNoOfRooms: 20,
        priceList: [
            {
                day: 'Sunday',
                price: 8000
            },
            {
                day: 'Monday',
                price: 7000
            },
            {
                day: 'Tuesday',
                price: 6000
            },
            {
                day: 'Wednesday',
                price: 6500
            },
            {
                day: 'Thursday',
                price: 6000
            },
            {
                day: 'Friday',
                price: 7000
            },
            {
                day: 'Saturday',
                price: 8000
            }
        ],
    },
    {
        title: "Luxury Rooms",
        totalNoOfRooms: 20,
        priceList: [
            {
                day: 'Sunday',
                price: 10000
            },
            {
                day: 'Monday',
                price: 9000
            },
            {
                day: 'Tuesday',
                price: 8000
            },
            {
                day: 'Wednesday',
                price: 8500
            },
            {
                day: 'Thursday',
                price: 8000
            },
            {
                day: 'Friday',
                price: 9000
            },
            {
                day: 'Saturday',
                price: 10000
            }
        ],
    },
    {
        title: "Premier Rooms",
        totalNoOfRooms: 18,
        priceList: [
            {
                day: 'Sunday',
                price: 12000
            },
            {
                day: 'Monday',
                price: 11000
            },
            {
                day: 'Tuesday',
                price: 10000
            },
            {
                day: 'Wednesday',
                price: 10500
            },
            {
                day: 'Thursday',
                price: 10000
            },
            {
                day: 'Friday',
                price: 11000
            },
            {
                day: 'Saturday',
                price: 12000
            }
        ],
    },
    {
        title: "Premier Plus Rooms",
        totalNoOfRooms: 18,
        priceList: [
            {
                day: 'Sunday',
                price: 13000
            },
            {
                day: 'Monday',
                price: 12000
            },
            {
                day: 'Tuesday',
                price: 11000
            },
            {
                day: 'Wednesday',
                price: 11000
            },
            {
                day: 'Thursday',
                price: 11000
            },
            {
                day: 'Friday',
                price: 12000
            },
            {
                day: 'Saturday',
                price: 13000
            }
        ],
    },
    {
        title: "Oberoi Suites",
        totalNoOfRooms: 15,
        priceList: [
            {
                day: 'Sunday',
                price: 16000
            },
            {
                day: 'Monday',
                price: 15000
            },
            {
                day: 'Tuesday',
                price: 13000
            },
            {
                day: 'Wednesday',
                price: 14000
            },
            {
                day: 'Thursday',
                price: 13000
            },
            {
                day: 'Friday',
                price: 15000
            },
            {
                day: 'Saturday',
                price: 16000
            }
        ],
    },
    {
        title: "Deluxe Suites",
        totalNoOfRooms: 13,
        priceList: [
            {
                day: 'Sunday',
                price: 19000
            },
            {
                day: 'Monday',
                price: 18000
            },
            {
                day: 'Tuesday',
                price: 16000
            },
            {
                day: 'Wednesday',
                price: 17000
            },
            {
                day: 'Thursday',
                price: 16000
            },
            {
                day: 'Friday',
                price: 18000
            },
            {
                day: 'Saturday',
                price: 19000
            }
        ],
    },
    {
        title: "Luxury Suites",
        totalNoOfRooms: 13,
        priceList: [
            {
                day: 'Sunday',
                price: 21000
            },
            {
                day: 'Monday',
                price: 20000
            },
            {
                day: 'Tuesday',
                price: 18000
            },
            {
                day: 'Wednesday',
                price: 19000
            },
            {
                day: 'Thursday',
                price: 18000
            },
            {
                day: 'Friday',
                price: 20000
            },
            {
                day: 'Saturday',
                price: 21000
            }
        ],
    },
    {
        title: "Kohinoor Suites",
        totalNoOfRooms: 10,
        priceList: [
            {
                day: 'Sunday',
                price: 35000
            },
            {
                day: 'Monday',
                price: 33000
            },
            {
                day: 'Tuesday',
                price: 31000
            },
            {
                day: 'Wednesday',
                price: 31000
            },
            {
                day: 'Thursday',
                price: 31000
            },
            {
                day: 'Friday',
                price: 33000
            },
            {
                day: 'Saturday',
                price: 35000
            }
        ],
    },
];


export const noOfDaysBookingPriceAvailableAfterToday: number = 45; 

export default roomBookingPrice;