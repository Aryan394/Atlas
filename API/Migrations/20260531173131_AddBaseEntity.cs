using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Moneytize.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_Email",
                table: "users");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "users",
                newName: "CreationTime");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorUserId",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeleterUserId",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletionTime",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModificationTime",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastModifierUserId",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "transactions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorUserId",
                table: "transactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeleterUserId",
                table: "transactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletionTime",
                table: "transactions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "transactions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModificationTime",
                table: "transactions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LastModifierUserId",
                table: "transactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_Date",
                table: "transactions",
                column: "Date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_Email",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_transactions_Date",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "CreatorUserId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "DeleterUserId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "DeletionTime",
                table: "users");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "users");

            migrationBuilder.DropColumn(
                name: "LastModificationTime",
                table: "users");

            migrationBuilder.DropColumn(
                name: "LastModifierUserId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "CreatorUserId",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "DeleterUserId",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "DeletionTime",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "LastModificationTime",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "LastModifierUserId",
                table: "transactions");

            migrationBuilder.RenameColumn(
                name: "CreationTime",
                table: "users",
                newName: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);
        }
    }
}
