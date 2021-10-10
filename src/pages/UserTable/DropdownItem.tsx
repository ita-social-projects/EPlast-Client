import { AdminRole } from "../../models/Roles/AdminRole";
import { DropdownFunc } from "../../models/UserTable/DropdownFunc";
import { NonAdminRole } from "../../models/Roles/NonAdminRole";

//Enum to check place's id equality and check 
//if user has appropriate rights
enum Place {
  Region  = 0,   //Округа
  City    = 1,    //Станиця
  Club    = 2,    //Курінь
  All     = 3,    //Всі можливі з перерахованих вище пунктів
  None    = 4,    //Не важливий жоден
}

//Basic builder for set of dropdown items, can be extended to pattern 'Builder'
export class DropdownItemBuilder {

  public build(): IDropdownItem {
    const checkProfileItem: CheckUserProfileItem = new CheckUserProfileItem(); 
    const deleteItem: DeleteUserItem = new DeleteUserItem();
    const editRegionItem: EditUserRegionItem = new EditUserRegionItem();
    const editCityItem: EditUserCityItem = new EditUserCityItem();
    const editClubItem: EditUserClubItem = new EditUserClubItem();
    const editUserRole: EditUserRoleHandler = new EditUserRoleHandler();
    const addDegreeeItem: AddUserDegreeItem = new AddUserDegreeItem();

    //common CoR for all items in dropdown, can be rebuilded if needed
    const checkerBuilder: CheckBuilder = new CheckBuilder(); 
    DropdownItem.setChecker(checkerBuilder.build());

    checkProfileItem.setNext(deleteItem).setNext(editClubItem).setNext(editCityItem)
      .setNext(editRegionItem).setNext(editUserRole).setNext(addDegreeeItem);

    return checkProfileItem;
  }
}

export interface IDropdownItem {

  setNext(item: IDropdownItem): IDropdownItem;

  handle(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any,
        selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void;

  getHandlersResults(): Map<DropdownFunc, any>;
}

abstract class DropdownItem implements IDropdownItem {

  static handlersResults: Map<DropdownFunc, any>;     //is static to prevent extra memory consumption
  static checker: ICheck;                             //same reason
  
  private nextHandler: IDropdownItem | null;
    
  constructor() {
    this.nextHandler = null;   
    DropdownItem.handlersResults = new Map<DropdownFunc, any>();
  }

  static setChecker(newChecker: ICheck): void {
    DropdownItem.checker = newChecker;
  }

  public getHandlersResults(): Map<DropdownFunc, any> {
    return DropdownItem.handlersResults;
  }

  public setNext(handler: IDropdownItem): IDropdownItem {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public handle(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    return this.nextHandler?.handle(currentUser, currentUserRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }

  protected selectedUserNonAdminRolesForAddAndEdit(selectedUserNonAdminRoles: Array<NonAdminRole>): boolean {
    return selectedUserNonAdminRoles.includes(NonAdminRole.PlastMember || NonAdminRole.Supporter);        
  }
}

class CheckUserProfileItem extends DropdownItem {

  public handle(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    DropdownItem.handlersResults.set(DropdownFunc.CheckProfile, true);
    super.handle(currentUser, currentUserRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

class DeleteUserItem extends DropdownItem { 

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.Region, Place.City, Place.Club])) {
      DropdownItem.handlersResults.set(DropdownFunc.Delete, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.Delete, false);
    }
    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

class EditUserRegionItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void { 
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.Region])) {
      DropdownItem.handlersResults.set(DropdownFunc.EditRegion, true);
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditRegion, false);
    }
    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

class EditUserCityItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.City])) {
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, false);
    }
    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

class EditUserClubItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.Club])) {
      DropdownItem.handlersResults.set(DropdownFunc.EditClub, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditClub, false);
    }
    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//Will be finished in future
class EditUserRoleHandler extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles,
        selectedUserNonAdminRoles, [Place.Region, Place.City, Place.Club])) {    
      DropdownItem.handlersResults.set(DropdownFunc.EditRole, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditRole, false);
    }
    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

class AddUserDegreeItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles,
        selectedUserNonAdminRoles, [Place.Region, Place.City, Place.Club])) {
      DropdownItem.handlersResults.set(DropdownFunc.AddDegree, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.AddDegree, false);
    }
    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//-------------------------------------------------------------------------------------------------------------------------------

//Builds basic CoR for all dropdown items, can be rewritten using 
//pattern 'Builder' to perform different chains for items
class CheckBuilder {

  public build(): ICheck {
    const checkId: IdsSameCheck = new IdsSameCheck(); 
    const userAdmin: UserIsAdminCheck = new UserIsAdminCheck();
    const adminRightsCompare: AdminRightsCompareCheck = new AdminRightsCompareCheck();
    const adminRights: UserHasAdminRolesCheck = new UserHasAdminRolesCheck();
    const placesId: PlaceIdsEqualityHandler = new PlaceIdsEqualityHandler();

    checkId.setNext(userAdmin).setNext(adminRightsCompare).setNext(adminRights).setNext(placesId);

    return checkId;
  }
}

//This checker logic is builded as chain of responsibility (CoR)
//New check must be inherited from Check class
interface ICheck {

  check(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any,
        selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean;

  setNext(next: ICheck): ICheck;
}

abstract class Check implements ICheck {

  private nextHandler: ICheck | null;
    
  constructor() {
    this.nextHandler = null;    
  }

  public setNext(handler: ICheck): ICheck {
    this.nextHandler = handler;
    return this.nextHandler;
  }

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    return this.nextHandler?.check(currentUser, currentUserAdminRoles, selectedUser, 
                                  selectedUserAdminRoles, selectedUserNonAdminRoles, places) ?? true;
  }
}

//Checks if selected user is not the current user
//to prevent editing himself
class IdsSameCheck extends Check {

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    if (currentUser.id !== selectedUser.id) {
      return super.check(currentUser, currentUserAdminRoles, selectedUser, 
                        selectedUserAdminRoles, selectedUserNonAdminRoles, places);
    } else {
      return false;
    }
  }
}

//Checks if current user is Super Admin,
//which has access to everything
class UserIsAdminCheck extends Check {

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    if (currentUserAdminRoles.includes(AdminRole.Admin)) {
      return true;
    } else {
      return super.check(currentUser, currentUserAdminRoles, selectedUser, 
                        selectedUserAdminRoles, selectedUserNonAdminRoles, places);
    }
  }
}


//Compares the admin rights of current and selected user,
//based on their highest roles 
class AdminRightsCompareCheck extends Check {

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    if (selectedUserAdminRoles.length > 0 ? (currentUserAdminRoles[0] < selectedUserAdminRoles[0]) : true) {
      return super.check(currentUser, currentUserAdminRoles, selectedUser, 
                        selectedUserAdminRoles, selectedUserNonAdminRoles, places);
    } else {
      return false;
    }
  }
}


//Checks if user has admin rights (Head, DeputyHead, etc) in chosen place(s)
//Every new place should be added to switch statement
class UserHasAdminRolesCheck extends Check {
    
  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    let chainContinues: boolean = false;
    places.forEach(place => {
      switch (place) {
        case Place.Region: 
          chainContinues = chainContinues ||  this.checkIfUserHasRights(currentUserAdminRoles, [AdminRole.OkrugaHead, AdminRole.OkrugaHeadDeputy]);
          break;
        case Place.City: 
          chainContinues = chainContinues ||  this.checkIfUserHasRights(currentUserAdminRoles, [AdminRole.CityHead, AdminRole.CityHeadDeputy]);
          break;
        case Place.Club: 
          chainContinues = chainContinues || this.checkIfUserHasRights(currentUserAdminRoles, [AdminRole.KurinHead, AdminRole.KurinHeadDeputy]);
          break;
        default:
          chainContinues = true;
      }
    }); 
    
    return chainContinues ? super.check(currentUser, currentUserAdminRoles, selectedUser, 
                                        selectedUserAdminRoles, selectedUserNonAdminRoles, places) : false;
  }

  private checkIfUserHasRights(currUser: Array<AdminRole>, arr: Array<AdminRole>): boolean {
    return currUser.some(x => arr.includes(x));
  }
}

//Checks if user and selected user have same place(s) (Region, City, etc)
//Every new place should be added to switch statement
class PlaceIdsEqualityHandler extends Check {

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles:
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    let chainContinues: boolean = false;
    places.forEach(place => {
      switch (place) {
        case Place.Region: 
          chainContinues = chainContinues ||  this.idsAreEqual(currentUser.regionId, selectedUser.regionId);
          break;
        case Place.City: 
          chainContinues = chainContinues ||  this.idsAreEqual(currentUser.cityId, selectedUser.cityId);
          break;
        case Place.Club: 
          chainContinues = chainContinues || this.idsAreEqual(currentUser.clubId, selectedUser.clubId);
          break;
        default:
          chainContinues = true;
      }
    });
    
    return chainContinues ? super.check(currentUser, currentUserAdminRoles, selectedUser, 
                                        selectedUserAdminRoles, selectedUserNonAdminRoles, places) : false;
  }
  
  private idsAreEqual(firstId: number, secondId: number) {
    return firstId != null && firstId != undefined && secondId != null && secondId != undefined ? 
            firstId === secondId : false;
  }
}
