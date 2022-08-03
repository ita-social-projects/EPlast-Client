import { AdminRole } from "../../models/Roles/AdminRole";
import { DropdownFunc } from "../../models/UserTable/DropdownFunc";
import { NonAdminRole } from "../../models/Roles/NonAdminRole";
import { Roles } from "../../models/Roles/Roles";

// WARNING: the content of this file will make you cry;
// God bless this code, coz IDK what I wrote and why I did it

//    ~~~++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++~~~
//    !!!!!-----PLEASE READ ALL COMMENTS BEFORE EDITING ANYTHING-----!!!!!
//    ~~~++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++~~~

// So, basically this file is designed to incapsulate all logic of building the context menu on UserTable.
// In other files logic of user accesses will be on backend in JSON file (at least that's what we agreed to start doing on 04.11.2021)
// However, when I had a task to correct access logic on UT (a month before mentioned date), I wasn't aware of such a possibility,
// so I did all of needed stuff here. Maybe, it was my biggest mistake, because now you need to read all of this comments in order to
// understand what's going on here. Honestly, I was allowed to keep this file and don't rewrite accesses on backend only
// because I had done a lot of work here despite the fact that everyone know that it's really terrible. I'm sorry.
// After all this entry, there are a few instructions if you'll need to change smth. If things are going too wrong, you can
// ask Ira how to contact me and tell me all what you think about this creep. Good luck.

//                                      INSTRUCTIONS
//
//  (1) ===== NEW ROLE, like Admin or Governing Body Admin (with a lot of rights), was added =====
//    1. Edit enum 'AdminRole', which is located in 'EPLAST-CLIENT\src\models\Roles' - you need to add
//        name of this new role to this hierarchy on corresponding position
//    2. Create a new derivative class from abstract class 'Check' and call it like 'CurrUserIsNameOfAdmin'
//        (for example look on CurrUserIsGovAdminCheck or CurrUserIsHeadAdminCheck)
//    3. Override base method 'check', include in it if/else statement, which will check
//        if there is necessary role in array of roles
//    4. Then you need to include this new check class in all chains in 'CheckCreator' on appropriate position
//        (like it's with Admin)
//
//  (2) ===== NEW ROLE, like Region (deputy) Head or Club (deputy) Head, was added             =====
//      ===== (if it was added with new place, like Region or Club, see also next instruction) =====
//    1. Edit enum 'AdminRole', which is located in 'EPLAST-CLIENT\src\models\Roles' - you need to add
//        name of this new role to this hierarchy on corresponding position (if it goes with new place
//        - check instruction 3)
//    2. Add it to all switch statements in file with similar roles, like in class
//        'CurrUserIsAdminForSelectedUserCheck' or 'SelectedUserHasPlace'
//
//  (3) ===== NEW PLACE, like Region or Club, was added =====
//    1. Edit enum 'Place' in current file, add it on the appropriate place in hierarchy
//    2. Add it to all switch statements in file where this enum is used, like in class
//        'CurrUserIsAdminForSelectedUserCheck' or 'SelectedUserHasPlace'
//
//  (4) ===== NEW ITEM in context menu was added =====
//    1. Create a new derivative class from abstract class 'DropdownItem' with name like 'NewItem',
//    2. Override method 'handle', using in it if/else statement, where first one, for example, will
//        set map of results to true, and else in false (for example)
//    3. Create new method in CheckCreator class and write appropriate set of checks in chain
//    4. Remember to call method from clause 3 in method from clause 2.
//    5. Add this new item to method 'build' in 'DropdownItemCreator' (like all other items),
//        (it doesn't affect the context menu itself, only order of check)
//    6. Use the results of this map in file DropDownUserTable.tsx
//
//  (5) ==== NEW ROLE (non-admin) was added, like PlastMember =====
//    1. Add this role to enum 'NonAdminRole' in 'EPLAST-CLIENT\src\models\Roles'
//
//  (6) === NEW CHECK needed =====
//    1. Create a new derivative class from abstract class 'Check' with name 'NewCheck',
//    2. Override method 'check', using in it if/else statement, where one will
//        continue the chain, and the other one will return false value to cancel all
//        further checks and block this menu item for current user. If there is some
//        troubles with stopping the chain (don't always need to end if check fails),
//        you can look at the end of the file, there is one class (FinalFalseCheck), which
//        is helpful with such kind of situations
//    3. Add it to needed methods in CheckBuilder class
//

//Enum to check place's id equality and check
//if user has appropriate rights
enum Place {
  Region = 0, //Округа
  City = 1, //Станиця
  Club = 2, //Курінь
  GoverningBody = 3, //Провід Пласту
}

//Basic builder for set of dropdown items
export class DropdownItemCreator {
  public build(): IDropdownItem {
    const checkProfileItem: CheckUserProfileItem = new CheckUserProfileItem();
    const deleteItem: DeleteUserItem = new DeleteUserItem();
    const editRegionItem: EditUserRegionItem = new EditUserRegionItem();
    const editCityItem: EditUserCityItem = new EditUserCityItem();
    const editClubItem: EditUserClubItem = new EditUserClubItem();
    const editUserRole: EditUserRoleHandler = new EditUserRoleHandler();
    const removeCityFollowerItem: RemoveCityFollowerItem = new RemoveCityFollowerItem();
    const changeUserDegreeItem: ChangeUserDegreeItem = new ChangeUserDegreeItem();
    const addUserDegree: AddUserDegree = new AddUserDegree();
    const editGoverningBodyItem: EditUserGoverningBodyItem = new EditUserGoverningBodyItem();
    const deleteGoverningBodyItem: DeleteUserGoverningBodyItem = new DeleteUserGoverningBodyItem();

    const checkerCreator: CheckCreator = new CheckCreator();
    DropdownItem.checkCreator = checkerCreator;

    //List of all items in context menu is recorded as linked list. It doesn't carry any
    //semantic load, only used for sequential check of each item in this list)
    checkProfileItem
      .setNext(deleteItem)
      .setNext(editClubItem)
      .setNext(editCityItem)
      .setNext(editRegionItem)
      .setNext(editGoverningBodyItem)
      .setNext(deleteGoverningBodyItem)
      .setNext(removeCityFollowerItem)
      .setNext(changeUserDegreeItem)
      .setNext(addUserDegree)
      .setNext(editUserRole);
    return checkProfileItem;
  }
}

export interface IDropdownItem {
  //This method will set the next item to check it for visibility
  setNext(item: IDropdownItem): IDropdownItem;

  //The method to call the check chain and set the map of results
  handle(
    currentUser: any,
    currentUserRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void;

  //Gets called in DropDownUserTable.tsx to receive the map with results of all checks
  getHandlersResults(): Map<DropdownFunc, any>;
}

//Base class for all items in dropdown menu, if you need some extra
//item, just extend this class and make approppriate chain of checks for
//it in CheckCreator class and call it at the beginning of the method
abstract class DropdownItem implements IDropdownItem {
  static handlersResults: Map<DropdownFunc, any>; //is static to prevent extra memory consumption
  static checker: ICheck; //same reason
  static checkCreator: CheckCreator; //I hope you understand

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

  public handle(
    currentUser: any,
    currentUserRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    return this.nextHandler?.handle(
      currentUser,
      currentUserRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Переглянути профіль
class CheckUserProfileItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.handlersResults.set(DropdownFunc.CheckProfile, true);

    super.handle(
      currentUser,
      currentUserRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Видалити
class DeleteUserItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForDeleting();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        []
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.Delete, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.Delete, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Провід округи
class EditUserRegionItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingRegionAdministration();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.Region]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.EditRegion, true);
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditRegion, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Провід станиці
class EditUserCityItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingCityAdministration();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.City]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditCity, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Провід куреня
class EditUserClubItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingKurinAdministration();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.Club]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.EditClub, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditClub, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Крайовий провід
class EditUserGoverningBodyItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForSettingGoverningBodyAdministration();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.GoverningBody]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.EditGoverningBody, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditGoverningBody, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Видалити Крайового адміна
class DeleteUserGoverningBodyItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForDeleteGoverningBodiesAdmins();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.GoverningBody]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.DeleteGoverningBody, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.DeleteGoverningBody, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Поточний стан користувача
class EditUserRoleHandler extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForChangingUserCurrentState();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.Region, Place.City]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.EditRole, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.EditRole, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Змінити ступінь
class ChangeUserDegreeItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForChangeUserDegree();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.Region, Place.City]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.ChangeDegree, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.ChangeDegree, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//Прийняти до станиці
class AddUserDegree extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForAddingUserDegree();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.Region, Place.City]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.AddDegree, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.AddDegree, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

class RemoveCityFollowerItem extends DropdownItem {
  public handle(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>
  ): void {
    DropdownItem.checker = DropdownItem.checkCreator.rebuildChainForRemovingAFollower();

    if (
      DropdownItem.checker.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        [Place.City, Place.Club]
      )
    ) {
      DropdownItem.handlersResults.set(DropdownFunc.DeleteFollower, true);
    } else {
      DropdownItem.handlersResults.set(DropdownFunc.DeleteFollower, false);
    }

    super.handle(
      currentUser,
      currentUserAdminRoles,
      selectedUser,
      selectedUserAdminRoles,
      selectedUserNonAdminRoles
    );
  }
}

//-------------------------------------------------------------------------------------------------------------------------------

/*READ BEFORE CREATING NEW CHECKS*/

//CheckCreator builds CoR for each of the dropdown items
//Keep in mind that every Chain has to be completed from the first to the last check in order to
//show an Item in context menu.
//It means that every Check either invokes next Check or returns false and stops the chain.
//If check returns false Item will not show in context menu.

//To improve performance we can create all check's separately for each chain
//of these check's (each method in this class), so each chain will be builded only one time.
//However, it will take some extra memory and will be more complicated to implement and maintain.
class CheckCreator {
  private checkId: IdsSameCheck = new IdsSameCheck();
  private adminRightsCompare: AdminRightsCompareCheck = new AdminRightsCompareCheck();
  private currentUserIsAdminForSelectedUser: CurrentUserIsAdminForSelectedUserCheck = new CurrentUserIsAdminForSelectedUserCheck();
  private currentUserCanDeleteSelectedUser: CurrentUserCanDeleteSelectedUserCheck = new CurrentUserCanDeleteSelectedUserCheck();
  private currentUserCanChangeStateOfSelectedUser: CurrentUserCanChangeStateOfSelectedUserCheck = new CurrentUserCanChangeStateOfSelectedUserCheck();
  private currentUserCanChangeDegreeOfSelectedUser: CurrentUserCanChangeDegreeOfSelectedUser = new CurrentUserCanChangeDegreeOfSelectedUser();
  private currentUserCanEditGoverningBodyProvid: CurrentUserCanEditGoverningBodyProvid = new CurrentUserCanEditGoverningBodyProvid();
  private currentUserCanEditCityAdministration: CurrentUserCanEditCityAdministration = new CurrentUserCanEditCityAdministration();
  private currentUserCanEditRegionAdministration: CurrentUserCanEditRegionAdministration = new CurrentUserCanEditRegionAdministration();
  private currentUserCanEditKurinAdministration: CurrentUserCanEditKurinAdministration = new CurrentUserCanEditKurinAdministration();

  private selectedUserGovAdmin: SelectedUserIsGovAdminCheck = new SelectedUserIsGovAdminCheck();
  private selectedUserIsPlastMemberCheck: SelectedUserIsPlastMemberCheck = new SelectedUserIsPlastMemberCheck();
  private selectedUserIsNotRegisteredUser: SelectedUserIsNotRegisteredUser = new SelectedUserIsNotRegisteredUser();

  private selectedUserIsRegisteredCheck: SelectedUserIsRegisteredCheck = new SelectedUserIsRegisteredCheck();
  private selectedUserIsInPlace: SelectedUserIsInPlace = new SelectedUserIsInPlace();
  private falseCheck: FinalFalseCheck = new FinalFalseCheck();

  private followerCheck: SelectedUserIsAFollowerCheck = new SelectedUserIsAFollowerCheck();
  private notAFollowerCheck: SelectedUserIsNotAFollowerCheck = new SelectedUserIsNotAFollowerCheck();

  public rebuildChainForDeleting(): ICheck {
    this.checkId
      .setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserCanDeleteSelectedUser)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForChangingUserCurrentState(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsNotRegisteredUser)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanChangeStateOfSelectedUser)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForChangeUserDegree(): ICheck {
    this.checkId
      .setNext(this.notAFollowerCheck)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanChangeDegreeOfSelectedUser)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForAddingUserDegree(): ICheck {
    this.checkId
      .setNext(this.followerCheck)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanChangeDegreeOfSelectedUser)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForSettingGoverningBodyAdministration(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsNotRegisteredUser)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.selectedUserIsPlastMemberCheck)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanEditGoverningBodyProvid)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForRemovingAFollower(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsInPlace)
      ?.setNext(this.followerCheck)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForSettingCityAdministration(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsNotRegisteredUser)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanEditCityAdministration)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForSettingRegionAdministration(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsNotRegisteredUser)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanEditRegionAdministration)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForSettingKurinAdministration(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsNotRegisteredUser)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.selectedUserIsPlastMemberCheck)
      ?.setNext(this.currentUserIsAdminForSelectedUser)
      ?.setNext(this.currentUserCanEditKurinAdministration)
      ?.setNext(null);

    return this.checkId;
  }

  public rebuildChainForDeleteGoverningBodiesAdmins(): ICheck {
    this.checkId
      .setNext(this.selectedUserIsNotRegisteredUser)
      ?.setNext(this.adminRightsCompare)
      ?.setNext(this.selectedUserGovAdmin)
      ?.setNext(null);

    return this.checkId;
  }
}

interface ICheck {
  check(
    currentUser: any,
    currentUserRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean;

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

  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    return (
      this.nextHandler?.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      ) ?? true
    );
  }

  protected checkIfUserHasRights(
    currUserRoles: Array<AdminRole>,
    arr: Array<AdminRole>
  ): boolean {
    return currUserRoles.some((x) => arr.includes(x)); //checks if user has at least one of listed rights
  }

  protected checkIdsAreEqual(firstId: number, secondId: number) {
    return firstId != null &&
      firstId != undefined &&
      secondId != null &&
      secondId != undefined
      ? firstId === secondId
      : false;
  }
}

//Checks if selected user is not the current user
//to prevent editing himself
class IdsSameCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (currentUser.id !== selectedUser.id) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class CurrentUserCanDeleteSelectedUserCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class CurrentUserCanChangeStateOfSelectedUserCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
        AdminRole.OkrugaHead,
        AdminRole.OkrugaHeadDeputy,
        AdminRole.OkrugaReferentUPS,
        AdminRole.OkrugaReferentUSP,
        AdminRole.OkrugaReferentOfActiveMembership,
        AdminRole.CityHead,
        AdminRole.CityHeadDeputy,
        AdminRole.CityReferentUPS,
        AdminRole.CityReferentUSP,
        AdminRole.CityReferentOfActiveMembership,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class CurrentUserCanChangeDegreeOfSelectedUser extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
        AdminRole.OkrugaHead,
        AdminRole.OkrugaHeadDeputy,
        AdminRole.OkrugaReferentUPS,
        AdminRole.OkrugaReferentUSP,
        AdminRole.OkrugaReferentOfActiveMembership,
        AdminRole.CityHead,
        AdminRole.CityHeadDeputy,
        AdminRole.CityReferentUPS,
        AdminRole.CityReferentUSP,
        AdminRole.CityReferentOfActiveMembership,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Checks if selected user is in one of the
//listed places in the array
class SelectedUserIsInPlace extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    let chainContinues: boolean = false;
    places.forEach((place) => {
      switch (place) {
        case Place.Region:
          chainContinues = chainContinues || selectedUser.regionId !== null;
          break;
        case Place.City:
          chainContinues = chainContinues || selectedUser.cityId !== null;
          break;
        case Place.Club:
          chainContinues = chainContinues || selectedUser.clubId !== null;
          break;
        case Place.GoverningBody:
          chainContinues =
            chainContinues || selectedUser.governingBodyId !== null;
          break;
        default:
          chainContinues = false;
      }
    });

    return chainContinues
      ? super.check(
          currentUser,
          currentUserAdminRoles,
          selectedUser,
          selectedUserAdminRoles,
          selectedUserNonAdminRoles,
          places
        )
      : false;
  }
}

class CurrentUserCanEditRegionAdministration extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
        AdminRole.OkrugaHead,
        AdminRole.OkrugaHeadDeputy,
        AdminRole.OkrugaReferentUPS,
        AdminRole.OkrugaReferentUSP,
        AdminRole.OkrugaReferentOfActiveMembership,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Checks if selected user is a follower in a City or a Club
class SelectedUserIsAFollowerCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      selectedUser.isCityFollower ||
      selectedUser.isClubFollower ||
      selectedUser.cityId === null ||
      selectedUser.regionId === null
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Inverted version of the previous check
class SelectedUserIsNotAFollowerCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      !selectedUser.isCityFollower &&
      !selectedUser.isClubFollower &&
      selectedUser.cityId !== null &&
      selectedUser.regionId !== null
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Checks if selected user is Governing body Admin,
class CurrentUserIsAdminForSelectedUserCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    }
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.OkrugaHead,
        AdminRole.OkrugaHeadDeputy,
        AdminRole.OkrugaReferentUPS,
        AdminRole.OkrugaReferentUSP,
        AdminRole.OkrugaReferentOfActiveMembership,
      ]) &&
      this.checkIdsAreEqual(currentUser.regionId, selectedUser.regionId)
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    }
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.CityHead,
        AdminRole.CityHeadDeputy,
        AdminRole.CityReferentUPS,
        AdminRole.CityReferentUSP,
        AdminRole.CityReferentOfActiveMembership,
      ]) &&
      this.checkIdsAreEqual(currentUser.cityId, selectedUser.cityId)
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    }
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.KurinHead,
        AdminRole.KurinHeadDeputy,
      ]) &&
      this.checkIdsAreEqual(currentUser.clubId, selectedUser.clubId)
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class CurrentUserCanEditCityAdministration extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
        AdminRole.OkrugaHead,
        AdminRole.OkrugaHeadDeputy,
        AdminRole.OkrugaReferentUPS,
        AdminRole.OkrugaReferentUSP,
        AdminRole.OkrugaReferentOfActiveMembership,
        AdminRole.CityHead,
        AdminRole.CityHeadDeputy,
        AdminRole.CityReferentUPS,
        AdminRole.CityReferentUSP,
        AdminRole.CityReferentOfActiveMembership,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class CurrentUserCanEditKurinAdministration extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
        AdminRole.KurinHead,
        AdminRole.KurinHeadDeputy,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class CurrentUserCanEditGoverningBodyProvid extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (
      this.checkIfUserHasRights(currentUserAdminRoles, [
        AdminRole.Admin,
        AdminRole.GoverningBodyAdmin,
        AdminRole.GoverningBodyHead,
      ])
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Checks if selected user is Plast Member,
class SelectedUserIsPlastMemberCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (selectedUserNonAdminRoles.includes(NonAdminRole.PlastMember)) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Checks if selected user is Registered,
class SelectedUserIsRegisteredCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (selectedUserNonAdminRoles.includes(NonAdminRole.RegisteredUser)) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

//Checks if selected user is Governing body Admin,
class SelectedUserIsGovAdminCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (selectedUserAdminRoles.includes(AdminRole.GoverningBodyAdmin)) {
      return true;
    } else {
      return false;
    }
  }
}

//Compares the admin rights of current and selected user,
//based on their highest roles. User with lower admin
//role can't edit user with higher role.
class AdminRightsCompareCheck extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (selectedUserAdminRoles.length == 0) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    }
    if (
      selectedUserAdminRoles.length > 0 &&
      currentUserAdminRoles[0] < selectedUserAdminRoles[0]
    ) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
  }
}

class SelectedUserIsNotRegisteredUser extends Check {
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    if (!selectedUserNonAdminRoles.includes(NonAdminRole.RegisteredUser)) {
      return super.check(
        currentUser,
        currentUserAdminRoles,
        selectedUser,
        selectedUserAdminRoles,
        selectedUserNonAdminRoles,
        places
      );
    } else {
      return false;
    }
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
  public check(
    currentUser: any,
    currentUserAdminRoles: Array<AdminRole>,
    selectedUser: any,
    selectedUserAdminRoles: Array<AdminRole>,
    selectedUserNonAdminRoles: Array<NonAdminRole>,
    places: Array<Place>
  ): boolean {
    return false;
  }
}
