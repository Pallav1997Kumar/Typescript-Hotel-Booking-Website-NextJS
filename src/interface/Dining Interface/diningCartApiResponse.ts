import { IDiningCartInfo } from "./diningDatabaseModelsInterface";


interface IDiningCartInformation extends IDiningCartInfo{
    _id: string;
}

export type { IDiningCartInformation };



//API Response For View Dining Cart By UserId starts
interface IViewDiningCartByUserIdSuccessApiResponse {
    message: string;
    diningCartInfo?: IDiningCartInformation[];
}

interface IViewDiningCartByUserIdErrorApiResponse {
    errorMessage: string;  
}

type ViewDiningCartByUserIdApiResponse = 
    | IViewDiningCartByUserIdSuccessApiResponse
    | IViewDiningCartByUserIdErrorApiResponse;

export type { 
    IViewDiningCartByUserIdSuccessApiResponse, 
    IViewDiningCartByUserIdErrorApiResponse, 
    ViewDiningCartByUserIdApiResponse 
};

//API Response For View Dining Cart By UserId ends



//API Response For Delete Dining Cart By CartId starts
interface IDeleteDiningCartByCartIdErrorApiResponse {
    errorMessage: string;
}

interface IDeleteDiningCartByCartIdSuccessApiResponse {
    message: string;
}

type DeleteDiningCartByCartIdApiResponse = 
    | IDeleteDiningCartByCartIdErrorApiResponse
    | IDeleteDiningCartByCartIdSuccessApiResponse;

export type { 
    IDeleteDiningCartByCartIdErrorApiResponse, 
    IDeleteDiningCartByCartIdSuccessApiResponse, 
    DeleteDiningCartByCartIdApiResponse 
};

//API Response For Delete Dining Cart By CartId ends



//API Response For View Dining Cart By CartId starts
interface IViewDiningCartByCartIdSuccessApiResponse {
    cartInfo: IDiningCartInformation;
}

interface IViewDiningCartByCartIdErrorApiResponse {
    errorMessage: string;  
}

type ViewDiningCartByCartIdApiResponse = 
    | IViewDiningCartByCartIdSuccessApiResponse
    | IViewDiningCartByCartIdErrorApiResponse;

export type { 
    IViewDiningCartByCartIdSuccessApiResponse, 
    IViewDiningCartByCartIdErrorApiResponse, 
    ViewDiningCartByCartIdApiResponse 
};

//API Response For View Dining Cart By CartId ends



//API Response for Adding Dining Information To Cart starts
interface IAddDiningCartSuccessApiResponse {
    message: string;  
}

interface IAddDiningCartErrorApiResponse {
    errorMessage: string;  
}

type AddDiningCartApiResponse = 
    | IAddDiningCartSuccessApiResponse
    | IAddDiningCartErrorApiResponse;

export type { 
    IAddDiningCartSuccessApiResponse, 
    IAddDiningCartErrorApiResponse, 
    AddDiningCartApiResponse 
};

//API Response for Adding Dining Information To Cart ends