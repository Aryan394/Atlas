using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Atlas.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "transactions",
                type: "integer",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.Sql("""
                UPDATE transactions
                SET "Type" = CASE
                    WHEN "Amount" > 0 THEN 1
                    WHEN "Amount" < 0 THEN 2
                    ELSE 3
                END;

                UPDATE transactions
                SET "Amount" = ABS("Amount");
                """);

            migrationBuilder.CreateIndex(
                name: "IX_transactions_Type",
                table: "transactions",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE transactions
                SET "Amount" = CASE
                    WHEN "Type" = 2 THEN -ABS("Amount")
                    ELSE ABS("Amount")
                END;
                """);

            migrationBuilder.DropIndex(
                name: "IX_transactions_Type",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "transactions");
        }
    }
}
