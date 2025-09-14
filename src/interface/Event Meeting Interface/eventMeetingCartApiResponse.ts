import { IContinousMultipleDatesCartInfo, INonContinousMultipleDatesCartInfo, ISingleDateCartInfo } from "./eventMeetingDbModelInterface";


interface IEventMeetingRoomSingleDateCartInformation extends ISingleDateCartInfo {
    _id: string;
}

interface IEventMeetingRoomNonContinousMultipleDatesCartInformation extends INonContinousMultipleDatesCartInfo {
    _id: string;
}

interface IEventMeetingRoomContinousMultipleDatesCartInformation extends IContinousMultipleDatesCartInfo {
    _id: string;
}

export type { 
    IEventMeetingRoomSingleDateCartInformation, 
    IEventMeetingRoomNonContinousMultipleDatesCartInformation, 
    IEventMeetingRoomContinousMultipleDatesCartInformation 
};


//API Response For View Event Meeting Room Cart By UserId starts
interface IViewEventMeetingRoomCartByUserIdSuccessApiResponse {
    message: string;
    eventMeetingCartInfo?: (
        IEventMeetingRoomSingleDateCartInformation 
        | IEventMeetingRoomNonContinousMultipleDatesCartInformation 
        | IEventMeetingRoomContinousMultipleDatesCartInformation
    )[];
}

interface IViewEventMeetingRoomCartByUserIdErrorApiResponse {
    errorMessage: string; 
}

type ViewEventMeetingRoomCartByUserIdApiResponse = 
    | IViewEventMeetingRoomCartByUserIdSuccessApiResponse
    | IViewEventMeetingRoomCartByUserIdErrorApiResponse;

export type { 
    IViewEventMeetingRoomCartByUserIdSuccessApiResponse, 
    IViewEventMeetingRoomCartByUserIdErrorApiResponse,
    ViewEventMeetingRoomCartByUserIdApiResponse 
};

//API Response For View Event Meeting Room Cart By UserId ends


//API Response For View Event Meeting Room Cart By CartId starts
interface IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse {
    cartInfo: IEventMeetingRoomSingleDateCartInformation;
}

interface IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse {
    cartInfo: IEventMeetingRoomContinousMultipleDatesCartInformation;
}

interface IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse {
    cartInfo: IEventMeetingRoomNonContinousMultipleDatesCartInformation;
}

export type { 
    IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse, 
    IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, 
    IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
};


interface IViewEventMeetingRoomCartByCartIdErrorApiResponse {
    errorMessage: string;
}

export type { IViewEventMeetingRoomCartByCartIdErrorApiResponse };


type ViewSingleDateEventMeetingRoomCartByCartIdApiResponse = 
    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse
    | IViewEventMeetingRoomCartByCartIdErrorApiResponse;

type ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse = 
    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
    | IViewEventMeetingRoomCartByCartIdErrorApiResponse;

type ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse = 
    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
    | IViewEventMeetingRoomCartByCartIdErrorApiResponse;

export type { 
    ViewSingleDateEventMeetingRoomCartByCartIdApiResponse, 
    ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse, 
    ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse 
};

//API Response For View Event Meeting Room Cart By CartId ends



//API Response For Delete Event Meeting Room Cart By CartId starts
interface IDeleteEventMeetingCartByCartIdErrorApiResponse {
    errorMessage: string;
}

interface IDeleteEventMeetingCartByCartIdSuccessApiResponse {
    errorMessage: string;
}

type DeleteEventMeetingCartByCartIdApiResponse = 
    | IDeleteEventMeetingCartByCartIdErrorApiResponse
    | IDeleteEventMeetingCartByCartIdSuccessApiResponse;

export type { 
    IDeleteEventMeetingCartByCartIdErrorApiResponse, 
    IDeleteEventMeetingCartByCartIdSuccessApiResponse, 
    DeleteEventMeetingCartByCartIdApiResponse 
};

//API Response For Delete Event Meeting Room Cart By CartId ends



//API Response for Adding Event Meeting Room Information To Cart starts
interface IAddEventMeetingRoomCartSuccessApiResponse {
    message: string;  
}

interface IAddEventMeetingRoomCartErrorApiResponse {
    errorMessage: string;  
}

type AddEventMeetingRoomCartApiResponse = 
    | IAddEventMeetingRoomCartSuccessApiResponse
    | IAddEventMeetingRoomCartErrorApiResponse;

export type { IAddEventMeetingRoomCartSuccessApiResponse, 
    IAddEventMeetingRoomCartErrorApiResponse,
    AddEventMeetingRoomCartApiResponse 
};

//API Response for Adding Event Meeting Room Information To Cart ends