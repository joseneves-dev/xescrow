"use strict";
import { DataTypes, Model, sql, NonAttribute } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  HasOne,
  BeforeUpdate,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";

import { EmailVerification } from "./EmailVerification";

@Table({
  tableName: "UserEmailAddress",
  name: {
    singular: "UserEmailAddress",
    plural: "UserEmailAddress",
  },
})
export class UserEmailAddress extends Model {
  @HasOne(() => EmailVerification, "emailId")
  declare verification?: NonAttribute<EmailVerification>;

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare verified: boolean;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeUpdate
  static async deactivate(instance: any) {
    if (instance.active === false || instance.verified === true) {
      await EmailVerification.update(
        { active: false },
        {
          where: {
            emailId: instance.id,
            active: true,
          },
        }
      );
    }
  }
}
