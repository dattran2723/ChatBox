namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initdb : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Messages", "IsRead", c => c.Boolean(nullable: false));
            AddColumn("dbo.Messages", "DateRead", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Messages", "DateRead");
            DropColumn("dbo.Messages", "IsRead");
        }
    }
}
