
class ApiResponse{
    message:string
    results?:any
    statusCode:number
    success:boolean
    constructor(message:string,statusCode:number,data?:any){
        this.message = message
        this.results = data
        this.statusCode = statusCode
        this.success = statusCode >=200 && statusCode < 300
    }
}