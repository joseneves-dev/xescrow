"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  Default,
  HasOne,
} from "@sequelize/core/decorators-legacy";

import { UserAuth } from "./UserAuth";
import { UserRole } from "./UserRole";
import { UserEmailAddress } from "./UserEmailAddress";
import { UserPhoneNumber } from "./UserPhoneNumber";
import { UserApp } from "./UserApp";
import { UserIdentity } from "./UserIdentity";
import { UserResidence } from "./UserResidence";
import { UserWallet } from "./UserWallet";
import { UserSettings } from "./UserSettings";
import { UserNotificationsAccount } from "./UserNotificationsAccount";
import { UserNotificationsMarketing } from "./UserNotificationsMarketing";

@Table({
  tableName: "User",
  name: {
    singular: "User",
    plural: "User",
  },
})
export class User extends Model {
  @HasOne(() => UserAuth, "userId")
  declare auth?: NonAttribute<UserAuth>;

  @HasOne(() => UserRole, "userId")
  declare role?: NonAttribute<UserRole>;

  @HasOne(() => UserEmailAddress, "userId")
  declare emailAddress?: NonAttribute<UserEmailAddress>;

  @HasOne(() => UserPhoneNumber, "userId")
  declare phoneNumber?: NonAttribute<UserPhoneNumber>;

  @HasOne(() => UserApp, "userId")
  declare app?: NonAttribute<UserApp>;

  @HasOne(() => UserIdentity, "userId")
  declare identity?: NonAttribute<UserIdentity>;

  @HasOne(() => UserResidence, "userId")
  declare residence?: NonAttribute<UserResidence>;

  @HasOne(() => UserWallet, "userId")
  declare wallet?: NonAttribute<UserRole>;

  @HasOne(() => UserSettings, "userId")
  declare settings?: NonAttribute<UserSettings>;

  @HasOne(() => UserNotificationsAccount, "userId")
  declare notificationsAccount?: NonAttribute<UserNotificationsAccount>;

  @HasOne(() => UserNotificationsMarketing, "userId")
  declare notificationsMarketing?: NonAttribute<UserNotificationsMarketing>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;
}
