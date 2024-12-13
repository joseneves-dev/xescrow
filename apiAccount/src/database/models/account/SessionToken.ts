"use strict";
import bcryptjs from "bcryptjs";
import { DateTime } from "luxon";

import { DataTypes, Model, sql, Op } from "@sequelize/core";
import {
  Attribute,
  Table,
  PrimaryKey,
  NotNull,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from "@sequelize/core/decorators-legacy";

@Table({
  tableName: "SessionToken",
  name: {
    singular: "SessionToken",
    plural: "SessionToken",
  },
})
export class SessionToken extends Model {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(sql.uuidV4)
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare sessionId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare token: string;

  @Attribute(DataTypes.ENUM("refresh", "access", "secondFactor"))
  @NotNull
  declare type: "refresh" | "access" | "secondFactor";

  @Attribute(DataTypes.DATE)
  declare expires: Date;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare active: boolean;

  @BeforeCreate
  static async expire(instance: any) {
    if (instance.type === "access") {
      instance.expires = DateTime.fromJSDate(instance.createdAt)
        .plus({ minutes: 5 })
        .toJSDate();
    }

    if (instance.type === "secondFactor") {
      instance.expires = DateTime.fromJSDate(instance.createdAt)
        .plus({ minutes: 10 })
        .toJSDate();
    }

    if (instance.type === "refresh") {
      instance.expires = DateTime.fromJSDate(instance.createdAt)
        .plus({ hours: 2 })
        .toJSDate();
    }
  }

  @BeforeCreate
  static async deactivate(instance: any) {
    await SessionToken.update(
      { active: false },
      {
        where: {
          id: { [Op.ne]: instance.id },
          sessionId: instance.sessionId,
          type: instance.type,
          active: true,
        },
      }
    );
  }

  @BeforeCreate
  @BeforeUpdate
  static async encrypt(instance: any) {
    const { hash } = bcryptjs;
    const tokenString = instance.token.toString();
    const hashedToken = await hash(tokenString, 5);
    instance.token = hashedToken;
  }
}
