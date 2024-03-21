import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "../users/users.schema";


@Injectable()
export class AuthorizationService {

    constructor(
        ) {
    
        }
    
        public validateUserRole(user) {
            if (user.role !== UserRole.USER) {
                
                throw new NotFoundException('You are to Authorize to acces this Api. This Api aceesible for user only');
            }
        }
        public validateAdminRole(user) {
            if (user.role !== UserRole.ADMIN) {
    
                throw new NotFoundException('You are to Authorize to acces this Api. This Api aceesible for Admin only');
            }
        }
}