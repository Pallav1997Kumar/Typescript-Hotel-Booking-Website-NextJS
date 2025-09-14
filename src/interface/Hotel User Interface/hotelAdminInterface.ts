//API Response for Login the Hotel Admin starts
interface LoginAdminDetails {
    userId: string;
    emailAddress: string;
    fullName: string;
}

export type { LoginAdminDetails };
  
interface ISuccessAdminLoginResponse {
    message: string; // SUCCESSFUL_LOGIN
    loginUserDetails: LoginAdminDetails;
}

interface IErrorAdminLoginResponse {
    errorMessage?: string; // For specific errors like Incorrect Password, Email Does Not Exist
    error?: string; // For internal server errors
}

type AdminLoginResponse = 
    | ISuccessAdminLoginResponse
    | IErrorAdminLoginResponse;

export type { 
    AdminLoginResponse, 
    ISuccessAdminLoginResponse, 
    IErrorAdminLoginResponse 
}
//API Response for Login the Hotel Admin ends



//API Response for Logout of Hotel Admin starts
interface ISuccessAdminLogoutResponse {
    message: string;
}

interface IErrorAdminLogoutResponse {
    message: string;
}

type AdminLogoutResponse = 
    | ISuccessAdminLogoutResponse
    | IErrorAdminLogoutResponse;

export type { 
    ISuccessAdminLogoutResponse, 
    IErrorAdminLogoutResponse, 
    AdminLogoutResponse 
};

//API Response for Logout of Hotel Admin ends
