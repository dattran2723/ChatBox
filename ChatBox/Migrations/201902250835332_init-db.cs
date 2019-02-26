namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initdb : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Messages", "DateRead", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Messages", "DateRead", c => c.DateTime(nullable: false));
        }
    }
}
