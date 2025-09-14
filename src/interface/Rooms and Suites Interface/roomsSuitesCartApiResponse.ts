import { IRoomsSuitesCartInfo } from "./roomsSuitesDbModelsInterface";


interface IRoomsSuitesCartInformation extends IRoomsSuitesCartInfo{
    _id: string;
}

export type { IRoomsSuitesCartInformation };


//API Response For View Rooms Suites Cart By UserId starts
interface IViewRoomsSuitesCartByUserIdSuccessApiResponse {
    message: string;
    roomSuiteCartInfo: IRoomsSuitesCartInformation[];
}

interface IViewRoomsSuitesCartByUserIdErrorApiResponse {
    errorMessage: string;  
}

type ViewRoomsSuitesCartByUserIdApiResponse = 
    | IViewRoomsSuitesCartByUserIdSuccessApiResponse
    | IViewRoomsSuitesCartByUserIdErrorApiResponse;

export type { 
    IViewRoomsSuitesCartByUserIdSuccessApiResponse, 
    IViewRoomsSuitesCartByUserIdErrorApiResponse, 
    ViewRoomsSuitesCartByUserIdApiResponse 
};

//API Response For View Rooms Suites Cart By UserId ends



//API Response For Delete Rooms Suites Cart By CartId starts
interface IDeleteRoomsSuitesCartByCartIdErrorApiResponse {
    errorMessage: string;
}

interface IDeleteRoomsSuitesCartByCartIdSuccessApiResponse {
    message: string;
}

type DeleteRoomsSuitesCartByCartIdApiResponse = 
    | IDeleteRoomsSuitesCartByCartIdErrorApiResponse
    | IDeleteRoomsSuitesCartByCartIdSuccessApiResponse;

export type { 
    IDeleteRoomsSuitesCartByCartIdErrorApiResponse, 
    IDeleteRoomsSuitesCartByCartIdSuccessApiResponse, 
    DeleteRoomsSuitesCartByCartIdApiResponse 
};

//API Response For Delete Rooms Suites Cart By CartId ends



//API Response For View Rooms Suites Cart By CartId starts
interface IViewRoomsSuitesCartByCartIdSuccessApiResponse {
    cartInfo: IRoomsSuitesCartInformation;
}

interface IViewRoomsSuitesCartByCartIdErrorApiResponse {
    errorMessage: string;  
}

type ViewRoomsSuitesCartByCartIdApiResponse = 
    | IViewRoomsSuitesCartByCartIdSuccessApiResponse
    | IViewRoomsSuitesCartByCartIdErrorApiResponse;

export type { 
    IViewRoomsSuitesCartByCartIdSuccessApiResponse, 
    IViewRoomsSuitesCartByCartIdErrorApiResponse, 
    ViewRoomsSuitesCartByCartIdApiResponse 
};

//API Response For View Rooms Suites Cart By CartId ends



//API Response for Adding Rooms Suites to Cart starts
interface IAddRoomsSuitesToCartSuccessApiResponse{
    message: string;
}

interface IAddRoomsSuitesToCartErrorApiResponse{
    errorMessage: string;
}

type AddRoomsSuitesToCartApiResponse = 
    | IAddRoomsSuitesToCartSuccessApiResponse
    | IAddRoomsSuitesToCartErrorApiResponse;

export type { 
    IAddRoomsSuitesToCartSuccessApiResponse, 
    IAddRoomsSuitesToCartErrorApiResponse, 
    AddRoomsSuitesToCartApiResponse 
};

//API Response for Adding Rooms Suites to Cart ends