import { AdminRole } from "../../models/Roles/AdminRole";
import { DropdownFunc } from "../../models/UserTable/DropdownFunc";
import { NonAdminRole } from "../../models/Roles/NonAdminRole";

// WARNING: the content of this file will make you cry;
// God bless this code, coz IDK what I wrote and why I did it

//Enum to check place's id equality and check 
//if user has appropriate rights
enum Place {
  Region  = 0,    //Округа
  City    = 1,    //Станиця
  Club    = 2,    //Курінь
  All     = 3,    //Всі можливі з перерахованих вище пунктів
  None    = 4,    //Не важливий жоден
}

//Basic builder for set of dropdown items, can be extended to pattern 'Builder' (maybe, I'm not sure after all)
export class DropdownItemCreator {

  public build(): IDropdownItem {
    const checkProfileItem: CheckUserProfileItem = new CheckUserProfileItem(); 
    const deleteItem: DeleteUserItem = new DeleteUserItem();
    const editRegionItem: EditUserRegionItem = new EditUserRegionItem();
    const editCityItem: EditUserCityItem = new EditUserCityItem();
    const editClubItem: EditUserClubItem = new EditUserClubItem();
    const editUserRole: EditUserRoleHandler = new EditUserRoleHandler();
    const addDegreeeItem: AddUserDegreeItem = new AddUserDegreeItem();

    const checkerCreator: CheckCreator = new CheckCreator(); 
    DropdownItem.checkCreator = checkerCreator;

    checkProfileItem.setNext(deleteItem).setNext(editClubItem).setNext(editCityItem)
      .setNext(editRegionItem).setNext(addDegreeeItem).setNext(editUserRole);

    return checkProfileItem;
  }
}

export interface IDropdownItem {

  setNext(item: IDropdownItem): IDropdownItem;

  handle(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any,
        selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void;

  getHandlersResults(): Map<DropdownFunc, any>;
}

//Base class for all items in dropdown menu, if you need some extra
//item, just extend this class and make approppriate chain of checks for 
//it in CheckCreator class and call it at the beginning of the method
abstract class DropdownItem implements IDropdownItem {

  static handlersResults: Map<DropdownFunc, any>;     //is static to prevent extra memory consumption
  static checker: ICheck;                             //same reason
  static checkCreator: CheckCreator;                  //I hope you understand

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
}

//Переглянути профіль
class CheckUserProfileItem extends DropdownItem {

  public handle(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {

    DropdownItem.handlersResults.set(DropdownFunc.CheckProfile, true);

    super.handle(currentUser, currentUserRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//Видалити
class DeleteUserItem extends DropdownItem { 

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {

    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForDeleting();

    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [])) {
      DropdownItem.handlersResults.set(DropdownFunc.Delete, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.Delete, false);
    }

    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//Провід округи
class EditUserRegionItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void { 

    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingRights();

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

//Провід станиці
class EditUserCityItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingRights();

    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.City])) {
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, false);
    }

    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//Провід куреня
class EditUserClubItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
                  
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingRights();

    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.Club])) {
      DropdownItem.handlersResults.set(DropdownFunc.EditClub, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditClub, false);
    }

    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//Поточний стан користувача
class EditUserRoleHandler extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {

    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForChangingUserCurrentState();
    
    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.Region, Place.City])) {    
      DropdownItem.handlersResults.set(DropdownFunc.EditRole, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditRole, false);
    }

    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//Додати ступінь
class AddUserDegreeItem extends DropdownItem {

  public handle(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, 
                selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>): void {
    
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForAddingDegree();

    if (DropdownItem.checker.check(currentUser, currentUserAdminRoles, selectedUser, 
        selectedUserAdminRoles, selectedUserNonAdminRoles, [Place.Region, Place.City])) {
      DropdownItem.handlersResults.set(DropdownFunc.AddDegree, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.AddDegree, false);
    }

    super.handle(currentUser, currentUserAdminRoles, selectedUser, selectedUserAdminRoles, selectedUserNonAdminRoles);
  }
}

//-------------------------------------------------------------------------------------------------------------------------------

//Builds CoR for each of the dropdown items, can be rewritten using pattern 
//'Builder' (I'm not sure already) to perform different chains for dropdown items.
//To improve performance we can create all check's separately for each chain 
//of these check's (each method in this class), so each chain will be builded only one time. 
//However, it will take some extra memory and will be more complicated to implement and maintain.
class CheckCreator {

  private checkId: IdsSameCheck = new IdsSameCheck();
  private adminRightsCompare: AdminRightsCompareCheck = new AdminRightsCompareCheck();
  private userHeadAdmin: CurrUserIsHeadAdminCheck = new CurrUserIsHeadAdminCheck();
  private userGovAdmin: CurrUserIsGovAdminCheck = new CurrUserIsGovAdminCheck();
  private hasPlace: SelectedUserHasPlace = new SelectedUserHasPlace();
  private placesId: CurrUserIsAdminForSelectedUserCheck = new CurrUserIsAdminForSelectedUserCheck();
  private falseCheck: FinalFalseCheck = new FinalFalseCheck();

  public rebuildChainForDeleting(): ICheck {

    this.checkId.setNext(this.adminRightsCompare)?.setNext(this.userHeadAdmin)?.setNext(this.userGovAdmin)?.setNext(this.falseCheck)?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForResettingPreviousState(): ICheck {

    this.adminRightsCompare.setNext(this.userHeadAdmin)?.setNext(this.userGovAdmin)?.setNext(null);

    return this.adminRightsCompare;
  }

  public rebuildChainForChangingUserCurrentState(): ICheck {

    this.checkId.setNext(this.adminRightsCompare)?.setNext(this.userHeadAdmin)?.
        setNext(this.userGovAdmin)?.setNext(this.placesId)?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForAddingDegree(): ICheck {

    this.checkId.setNext(this.adminRightsCompare)?.setNext(this.hasPlace)?.
        setNext(this.userHeadAdmin)?.setNext(this.userGovAdmin)?.setNext(this.placesId)?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForSettingRights(): ICheck {

    this.checkId.setNext(this.adminRightsCompare)?.setNext(this.hasPlace)?.
        setNext(this.userHeadAdmin)?.setNext(this.userGovAdmin)?.setNext(this.placesId)?.setNext(null);

    return this.checkId;
  }
}

interface ICheck {

  check(currentUser: any, currentUserRoles: Array<AdminRole>, selectedUser: any,
        selectedUserAdminRoles: Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean;

  setNext(next: ICheck | null): ICheck | null;
}

//This checker logic is builded as chain of responsibility (CoR).
//New check must be inherited from Check class.
//Chain is rebuilded every time for each item in dropdown 
abstract class Check implements ICheck {

  private nextHandler: ICheck | null;
    
  constructor() {
    this.nextHandler = null;    
  }

  public setNext(handler: ICheck | null): ICheck | null {
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

//Checks if current user is HeadAdmin,
//which has access to everything
class CurrUserIsHeadAdminCheck extends Check {

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

//Checks if current user is Governing body Admin,
//which has access to everything except doing sth with HeadAdmin
class CurrUserIsGovAdminCheck extends Check {

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    if (currentUserAdminRoles.includes(AdminRole.GoverningBodyHead)) {
      return true;
    } else {
      return super.check(currentUser, currentUserAdminRoles, selectedUser, 
                        selectedUserAdminRoles, selectedUserNonAdminRoles, places);
    }
  }
}

//Compares the admin rights of current and selected user,
//based on their highest roles. User with lower admin 
//role can't edit user with higher role.
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

//Checks if selected user is in one of the 
//listed places in the array
class SelectedUserHasPlace extends Check {

  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    let chainContinues: boolean = false;
    places.forEach(place => {
      switch (place) {
        case Place.Region: 
          chainContinues = chainContinues ||  selectedUser.regionId !== null;
          break;
        case Place.City: 
          chainContinues = chainContinues ||  selectedUser.cityId !== null;
          break;
        case Place.Club: 
          chainContinues = chainContinues || selectedUser.clubId !== null;
          break;
        default:
          chainContinues = false;
      }
    }); 
    
    return chainContinues ? super.check(currentUser, currentUserAdminRoles, selectedUser, 
                                        selectedUserAdminRoles, selectedUserNonAdminRoles, places) : false;
  }
}

//Checks if current user is in the same place as selected and
//if he has rights in this place to edit selected
class CurrUserIsAdminForSelectedUserCheck extends Check {
  
  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    let chainContinues: boolean = false;
    places.forEach(place => {
      switch (place) {
        case Place.Region: 
          chainContinues = chainContinues || 
                            this.checkIfUserHasRights(currentUserAdminRoles, [AdminRole.OkrugaHead, AdminRole.OkrugaHeadDeputy]) &&
                            this.idsAreEqual(currentUser.regionId, selectedUser.regionId);
          break;
        case Place.City: 
          chainContinues = chainContinues || 
                            this.checkIfUserHasRights(currentUserAdminRoles, [AdminRole.CityHead, AdminRole.CityHeadDeputy]) &&
                            this.idsAreEqual(currentUser.cityId, selectedUser.cityId);
          break;
        case Place.Club: 
          chainContinues = chainContinues || 
                            this.checkIfUserHasRights(currentUserAdminRoles, [AdminRole.KurinHead, AdminRole.KurinHeadDeputy]) &&
                            this.idsAreEqual(currentUser.clubId, selectedUser.clubId);
          break;
        default:
          chainContinues = false;
      }
    }); 
    
    return chainContinues ? super.check(currentUser, currentUserAdminRoles, selectedUser, 
                                        selectedUserAdminRoles, selectedUserNonAdminRoles, places) : false;
  }

  private idsAreEqual(firstId: number, secondId: number) {
    return firstId != null && firstId != undefined && secondId != null && secondId != undefined ? 
            firstId === secondId : false;
  }

  private checkIfUserHasRights(currUser: Array<AdminRole>, arr: Array<AdminRole>): boolean {
    return currUser.some(x => arr.includes(x)); //checks if user has at least one of listed rights
  }
}

//Basically this is the worst mistake. Some check classes stops 
//going through chain when the condition is fine for displaying menu item 
//(like CurrUserIsHeadAdminCheck), and some in opposite (like AdminRightsCompareCheck)
//At the end of chain it returns true, like all conditions were completed successfully.
//However, sometimes it must be in opposite, like in check for 'Delete user' item,
//which will mean that he is neither HeadAdmin nor GovBodyAdmin.
//So, I decided to write this 'gag' (заглушка) check to be able to reverse the end result. 
//Yeah. 
class FinalFalseCheck extends Check {
  
  public check(currentUser: any, currentUserAdminRoles: Array<AdminRole>, selectedUser: any, selectedUserAdminRoles: 
              Array<AdminRole>, selectedUserNonAdminRoles: Array<NonAdminRole>, places: Array<Place>): boolean {
    return false;
  }
}
