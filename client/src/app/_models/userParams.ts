import { User } from "./user";

export class UserParams {
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    orderBy = "lastActive";
    gender: string;

    constructor(user: User) {
        this.gender = user.gender === "male" ? "female" : "male";
    }
}